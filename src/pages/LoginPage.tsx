import { GoogleLogin } from "@react-oauth/google";
import api from "../api/axios";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post("/auth/login", { email, senha });
      login(response.data.access_token);
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Erro ao fazer login. Verifique suas credenciais.");
    }
  };

  interface CredentialResponse {
    credential?: string;
  }

  const handleGoogleSuccess = async (
    credentialResponse: CredentialResponse
  ) => {
    try {
      const response = await api.post("/auth/google", {
        credential: credentialResponse.credential,
      });
      login(response.data.access_token);
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Erro no login com Google.");
    }
  };

  return (
    <div className="flex flex-col h-screen items-center justify-center bg-gray-100">
      <img src="/logo.png" alt="Logo" className="w-32 h-32 mb-4" />
      <h1 className="text-4xl mb-4 font-bold">Bem-vindo de volta!</h1>
      <p className="text-lg mb-4">Faça login para continuar</p>
      <p className="text-sm mb-4 text-gray-500">
        Não tem uma conta?{" "}
        <a href="/register" className="text-blue-500 hover:underline">
          Cadastre-se
        </a>
      </p>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-96 mb-4"
      >
        <h2 className="text-2xl mb-4 font-bold text-center">Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 mb-4"
        >
          Entrar
        </button>
        <p className="text-center mb-4">ou</p>
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => alert("Erro no login com Google")}
        />
      </form>
    </div>
  );
}
