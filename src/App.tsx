// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import { ProtectedRoute } from "./auth/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import IdeaPage from "./pages/IdeaPage";
import ListIdeasPage from "./pages/ListIdeasPage";
import IdeaDetailsPage from "./pages/IdeaDetailsPage";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <div className="flex items-center justify-center h-screen">
                  <h1 className="text-4xl">Bem-vindo ao Inova Aprovanexus!</h1>
                </div>
              </ProtectedRoute>
            }
          />
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
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
