// src/pages/ProfilePage.tsx
import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { Link } from "react-router-dom";
import api from "../api/axios";
import UserAvatar from "../components/UserAvatar";

interface Ideia {
  id: number;
  titulo: string;
  descricao: string;
  instituicao: string;
  status: string;
  likes: number;
  anexo?: string;
  criadoEm: string;
}

interface Comentario {
  id: number;
  texto: string;
  anexo?: string;
  likes: number;
  criadoEm: string;
  ideia: {
    id: number;
    titulo: string;
  };
}

export default function ProfilePage() {
  const { token, user } = useAuth();
  const [ideias, setIdeias] = useState<Ideia[]>([]);
  const [comentarios, setComentarios] = useState<Comentario[]>([]);

  useEffect(() => {
    buscarMinhasIdeias();
    buscarMeusComentarios();
  }, []);

  const buscarMinhasIdeias = async () => {
    try {
      const response = await api.get("/perfil/ideias", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIdeias(response.data);
    } catch (error) {
      console.error("Erro ao buscar ideias do perfil:", error);
    }
  };

  const buscarMeusComentarios = async () => {
    try {
      const response = await api.get("/perfil/comentarios", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComentarios(response.data);
    } catch (error) {
      console.error("Erro ao buscar comentários do perfil:", error);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-5xl">
        <h1 className="text-3xl font-bold mb-8 text-center text-blue-700">
          {/* nome do usuário */}
          Olá, {user?.nome}!
        </h1>

        {/* Foto e nome do usuário */}
        <div className="flex justify-center mb-4">
          <UserAvatar foto={user?.foto} nome={user?.nome} size={96} />
        </div>

        <h2 className="text-xl font-semibold text-center mb-4 text-gray-800">
          {user?.email}
        </h2>

        {/* Botão editar perfil */}
        <div className="text-center mb-8">
          <Link
            to="/perfil/editar"
            className="inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
          >
            Editar Perfil
          </Link>
        </div>

        {/* Ideias */}
        <div className="bg-white p-6 rounded shadow mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-green-600">
            Minhas Ideias
          </h2>
          {ideias.length > 0 ? (
            ideias.map((ideia) => (
              <div key={ideia.id} className="mb-4 p-4 border rounded">
                <h3 className="text-lg font-bold">{ideia.titulo}</h3>
                <p className="text-gray-600">{ideia.descricao}</p>
                <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
                  <span>Instituição: {ideia.instituicao}</span>
                  <span>Status: {ideia.status}</span>
                  <span>Likes: {ideia.likes}</span>
                  <span>{new Date(ideia.criadoEm).toLocaleDateString()}</span>
                </div>
                {ideia.anexo && (
                  <a
                    href={`${import.meta.env.VITE_API_URL}/uploads/${
                      ideia.anexo
                    }`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline mt-2 block"
                  >
                    Ver Anexo
                  </a>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500">
              Você ainda não enviou nenhuma ideia.
            </p>
          )}
        </div>

        {/* Comentários */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-2xl font-semibold mb-4 text-purple-600">
            Meus Comentários
          </h2>
          {comentarios.length > 0 ? (
            comentarios.map((comentario) => (
              <div key={comentario.id} className="mb-4 p-4 border rounded">
                <p className="text-gray-700">{comentario.texto}</p>
                <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
                  <span>Na ideia: {comentario.ideia?.titulo}</span>
                  <span>Likes: {comentario.likes}</span>
                  <span>
                    {new Date(comentario.criadoEm).toLocaleDateString()}
                  </span>
                </div>
                {comentario.anexo && (
                  <a
                    href={`${import.meta.env.VITE_API_URL}/uploads/${
                      comentario.anexo
                    }`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline mt-2 block"
                  >
                    Ver Anexo
                  </a>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500">
              Você ainda não fez nenhum comentário.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
