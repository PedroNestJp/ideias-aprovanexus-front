import { useState } from "react";
import api from "../api/axios";
import { useAuth } from "../auth/AuthContext";

export default function ProfileEditPage() {
  const { token, user, setUser } = useAuth();

  const [nome, setNome] = useState("");
  const [foto, setFoto] = useState<File | null>(null);
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarNovaSenha, setConfirmarNovaSenha] = useState("");
  const [mensagem, setMensagem] = useState("");

  const atualizarPerfil = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      if (nome) formData.append("nome", nome);
      if (foto) formData.append("foto", foto);

      const response = await api.patch("/perfil", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log('api.patch("/perfil") :>> ', response.data);

      // Atualiza user no AuthContext e localStorage
      const updatedUser = response.data;
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);

      setMensagem("Perfil atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      setMensagem("Erro ao atualizar perfil.");
    }
  };

  const alterarSenha = async (e: React.FormEvent) => {
    e.preventDefault();

    if (novaSenha !== confirmarNovaSenha) {
      setMensagem("Nova senha e confirmação não coincidem.");
      return;
    }

    try {
      await api.patch(
        "/perfil/senha",
        {
          senhaAtual,
          novaSenha,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMensagem("Senha alterada com sucesso!");
      setSenhaAtual("");
      setNovaSenha("");
      setConfirmarNovaSenha("");
    } catch (error) {
      console.error("Erro ao alterar senha:", error);
      setMensagem("Erro ao alterar senha.");
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-2xl bg-white p-8 rounded shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">
          Editar Perfil
        </h1>

        {mensagem && (
          <p className="text-center mb-4 text-green-600">{mensagem}</p>
        )}

        <form onSubmit={atualizarPerfil} className="space-y-6 mb-10">
          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              Nome
            </label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full border rounded p-2"
              placeholder={user?.nome}
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              Foto de Perfil
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setFoto(e.target.files ? e.target.files[0] : null)
              }
              className="w-full"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Atualizar Perfil
          </button>
        </form>

        <form onSubmit={alterarSenha} className="space-y-6">
          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              Senha Atual
            </label>
            <input
              type="password"
              value={senhaAtual}
              onChange={(e) => setSenhaAtual(e.target.value)}
              className="w-full border rounded p-2"
              placeholder="Digite sua senha atual"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              Nova Senha
            </label>
            <input
              type="password"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              className="w-full border rounded p-2"
              placeholder="Digite a nova senha"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              Confirmar Nova Senha
            </label>
            <input
              type="password"
              value={confirmarNovaSenha}
              onChange={(e) => setConfirmarNovaSenha(e.target.value)}
              className="w-full border rounded p-2"
              placeholder="Confirme a nova senha"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
          >
            Alterar Senha
          </button>
        </form>
      </div>
    </div>
  );
}
