import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

test("deve renderizar o texto Olá mundo", () => {
  render(<h1>Olá mundo</h1>);
  expect(screen.getByText("Olá mundo")).toBeInTheDocument();
});
