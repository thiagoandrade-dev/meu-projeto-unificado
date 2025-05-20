import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./contexts/AuthContext";

// Páginas Públicas
import Index from "./pages/Index";
import Imoveis from "./pages/Imoveis";
import ImovelDetalhe from "./pages/ImovelDetalhe";
import Sobre from "./pages/Sobre";
import Contato from "./pages/Contato";
import Login from "./pages/Login";

// Páginas do Admin
import AdminDashboard from "./pages/admin/Dashboard";
import AdminImoveis from "./pages/admin/Imoveis";
import AdminContratos from "./pages/admin/Contratos";
import AdminJuridico from "./pages/admin/Juridico";
import AdminUsuarios from "./pages/admin/Usuarios";

// Páginas do Locatário
import AreaLocatario from "./pages/locatario/AreaLocatario";

// Página de erro
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Rotas Públicas */}
              <Route path="/" element={<Index />} />
              <Route path="/imoveis" element={<Imoveis />} />
              <Route path="/imoveis/:id" element={<ImovelDetalhe />} />
              <Route path="/sobre" element={<Sobre />} />
              <Route path="/contato" element={<Contato />} />
              <Route path="/login" element={<Login />} />

              {/* Rotas Admin */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/imoveis" element={<AdminImoveis />} />
              <Route path="/admin/contratos" element={<AdminContratos />} />
              <Route path="/admin/juridico" element={<AdminJuridico />} />
              <Route path="/admin/usuarios" element={<AdminUsuarios />} />

              {/* Rotas Locatário */}
              <Route path="/locatario" element={<AreaLocatario />} />

              {/* Rota 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
