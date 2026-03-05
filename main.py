from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
import sqlite3
import os
import json
import time
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv()

app = FastAPI()
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


# Conexão com o Banco de Dados
def get_db():
    conn = sqlite3.connect("resources.db")
    conn.row_factory = sqlite3.Row
    return conn


# Inicializar Banco de Dados
with get_db() as conn:
    conn.execute("""
        CREATE TABLE IF NOT EXISTS resources (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            type TEXT NOT NULL,
            url TEXT,
            tags TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    """)


# Modelos para Validação (Pydantic)
class Resource(BaseModel):
    titulo: str
    descricao: str
    tipo: str
    url: str
    tags: List[str]


class AIRequest(BaseModel):
    titulo: str
    tipo: str


# Rota de Observabilidade / Health
@app.get("/api/health")
def health_check():
    return {"status": "ok", "timestamp": time.time()}


# Listar Recursos (GET)
@app.get("/api/resources")
def get_resources(page: int = 1, limit: int = 10):
    offset = (page - 1) * limit
    with get_db() as conn:
        resources = conn.execute(
            "SELECT * FROM resources ORDER BY created_at DESC LIMIT ? OFFSET ?",
            (limit, offset),
        ).fetchall()

        total = conn.execute("SELECT COUNT(*) FROM resources").fetchone()[0]

        dados_formatados = []
        for r in resources:
            dados_formatados.append(
                {
                    "id": r["id"],
                    "titulo": r["title"],
                    "descricao": r["description"],
                    "tipo": r["type"],
                    "url": r["url"],
                    "tags": json.loads(r["tags"]) if r["tags"] else [],
                    "criado_em": r["created_at"],
                }
            )

        return {
            "dados": dados_formatados,
            "meta": {
                "pagina": page,
                "limite": limit,
                "total": total,
                "totalPaginas": (total + limit - 1) // limit,
            },
        }


# Criar Recurso (POST)
@app.post("/api/resources")
def create_resource(resource: Resource):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO resources (title, description, type, url, tags) VALUES (?, ?, ?, ?, ?)",
            (
                resource.titulo,
                resource.descricao,
                resource.tipo,
                resource.url,
                json.dumps(resource.tags),
            ),
        )
        resource_id = cursor.lastrowid
        return {"id": resource_id, **resource.dict()}


# Atualizar Recurso (PUT)
@app.put("/api/resources/{resource_id}")
def update_resource(resource_id: int, resource: Resource):
    with get_db() as conn:
        conn.execute(
            "UPDATE resources SET title = ?, description = ?, type = ?, url = ?, tags = ? WHERE id = ?",
            (
                resource.titulo,
                resource.descricao,
                resource.tipo,
                resource.url,
                json.dumps(resource.tags),
                resource_id,
            ),
        )
        return {"id": resource_id, **resource.dict()}


# Deletar Recurso (DELETE)
@app.delete("/api/resources/{resource_id}")
def delete_resource(resource_id: int):
    with get_db() as conn:
        conn.execute("DELETE FROM resources WHERE id = ?", (resource_id,))
        return {"sucesso": True}


# Assistente IA (POST)
@app.post("/api/ai/generate")
def generate_ai(req: AIRequest):
    start_time = time.time()
    prompt = f"""
        Você é um Assistente Pedagógico. 
        Gere uma descrição educacional concisa (máximo de 2 frases) e 3 tags relevantes para um recurso de aprendizagem.
        Título do Recurso: "{req.titulo}"
        Tipo do Recurso: "{req.tipo}"
    """

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=types.Schema(
                    type=types.Type.OBJECT,
                    properties={
                        "descricao": types.Schema(type=types.Type.STRING),
                        "tags": types.Schema(
                            type=types.Type.ARRAY,
                            items=types.Schema(type=types.Type.STRING),
                        ),
                    },
                    required=["descricao", "tags"],
                ),
            ),
        )

        latency_ms = round((time.time() - start_time) * 1000, 2)

        # Log Estruturado
        print(
            json.dumps(
                {
                    "nivel": "INFO",
                    "evento": "Requisicao_IA",
                    "titulo": req.titulo,
                    "latencia": f"{latency_ms}ms",
                }
            )
        )

        return json.loads(response.text)

    except Exception as e:
        print(f"Erro na IA: {e}")
        raise HTTPException(status_code=500, detail="Falha ao gerar conteúdo")
