// src/pages/IdeaDetailsPage.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../auth/AuthContext";
import UserAvatar from "../components/UserAvatar";

interface Comentario {
  id: number;
  texto: string;
  anexo?: string;
  likes: number;
  likedByUser: boolean;
  autor: {
    id: number;
    nome: string;
    email: string;
    foto: string;
  };
  criadoEm: string;
}

interface Ideia {
  id: number;
  titulo: string;
  descricao: string;
  instituicao: string;
  status: string;
  likes: number;
  anexo?: string;
  usuario: {
    nome: string;
  };
  criadoEm: string;
}

export default function DetalhesIdeiaPage() {
  const { id } = useParams();
  const { token } = useAuth();
  const { user } = useAuth();
  const [ideia, setIdeia] = useState<Ideia | null>(null);
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [novoComentario, setNovoComentario] = useState("");
  const [anexoComentario, setAnexoComentario] = useState<File | null>(null);

  useEffect(() => {
    buscarIdeia();
    buscarComentarios();
  }, [id]);

  const buscarIdeia = async () => {
    try {
      const response = await api.get("/ideias", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const ideiaEncontrada = response.data.find(
        (i: Ideia) => i.id === Number(id)
      );
      setIdeia(ideiaEncontrada);
    } catch (error) {
      console.error("Erro ao buscar ideia:", error);
    }
  };

  const buscarComentarios = async () => {
    try {
      const response = await api.get(`/ideias/${id}/comentarios`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComentarios(response.data);
    } catch (error) {
      console.error("Erro ao buscar comentários:", error);
    }
  };

  const MAX_FILE_SIZE = 2 * 1024 * 1024;
  const SUPPORTED_FORMATS = ["image/jpeg", "image/png", "application/pdf"];

  const handleEnviarComentario = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      anexoComentario &&
      (!SUPPORTED_FORMATS.includes(anexoComentario.type) ||
        anexoComentario.size > MAX_FILE_SIZE)
    ) {
      alert("Anexo inválido. Use JPEG, PNG ou PDF com até 2MB.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("texto", novoComentario);
      if (anexoComentario) formData.append("anexo", anexoComentario);

      await api.post(`/ideias/${id}/comentarios`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setNovoComentario("");
      setAnexoComentario(null);
      buscarComentarios();
    } catch (error) {
      console.error("Erro ao enviar comentário:", error);
    }
  };

  const curtirComentario = async (comentarioId: number) => {
    try {
      await api.post(
        `/comentarios/${comentarioId}/like`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      buscarComentarios();
    } catch (error) {
      console.error("Erro ao curtir comentário:", error);
    }
  };

  const atualizarStatus = async (novoStatus: string) => {
    try {
      await api.patch(
        `/ideias/${id}/status`,
        { status: novoStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      await buscarIdeia(); // importante manter o await aqui
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      alert("Erro ao atualizar status");
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
      {ideia ? (
        <div className="bg-white p-8 rounded shadow w-full max-w-4xl mb-8">
          <h1 className="text-3xl font-bold mb-2">{ideia.titulo}</h1>
          <p className="text-gray-700 mb-4">{ideia.descricao}</p>
          <div className="flex flex-wrap mb-4">
            <span className="text-sm font-medium text-blue-600 mr-4">
              Instituição: {ideia.instituicao}
            </span>
            {(user?.role === "admin" || user?.role === "diretor") && (
              <div className="flex flex-col gap-2">
                <label htmlFor="statusSelect" className="text-sm text-gray-600">
                  Alterar status:
                </label>
                <select
                  id="statusSelect"
                  value={ideia.status}
                  onChange={(e) => atualizarStatus(e.target.value)}
                  className="border rounded p-2"
                >
                  <option value="Cadastrado">Cadastrado</option>
                  <option value="Em desenvolvimento">Em desenvolvimento</option>
                  <option value="Concluído">Concluído</option>
                  <option value="Já existe no grupo">Já existe no grupo</option>
                </select>
              </div>
            )}

            <span className="text-sm font-medium text-green-600">
              Status: {ideia.status}
            </span>
          </div>
          {ideia.anexo && (
            <a
              href={`${ideia.anexo}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline mb-4 block"
            >
              <img
                src={`${ideia.anexo}`}
                alt="Anexo da ideia"
                className="mt-2 max-w-full h-auto rounded"
              />{" "}
            </a>
          )}
          <span className="text-gray-500 text-sm">
            Criado por: {ideia.usuario?.nome}
          </span>
        </div>
      ) : (
        <p>Carregando ideia...</p>
      )}

      <form
        onSubmit={handleEnviarComentario}
        className="bg-white p-6 rounded shadow w-full max-w-4xl mb-8"
      >
        <h2 className="text-xl font-bold mb-4 text-blue-600">
          Adicionar Comentário
        </h2>
        <textarea
          value={novoComentario}
          onChange={(e) => setNovoComentario(e.target.value)}
          rows={3}
          className="w-full p-2 border rounded mb-4"
          required
          placeholder="Escreva seu comentário..."
        ></textarea>

        <input
          type="file"
          accept="image/*,application/pdf"
          onChange={(e) => setAnexoComentario(e.target.files?.[0] || null)}
          className="mb-4 w-full"
        />

        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full font-semibold"
        >
          Enviar Comentário
        </button>
      </form>

      {/* Comentários */}
      <div className="w-full max-w-4xl">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Comentários</h2>
        {comentarios.length > 0 ? (
          <div className="grid gap-4">
            {comentarios.map((comentario) => (
              <div key={comentario.id} className="flex items-start mb-6">
                {comentario.autor?.foto ? (
                  <UserAvatar
                    foto={comentario.autor?.foto}
                    nome={comentario.autor?.nome}
                    size={32}
                  />
                ) : (
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white text-sm">?</span>
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-700">
                      {comentario.autor?.nome}
                    </span>
                    <span className="text-gray-400 text-sm">
                      {new Date(comentario.criadoEm).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700 mt-2">{comentario.texto}</p>

                  {comentario.anexo &&
                    (console.log("comentario :>> ", comentario),
                    (
                      <a
                        href={`${comentario.anexo}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          src={`${comentario.anexo}`}
                          alt="Anexo"
                          className="mt-2 max-w-full h-auto rounded"
                        />
                      </a>
                    ))}

                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => curtirComentario(comentario.id)}
                      className={`px-2 py-1 text-sm rounded transition ${
                        comentario.likedByUser
                          ? "bg-purple-700 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      Curtir comentário ({comentario.likes})
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Nenhum comentário ainda.</p>
        )}
      </div>
    </div>
  );
}
