import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../auth/AuthContext";

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

export default function ListarIdeiasPage() {
  const [ideias, setIdeias] = useState<Ideia[]>([]);
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

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-blue-600 mb-8">
        Ideias Cadastradas
      </h1>

      <div className="grid gap-6 w-full max-w-5xl">
        {ideias.map((ideia) => (
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
                  href={`%{process.env.BASE_URL}/uploads/${ideia.anexo}`}
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
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Curtir ({ideia.likes})
              </button>
              <span className="text-gray-500 text-sm">
                Por: {ideia.usuario?.nome}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
