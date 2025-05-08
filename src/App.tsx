import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import { ProtectedRoute } from "./auth/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import IdeaPage from "./pages/IdeaPage";
import ListIdeasPage from "./pages/ListIdeasPage";
import IdeaDetailsPage from "./pages/IdeaDetailsPage";
import ProfileEditPage from "./pages/ProfileEditPage";
import ProfilePage from "./pages/ProfilePage";
import Header from "./components/Header";
import RegisterPage from "./pages/RegisterPage";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <div className="pt-20">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/enviar-ideia"
              element={
                <ProtectedRoute>
                  <IdeaPage />
                </ProtectedRoute>
              }
            />
            <Route path="/ideias" element={<ListIdeasPage />} />
            <Route path="/ideias/:id" element={<IdeaDetailsPage />} />
            <Route path="/perfil/editar" element={<ProfileEditPage />} />
            <Route
              path="/perfil"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<ListIdeasPage />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
