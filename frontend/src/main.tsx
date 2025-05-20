import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "@/contexts/AuthContext"; // Importa o contexto
import { Toaster } from "@/components/ui/toaster";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider> {/* Envolve o app com o provider */}
        <App />
        <Toaster /> {/* Componente de notificações */}
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
