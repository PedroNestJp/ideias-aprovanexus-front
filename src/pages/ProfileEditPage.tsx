import { useState } from "react";
import api from "../api/axios";
import { useAuth } from "../auth/AuthContext";

export default function ProfileEditPage() {
  const { token, user, setUser } = useAuth();
  const [nome, setNome] = useState("");
  const [foto, setFoto] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarNovaSenha, setConfirmarNovaSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const MAX_FILE_SIZE_MB = 2;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMensagem("Por favor, selecione um arquivo de imagem.");
      setFoto(null);
      setPreviewUrl(null);
      return;
    }

    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > MAX_FILE_SIZE_MB) {
      setMensagem("Imagem muito grande. O limite é 2MB.");
      setFoto(null);
      setPreviewUrl(null);
      return;
    }

    setFoto(file);
    setPreviewUrl(URL.createObjectURL(file));
    setMensagem("");
  };

  const atualizarPerfil = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
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

      const updatedUser = response.data;
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setMensagem("Perfil atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      setMensagem("Erro ao atualizar perfil.");
    } finally {
      setIsLoading(false);
      setFoto(null);
      setPreviewUrl(null);
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
        { senhaAtual, novaSenha },
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

  console.log("API:", import.meta.env.VITE_API_URL);

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
              Novo nome de usuário
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
              Nova foto de perfil
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full"
            />
          </div>

          {previewUrl && (
            <div className="mb-4">
              <p className="font-medium text-gray-700 mb-1">
                Preview da nova foto:
              </p>
              <img
                src={previewUrl}
                alt="Preview"
                className="w-24 h-24 rounded-full object-cover"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-blue-600 text-white py-2 rounded transition ${
              isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
            }`}
          >
            {isLoading ? "Atualizando..." : "Atualizar Perfil"}
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
