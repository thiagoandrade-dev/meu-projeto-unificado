
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AdminSidebar from "@/components/AdminSidebar";
import { Plus, Search, FileText, Eye, Download, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminContratos = () => {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  
  // Dados de exemplo para contratos
  const contratos = [
    {
      id: "C-2023-001",
      inquilino: "João Silva",
      imovel: "Apartamento no Centro",
      endereco: "Av. Paulista, 1000, Apto 501",
      inicio: "15/01/2023",
      fim: "14/01/2024",
      valor: 2500,
      status: "Ativo"
    },
    {
      id: "C-2023-002",
      inquilino: "Maria Souza",
      imovel: "Casa em Condomínio",
      endereco: "Rua das Flores, 123",
      inicio: "01/03/2023",
      fim: "28/02/2024",
      valor: 4500,
      status: "Ativo"
    },
    {
      id: "C-2022-015",
      inquilino: "Carlos Ferreira",
      imovel: "Sala Comercial",
      endereco: "Rua Augusta, 500, Sala 302",
      inicio: "10/10/2022",
      fim: "09/10/2023",
      valor: 3000,
      status: "Finalizado"
    }
  ];
  
  // Filtra os contratos com base na pesquisa
  const contratosFiltrados = contratos.filter(
    (contrato) =>
      contrato.id.toLowerCase().includes(search.toLowerCase()) ||
      contrato.inquilino.toLowerCase().includes(search.toLowerCase()) ||
      contrato.imovel.toLowerCase().includes(search.toLowerCase())
  );
  
  const handleView = (id: string) => {
    toast({
      title: "Visualizando contrato",
      description: `Contrato ID: ${id}`,
      duration: 3000,
    });
  };
  
  const handleDownload = (id: string) => {
    toast({
      title: "Download iniciado",
      description: `Baixando contrato ID: ${id}`,
      duration: 3000,
    });
  };
  
  const handleDelete = (id: string) => {
    toast({
      title: "Contrato removido",
      description: `O contrato ID: ${id} foi removido com sucesso`,
      duration: 3000,
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <AdminSidebar />
      
      <div className="flex-1 p-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Gerenciamento de Contratos</h1>
            <p className="text-gray-600">Cadastre e gerencie os contratos de locação</p>
          </div>
          
          <Button className="bg-imobiliaria-azul hover:bg-imobiliaria-azul/90 flex items-center gap-2">
            <Plus size={16} />
            Novo Contrato
          </Button>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Buscar contratos por ID, inquilino ou imóvel..."
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">ID</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Inquilino</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Imóvel</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Início</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Término</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Valor</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-600">Ações</th>
                </tr>
              </thead>
              <tbody>
                {contratosFiltrados.length > 0 ? (
                  contratosFiltrados.map((contrato) => (
                    <tr key={contrato.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{contrato.id}</td>
                      <td className="py-3 px-4">{contrato.inquilino}</td>
                      <td className="py-3 px-4">
                        <div>
                          <p>{contrato.imovel}</p>
                          <p className="text-xs text-gray-500">{contrato.endereco}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">{contrato.inicio}</td>
                      <td className="py-3 px-4">{contrato.fim}</td>
                      <td className="py-3 px-4">
                        {contrato.valor.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block py-1 px-2 rounded-full text-xs font-medium ${
                            contrato.status === "Ativo"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {contrato.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex justify-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleView(contrato.id)}
                          >
                            <Eye size={16} className="text-blue-600" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDownload(contrato.id)}
                          >
                            <Download size={16} className="text-green-600" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDelete(contrato.id)}
                          >
                            <Trash2 size={16} className="text-red-600" />
                          </Button>
                          <Button variant="outline" size="icon">
                            <FileText size={16} className="text-gray-600" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="py-4 text-center text-gray-500">
                      Nenhum contrato encontrado
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminContratos;
