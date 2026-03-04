import { Recurso, RespostaPaginada } from '../types';

export const api = {
  async obterRecursos(pagina = 1, limite = 10): Promise<RespostaPaginada<Recurso>> {
    const res = await fetch(`/api/resources?page=${pagina}&limit=${limite}`);
    return res.json();
  },

  async criarRecurso(recurso: Recurso): Promise<Recurso> {
    const res = await fetch('/api/resources', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(recurso),
    });
    return res.json();
  },

  async atualizarRecurso(id: number, recurso: Recurso): Promise<Recurso> {
    const res = await fetch(`/api/resources/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(recurso),
    });
    return res.json();
  },

  async deletarRecurso(id: number): Promise<void> {
    await fetch(`/api/resources/${id}`, { method: 'DELETE' });
  },

  async gerarConteudoInteligente(titulo: string, tipo: string): Promise<{ descricao: string; tags: string[] }> {
    const res = await fetch('/api/ai/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ titulo, tipo }),
    });
    if (!res.ok) throw new Error('Falha na geração de IA');
    return res.json();
  }
};
