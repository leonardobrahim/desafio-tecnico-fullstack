export interface Recurso {
  id?: number;
  titulo: string;
  descricao: string;
  tipo: 'Video' | 'PDF' | 'Link';
  url: string;
  tags: string[];
  criado_em?: string;
}

export interface RespostaPaginada<T> {
  dados: T[];
  meta: {
    pagina: number;
    limite: number;
    total: number;
    totalPaginas: number;
  };
}
