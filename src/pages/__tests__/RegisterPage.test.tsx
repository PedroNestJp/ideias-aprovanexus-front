jest.mock("../../api/axios"); // Esse é o mock correto

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RegisterPage from "../RegisterPage";
import { AuthProvider } from "../../auth/AuthContext";
import { BrowserRouter } from "react-router-dom";
import api from "../../api/axios"; // deve ser o mesmo da importação real

// Mock do useNavigate
const mockedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("RegisterPage", () => {
  it("realiza cadastro com sucesso", async () => {
    const fakeUser = {
      id: 1,
      nome: "Novo Usuário",
      email: "novo@teste.com",
    };

    (api.post as jest.Mock).mockResolvedValueOnce({
      data: { access_token: "token_abc", user: fakeUser },
    });

    render(
      <AuthProvider>
        <BrowserRouter>
          <RegisterPage />
        </BrowserRouter>
      </AuthProvider>
    );

    await userEvent.type(screen.getByPlaceholderText("Nome"), "Novo Usuário");
    await userEvent.type(
      screen.getByPlaceholderText("Email"),
      "novo@teste.com"
    );
    await userEvent.type(screen.getByPlaceholderText("Senha"), "123456");

    await userEvent.click(screen.getByRole("button", { name: "Cadastrar" }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("/auth/register", {
        nome: "Novo Usuário",
        email: "novo@teste.com",
        senha: "123456",
      });
      expect(mockedNavigate).toHaveBeenCalledWith("/");
    });
  });

  it("mostra alerta se a API retornar erro", async () => {
    (api.post as jest.Mock).mockRejectedValueOnce(
      new Error("Erro ao cadastrar")
    );

    window.alert = jest.fn();

    render(
      <AuthProvider>
        <BrowserRouter>
          <RegisterPage />
        </BrowserRouter>
      </AuthProvider>
    );

    await userEvent.type(screen.getByPlaceholderText("Nome"), "Erro");
    await userEvent.type(
      screen.getByPlaceholderText("Email"),
      "erro@teste.com"
    );
    await userEvent.type(screen.getByPlaceholderText("Senha"), "123");

    await userEvent.click(screen.getByRole("button", { name: "Cadastrar" }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        "Erro ao cadastrar. Verifique os dados e tente novamente."
      );
    });
  });
});
