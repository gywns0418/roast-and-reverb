import { BrowserRouter } from "react-router-dom";
import AppRouter from "./router/AppRouter.jsx";
import "./styles/main.css";

export default function App() {
  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
}
