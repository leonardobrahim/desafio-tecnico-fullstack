# Hub Inteligente de Recursos Educacionais 🧠📚

Uma aplicação Fullstack desenvolvida para o gerenciamento de materiais didáticos, contando com o recurso "Smart Assist" movido por Inteligência Artificial para sugestão automática de descrições e categorizações.

## 🚀 Tecnologias Utilizadas

**Frontend:**

- React (SPA) + Vite
- TypeScript
- Tailwind CSS + Lucide React (Ícones)
- Tratamento de estados de carregamento (Loading state para IA)

**Backend:**

- Python + FastAPI (Requisito: Opção A)
- Pydantic (Validação de dados)
- SQLite (Banco de dados leve e embutido)

**Inteligência Artificial:**

- Google Gemini API (gemini-2.5-flash)
- Prompt Engineering focado no papel de "Assistente Pedagógico"

**DevOps & Observabilidade (Diferenciais Implementados):**

- **Logs Estruturados:** Registro de requisições da IA incluindo uso, latência e título do recurso.
- **Health Check:** Endpoint `/api/health` para monitoramento.
- **Integração Contínua (CI):** Pipeline no GitHub Actions rodando `flake8` e `black` para garantir a padronização do código Python a cada push.

---

## ⚙️ Como executar o projeto localmente

### Pré-requisitos

- Node.js (v18+)
- Python (3.9+)
- Chave de API do Google Gemini

### Passo 1: Configurar Variáveis de Ambiente

Na raiz do projeto, crie um arquivo `.env` (adicione-o ao `.gitignore` para não vazar sua chave) e insira:

```env
GEMINI_API_KEY="sua_chave_de_api_aqui"
```

### Passo 2: Rodar o Backend (Python/FastAPI)

Abra um terminal na raiz do projeto e execute:

# Crie e ative o ambiente virtual

```bash
python -m venv venv
source venv/bin/activate  # No Windows use: venv\Scripts\activate
```

# Instale as dependências

```bash
pip install -r requirements.txt
```

# Inicie o servidor (Rodará na porta 8000)

```bash
uvicorn main:app --reload
```

### Passo 3: Rodar o Frontend (React/Vite)

Abra um segundo terminal na raiz do projeto e execute:

# Instale as dependências do Node

```bash
npm install
```

# Inicie o servidor de desenvolvimento (Rodará na porta 5173)

```bash
npm run dev
```

Acesse http://localhost:5173 no seu navegador. O Vite está configurado com um proxy que redireciona automaticamente as chamadas /api para o backend em Python.

## 💡 Funcionalidades

**CRUD Completo:**

- Criação, leitura (com suporte a paginação na API), atualização e exclusão de recursos.

**mart Assist:**

- Integração com IA para gerar descrições e tags automaticamente com base no título e tipo do material, retornando dados em JSON estrito.
