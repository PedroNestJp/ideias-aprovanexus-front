import { useState } from "react";
import api from "../api/axios";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

export default function IdeaPage() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [instituicao, setInstituicao] = useState("");
  const [anexo, setAnexo] = useState<File | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  const MAX_FILE_SIZE = 2 * 1024 * 1024;
  const SUPPORTED_FORMATS = ["image/jpeg", "image/png", "application/pdf"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!instituicao) {
      alert("Selecione a instituição.");
      return;
    }

    if (
      anexo &&
      (!SUPPORTED_FORMATS.includes(anexo.type) || anexo.size > MAX_FILE_SIZE)
    ) {
      setErro("Anexo inválido. Use JPEG, PNG ou PDF com até 2MB.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("titulo", titulo);
      formData.append("descricao", descricao);
      formData.append("instituicao", instituicao);
      if (anexo) formData.append("anexo", anexo);

      await api.post("/ideias", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Ideia enviada com sucesso!");
      navigate("/");
    } catch (error) {
      console.error("Erro ao enviar ideia:", error);
      alert("Erro ao enviar ideia.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-lg"
      >
        <h2 className="text-2xl mb-6 font-bold text-center text-blue-600">
          Nova Ideia
        </h2>

        {erro && <p className="text-red-500 mb-4">{erro}</p>}

        <div className="mb-4">
          <label className="block mb-1 font-medium">Título</label>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Descrição</label>
          <textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            className="w-full p-2 border rounded"
            rows={4}
            required
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Instituição</label>
          <select
            value={instituicao}
            onChange={(e) => setInstituicao(e.target.value)}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Selecione...</option>
            <option value="Enber">Enber</option>
            <option value="Aprova Nexus">Aprova Nexus</option>
            <option value="Inet">Inet</option>
            <option value="Supletivo Norte">Supletivo Norte</option>
            <option value="CBIE">CBIE</option>
            <option value="IBEP">IBEP</option>
            <option value="Grupo em Geral">Grupo em Geral</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block mb-1 font-medium">Anexo (opcional)</label>
          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={(e) => setAnexo(e.target.files?.[0] || null)}
            className="w-full"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 font-semibold"
        >
          Enviar Ideia
        </button>
      </form>
    </div>
  );
}
