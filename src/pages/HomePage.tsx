import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-10 rounded-lg shadow-lg max-w-3xl w-full text-center">
        <h1 className="text-4xl font-bold text-blue-700 mb-6">
          Bem-vindo ao Inova Aprovanexus!
        </h1>

        <p className="text-gray-700 text-lg mb-8">
          O Inova Aprovanexus é o espaço para você enviar ideias inovadoras e
          ajudar a melhorar nossos serviços e instituições. Sua participação
          transforma o futuro da nossa comunidade! 🚀
        </p>

        <Link
          to="/nova-ideia"
          className="inline-block bg-blue-600 text-white py-3 px-6 rounded-lg text-lg hover:bg-blue-700 transition"
        >
          Enviar Minha Ideia
        </Link>
      </div>
    </div>
  );
}
