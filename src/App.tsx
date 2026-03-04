import { useState, useEffect } from 'react';
import { Recurso } from './types';
import { api } from './services/api';
import ListaRecursos from './components/ResourceList';
import FormularioRecurso from './components/ResourceForm';
import { Plus, BookOpen, LayoutGrid } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [recursos, setRecursos] = useState<Recurso[]>([]);
  const [formularioAberto, setFormularioAberto] = useState(false);
  const [recursoEmEdicao, setRecursoEmEdicao] = useState<Recurso | undefined>(undefined);
  const [carregando, setCarregando] = useState(true);

  const buscarRecursos = async () => {
    try {
      const resposta = await api.obterRecursos();
      setRecursos(resposta.dados);
    } catch (erro) {
      console.error('Falha ao buscar recursos', erro);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    buscarRecursos();
  }, []);

  const lidarComEdicao = (recurso: Recurso) => {
    setRecursoEmEdicao(recurso);
    setFormularioAberto(true);
  };

  const lidarComExclusao = async (id: number) => {
    if (confirm('Tem certeza de que deseja excluir este recurso?')) {
      await api.deletarRecurso(id);
      buscarRecursos();
    }
  };

  const lidarComSucesso = () => {
    setFormularioAberto(false);
    setRecursoEmEdicao(undefined);
    buscarRecursos();
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-gray-900 font-sans">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
              <BookOpen className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-semibold tracking-tight text-gray-900">Plataforma Educativa</h1>
          </div>
          <button
            onClick={() => {
              setRecursoEmEdicao(undefined);
              setFormularioAberto(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Novo Recurso
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {formularioAberto ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
                <button onClick={() => setFormularioAberto(false)} className="hover:text-gray-900">Recursos</button>
                <span>/</span>
                <span className="text-gray-900 font-medium">{recursoEmEdicao ? 'Editar' : 'Criar'} Recurso</span>
              </div>
              <FormularioRecurso
                dadosIniciais={recursoEmEdicao}
                aoSucesso={lidarComSucesso}
                aoCancelar={() => setFormularioAberto(false)}
              />
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                  <LayoutGrid className="w-5 h-5 text-gray-400" />
                  Todos os Recursos
                </h2>
                <span className="text-sm text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-full">
                  {recursos.length} itens
                </span>
              </div>
              
              {carregando ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
              ) : (
                <ListaRecursos
                  recursos={recursos}
                  aoEditar={lidarComEdicao}
                  aoDeletar={lidarComExclusao}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
