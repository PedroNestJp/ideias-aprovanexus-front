import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import UserAvatar from "./UserAvatar";

export default function Header() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  // Fecha o menu ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center fixed top-0 left-0 right-0 z-50">
      <Link to="/" className="text-2xl font-bold text-blue-700">
        Inova Aprovanexus
      </Link>

      <div className="relative" ref={menuRef}>
        <button onClick={() => setOpen(!open)} className="focus:outline-none">
          <UserAvatar foto={user?.foto} nome={user?.nome} size={40} />
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border z-50">
            {user?.role === "admin" && (
              <Link
                to="/admin"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Painel Admin
              </Link>
            )}
            <Link
              to="/perfil"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              onClick={() => setOpen(false)}
            >
              Meu Perfil
            </Link>
            <Link
              to="/minhas-ideias"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              onClick={() => setOpen(false)}
            >
              Minhas Ideias
            </Link>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
            >
              Sair
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
