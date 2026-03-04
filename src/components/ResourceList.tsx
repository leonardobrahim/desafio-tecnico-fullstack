import { Recurso } from '../types';
import { Edit2, Trash2, ExternalLink, FileText, Video, Link as LinkIcon } from 'lucide-react';

interface PropsListaRecursos {
  recursos: Recurso[];
  aoEditar: (recurso: Recurso) => void;
  aoDeletar: (id: number) => void;
}

export default function ListaRecursos({ recursos, aoEditar, aoDeletar }: PropsListaRecursos) {
  const obterIconeTipo = (tipo: string) => {
    switch (tipo) {
      case 'Video': return <Video className="w-4 h-4 text-rose-500" />;
      case 'PDF': return <FileText className="w-4 h-4 text-orange-500" />;
      default: return <LinkIcon className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tipo</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Recurso</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tags</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {recursos.map((recurso) => (
              <tr key={recurso.id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-white transition-colors">
                      {obterIconeTipo(recurso.tipo)}
                    </div>
                    <span className="text-sm font-medium text-gray-600">
                      {recurso.tipo === 'Video' ? 'Vídeo' : recurso.tipo}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="max-w-md">
                    <a 
                      href={recurso.url} 
                      target="_blank" 
                      rel="noreferrer"
                      className="text-sm font-semibold text-gray-900 hover:text-indigo-600 flex items-center gap-1.5 mb-1"
                    >
                      {recurso.titulo}
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                    <p className="text-sm text-gray-500 line-clamp-2">{recurso.descricao}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1.5">
                    {recurso.tags.map((tag, i) => (
                      <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs border border-gray-200">
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 text-right whitespace-nowrap">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => aoEditar(recurso)}
                      className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => recurso.id && aoDeletar(recurso.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {recursos.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-gray-400 text-sm">
                  Nenhum recurso encontrado. Crie um para começar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
