import React, { useState } from 'react';
import { Recurso } from '../types';
import { api } from '../services/api';
import { Loader2, Sparkles } from 'lucide-react';

interface PropsFormularioRecurso {
  dadosIniciais?: Recurso;
  aoSucesso: () => void;
  aoCancelar: () => void;
}

export default function FormularioRecurso({ dadosIniciais, aoSucesso, aoCancelar }: PropsFormularioRecurso) {
  const [dadosFormulario, setDadosFormulario] = useState<Recurso>(
    dadosIniciais || {
      titulo: '',
      descricao: '',
      tipo: 'Link',
      url: '',
      tags: [],
    }
  );
  const [gerando, setGerando] = useState(false);
  const [entradaTag, setEntradaTag] = useState('');

  const lidarComEnvio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (dadosIniciais?.id) {
      await api.atualizarRecurso(dadosIniciais.id, dadosFormulario);
    } else {
      await api.criarRecurso(dadosFormulario);
    }
    aoSucesso();
  };

  const lidarComAssistenteInteligente = async () => {
    if (!dadosFormulario.titulo) return;
    setGerando(true);
    try {
      const resultado = await api.gerarConteudoInteligente(dadosFormulario.titulo, dadosFormulario.tipo);
      setDadosFormulario(prev => ({
        ...prev,
        descricao: resultado.descricao,
        tags: [...new Set([...prev.tags, ...resultado.tags])]
      }));
    } catch (erro) {
      console.error(erro);
      alert('Falha ao gerar conteúdo. Por favor, tente novamente.');
    } finally {
      setGerando(false);
    }
  };

  const adicionarTag = () => {
    if (entradaTag.trim()) {
      setDadosFormulario(prev => ({ ...prev, tags: [...prev.tags, entradaTag.trim()] }));
      setEntradaTag('');
    }
  };

  return (
    <form onSubmit={lidarComEnvio} className="space-y-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
          <input
            type="text"
            required
            value={dadosFormulario.titulo}
            onChange={e => setDadosFormulario({ ...dadosFormulario, titulo: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
            placeholder="ex: Introdução ao Cálculo"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
            <select
              value={dadosFormulario.tipo}
              onChange={e => setDadosFormulario({ ...dadosFormulario, tipo: e.target.value as any })}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="Link">Link</option>
              <option value="Video">Vídeo</option>
              <option value="PDF">PDF</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
            <input
              type="url"
              required
              value={dadosFormulario.url}
              onChange={e => setDadosFormulario({ ...dadosFormulario, url: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="https://..."
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-medium text-gray-700">Descrição</label>
            <button
              type="button"
              onClick={lidarComAssistenteInteligente}
              disabled={!dadosFormulario.titulo || gerando}
              className="text-xs flex items-center gap-1.5 text-indigo-600 hover:text-indigo-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {gerando ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Sparkles className="w-3 h-3" />
              )}
              {gerando ? 'Pensando...' : 'Gerar com IA'}
            </button>
          </div>
          <textarea
            required
            value={dadosFormulario.descricao}
            onChange={e => setDadosFormulario({ ...dadosFormulario, descricao: e.target.value })}
            rows={3}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="Digite a descrição ou use a IA..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
          <div className="flex flex-col sm:flex-row gap-2 mb-2">
            <input
              type="text"
              value={entradaTag}
              onChange={e => setEntradaTag(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), adicionarTag())}
              className="w-full sm:flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Adicionar tag..."
            />
            <button
              type="button"
              onClick={adicionarTag}
              className="w-full sm:w-auto px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Adicionar
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {dadosFormulario.tags.map((tag, index) => (
              <span key={index} className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium flex items-center gap-1">
                {tag}
                <button
                  type="button"
                  onClick={() => setDadosFormulario(prev => ({ ...prev, tags: prev.tags.filter((_, i) => i !== index) }))}
                  className="hover:text-indigo-900"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={aoCancelar}
          className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-sm transition-colors"
        >
          {dadosIniciais ? 'Atualizar Recurso' : 'Criar Recurso'}
        </button>
      </div>
    </form>
  );
}
