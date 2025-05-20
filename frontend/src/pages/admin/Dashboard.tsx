
import { useState } from "react";
import { Link } from "react-router-dom";
import AdminSidebar from "@/components/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Home,
  FileText,
  Users,
  BarChart3,
  DollarSign,
  Bell,
  Menu,
  X,
} from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const receitaData = [
    { mes: 'Jan', valor: 32000 },
    { mes: 'Fev', valor: 34000 },
    { mes: 'Mar', valor: 36000 },
    { mes: 'Abr', valor: 38000 },
    { mes: 'Mai', valor: 37000 },
    { mes: 'Jun', valor: 39000 },
  ];
  
  const imoveisData = [
    { categoria: 'Para venda', quantidade: 42 },
    { categoria: 'Alugados', quantidade: 78 },
    { categoria: 'Disponíveis', quantidade: 36 },
    { categoria: 'Em manutenção', quantidade: 12 },
  ];
  
  const notificacoes = [
    { id: 1, titulo: "Novo contrato para revisão", tipo: "juridico", data: "Hoje", lido: false },
    { id: 2, titulo: "Pagamento recebido - Contrato #1245", tipo: "financeiro", data: "Ontem", lido: false },
    { id: 3, titulo: "Manutenção agendada - Imóvel #536", tipo: "manutencao", data: "23/05/2023", lido: true },
    { id: 4, titulo: "Vistoria finalizada - Imóvel #872", tipo: "vistoria", data: "20/05/2023", lido: true },
  ];
  
  const cards = [
    { title: "Total de Imóveis", value: "168", icon: Home, color: "bg-blue-500" },
    { title: "Contratos Ativos", value: "124", icon: FileText, color: "bg-green-500" },
    { title: "Clientes Cadastrados", value: "256", icon: Users, color: "bg-amber-500" },
    { title: "Receita Mensal", value: "R$ 39.450", icon: DollarSign, color: "bg-purple-500" },
  ];
  
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar para desktop */}
      <div className="hidden md:flex md:w-64 md:flex-shrink-0">
        <AdminSidebar />
      </div>
      
      {/* Menu móvel */}
      <div className="md:hidden">
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 z-40 transition-opacity duration-300 ease-in-out"
             style={{ display: mobileMenuOpen ? "block" : "none" }}
             onClick={() => setMobileMenuOpen(false)}
        />
        
        <div className={`fixed top-0 left-0 bottom-0 flex flex-col w-64 bg-imobiliaria-azul z-50 transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}>
          <AdminSidebar isMobile={true} setMobileOpen={setMobileMenuOpen} />
        </div>
      </div>
      
      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm z-10">
          <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center">
              {/* Botão do menu móvel */}
              <button
                className="md:hidden mr-3 text-gray-600 hover:text-imobiliaria-azul"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
            </div>
            
            {/* Notificações */}
            <div className="flex items-center">
              <div className="relative">
                <Button variant="ghost" size="icon" className="relative">
                  <Bell size={20} />
                  <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
                    {notificacoes.filter(notif => !notif.lido).length}
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </header>
        
        {/* Conteúdo principal */}
        <main className="flex-1 overflow-y-auto bg-gray-100 p-4 sm:p-6 lg:p-8">
          {/* Cards informativos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {cards.map((card, index) => (
              <Card key={index}>
                <CardContent className="p-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{card.title}</p>
                    <p className="text-2xl font-bold">{card.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${card.color}`}>
                    <card.icon size={24} className="text-white" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Gráficos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Gráfico de Receita */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 size={20} className="mr-2 text-imobiliaria-azul" />
                  Receita Mensal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={receitaData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mes" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`R$ ${value}`, 'Valor']} />
                      <Line type="monotone" dataKey="valor" stroke="#1A365D" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Gráfico de Imóveis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Home size={20} className="mr-2 text-imobiliaria-azul" />
                  Distribuição de Imóveis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={imoveisData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="categoria" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="quantidade" fill="#C69C6D" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Notificações recentes */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <Bell size={20} className="mr-2 text-imobiliaria-azul" />
                Notificações Recentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {notificacoes.map((notif) => (
                  <li
                    key={notif.id}
                    className={`flex items-center justify-between p-3 rounded-md ${
                      !notif.lido ? "bg-blue-50" : "bg-white border"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-4 ${!notif.lido ? "bg-blue-500" : "bg-gray-300"}`}></div>
                      <div>
                        <p className={`${!notif.lido ? "font-medium" : ""}`}>{notif.titulo}</p>
                        <p className="text-sm text-gray-500">{notif.data}</p>
                      </div>
                    </div>
                    <span className="text-xs text-white px-2 py-1 rounded capitalize"
                      style={{
                        backgroundColor: 
                          notif.tipo === "juridico" ? "#1A365D" :
                          notif.tipo === "financeiro" ? "#10B981" :
                          notif.tipo === "manutencao" ? "#F59E0B" : "#6366F1"
                      }}
                    >
                      {notif.tipo}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 text-center">
                <Link to="#" className="text-imobiliaria-azul hover:text-imobiliaria-azul/80 text-sm font-medium">
                  Ver todas as notificações
                </Link>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
