// src/pages/RegisterPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import api from "../api/axios";

export default function RegisterPage() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post("/auth/register", { nome, email, senha });
      login(response.data.access_token, response.data.user);
      navigate("/");
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      alert("Erro ao cadastrar. Verifique os dados e tente novamente.");
    }
  };

  return (
    <div className="flex flex-col h-screen items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
          Criar Conta
        </h2>
        <input
          type="text"
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
          className="w-full p-2 border rounded mb-4"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-2 border rounded mb-4"
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
          className="w-full p-2 border rounded mb-6"
        />
        <button
          type="submit"
          className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
        >
          Cadastrar
        </button>
      </form>
    </div>
  );
}
