import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../auth/AuthContext";
import { Link } from "react-router-dom";

interface Ideia {
  id: number;
  titulo: string;
  descricao: string;
  instituicao: string;
  likes: number;
  status: string;
  anexo?: string;
  usuario: {
    nome: string;
  };
  criadoEm: string;
}

export default function ListIdeasPage() {
  const [ideias, setIdeias] = useState<Ideia[]>([]);
  const [instituicaoFiltro, setInstituicaoFiltro] = useState("");
  const [statusFiltro, setStatusFiltro] = useState("");
  const [ordenacao, setOrdenacao] = useState("recentes"); // recentes ou curtidas
  const { token } = useAuth();

  useEffect(() => {
    buscarIdeias();
  }, []);

  const buscarIdeias = async () => {
    try {
      const response = await api.get("/ideias");
      setIdeias(response.data);
    } catch (error) {
      console.error("Erro ao buscar ideias:", error);
    }
  };

  const curtirIdeia = async (id: number) => {
    try {
      await api.post(
        `/ideias/${id}/like`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      buscarIdeias();
    } catch (error) {
      console.error("Erro ao curtir ideia:", error);
    }
  };

  const ideiasFiltradas = ideias
    .filter((i) =>
      instituicaoFiltro ? i.instituicao === instituicaoFiltro : true
    )
    .filter((i) => (statusFiltro ? i.status === statusFiltro : true))
    .sort((a, b) => {
      if (ordenacao === "curtidas") {
        return b.likes - a.likes;
      } else {
        return new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime();
      }
    });

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-blue-600 mb-8">
        Ideias Cadastradas
      </h1>

      {/* Filtros */}
      <div className="flex flex-wrap gap-4 mb-8 w-full max-w-5xl">
        <select
          value={instituicaoFiltro}
          onChange={(e) => setInstituicaoFiltro(e.target.value)}
          className="p-2 border rounded w-full md:w-1/3"
        >
          <option value="">Todas Instituições</option>
          <option value="Enber">Enber</option>
          <option value="Aprova Nexus">Aprova Nexus</option>
          <option value="Inet">Inet</option>
          <option value="Supletivo Norte">Supletivo Norte</option>
          <option value="CBIE">CBIE</option>
          <option value="IBEP">IBEP</option>
          <option value="Grupo em Geral">Grupo em Geral</option>
        </select>

        <select
          value={statusFiltro}
          onChange={(e) => setStatusFiltro(e.target.value)}
          className="p-2 border rounded w-full md:w-1/3"
        >
          <option value="">Todos Status</option>
          <option value="Cadastrado">Cadastrado</option>
          <option value="Em desenvolvimento">Em desenvolvimento</option>
          <option value="Já existe no grupo">Já existe no grupo</option>
          <option value="Concluído">Concluído</option>
        </select>

        <select
          value={ordenacao}
          onChange={(e) => setOrdenacao(e.target.value)}
          className="p-2 border rounded w-full md:w-1/3"
        >
          <option value="recentes">Mais Recentes</option>
          <option value="curtidas">Mais Curtidas</option>
        </select>
      </div>

      {/* Listagem */}
      <div className="grid gap-6 w-full max-w-5xl">
        {ideiasFiltradas.map((ideia) => (
          <div
            key={ideia.id}
            className="bg-white rounded shadow p-6 flex flex-col"
          >
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold">{ideia.titulo}</h2>
              <span className="text-sm text-gray-500">
                {new Date(ideia.criadoEm).toLocaleDateString()}
              </span>
            </div>

            <p className="text-gray-700 mb-4">{ideia.descricao}</p>

            <div className="flex items-center flex-wrap mb-4">
              <span className="text-sm font-medium text-blue-600 mr-4">
                Instituição: {ideia.instituicao}
              </span>
              <span className="text-sm font-medium text-green-600">
                Status: {ideia.status}
              </span>
            </div>

            {ideia.anexo && (
              <div className="mb-4">
                <a
                  href={`http://localhost:3000/uploads/${ideia.anexo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  Ver Anexo
                </a>
              </div>
            )}

            <div className="flex items-center justify-between">
              <button
                onClick={() => curtirIdeia(ideia.id)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 font-semibold"
              >
                Curtir ({ideia.likes})
              </button>

              <Link
                to={`/ideias/${ideia.id}`}
                className="ml-4 bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 font-semibold"
              >
                Ver Detalhes
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
