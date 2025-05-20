
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AdminSidebar from "@/components/AdminSidebar";
import { Plus, Search, Pencil, Trash2, FileText, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminImoveis = () => {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  
  // Exemplo de dados de imóveis
  const imoveis = [
    {
      id: 1,
      titulo: "Apartamento no Centro",
      tipo: "Apartamento",
      endereco: "Av. Paulista, 1000, Apto 501",
      bairro: "Bela Vista",
      cidade: "São Paulo",
      status: "Disponível",
      valor: 2500
    },
    {
      id: 2,
      titulo: "Casa em Condomínio",
      tipo: "Casa",
      endereco: "Rua das Flores, 123",
      bairro: "Jardim Europa",
      cidade: "São Paulo",
      status: "Alugado",
      valor: 4500
    },
    {
      id: 3,
      titulo: "Sala Comercial",
      tipo: "Comercial",
      endereco: "Rua Augusta, 500, Sala 302",
      bairro: "Consolação",
      cidade: "São Paulo",
      status: "Disponível",
      valor: 3000
    }
  ];
  
  // Filtra os imóveis com base na pesquisa
  const imoveisFiltrados = imoveis.filter(
    (imovel) =>
      imovel.titulo.toLowerCase().includes(search.toLowerCase()) ||
      imovel.endereco.toLowerCase().includes(search.toLowerCase()) ||
      imovel.bairro.toLowerCase().includes(search.toLowerCase())
  );
  
  const handleEdit = (id: number) => {
    toast({
      title: "Edição iniciada",
      description: `Editando imóvel ID: ${id}`,
      duration: 3000,
    });
  };
  
  const handleDelete = (id: number) => {
    toast({
      title: "Imóvel removido",
      description: `O imóvel ID: ${id} foi removido com sucesso`,
      duration: 3000,
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <AdminSidebar />
      
      <div className="flex-1 p-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Gerenciamento de Imóveis</h1>
            <p className="text-gray-600">Cadastre e gerencie os imóveis da imobiliária</p>
          </div>
          
          <Button className="bg-imobiliaria-azul hover:bg-imobiliaria-azul/90 flex items-center gap-2">
            <Plus size={16} />
            Novo Imóvel
          </Button>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Buscar imóveis por título, endereço ou bairro..."
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
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Título</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Tipo</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Endereço</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Valor</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-600">Ações</th>
                </tr>
              </thead>
              <tbody>
                {imoveisFiltrados.length > 0 ? (
                  imoveisFiltrados.map((imovel) => (
                    <tr key={imovel.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{imovel.id}</td>
                      <td className="py-3 px-4">{imovel.titulo}</td>
                      <td className="py-3 px-4">{imovel.tipo}</td>
                      <td className="py-3 px-4">
                        {imovel.endereco}, {imovel.bairro}, {imovel.cidade}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block py-1 px-2 rounded-full text-xs font-medium ${
                            imovel.status === "Disponível"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {imovel.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {imovel.valor.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex justify-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEdit(imovel.id)}
                          >
                            <Pencil size={16} className="text-blue-600" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDelete(imovel.id)}
                          >
                            <Trash2 size={16} className="text-red-600" />
                          </Button>
                          <Button variant="outline" size="icon">
                            <FileText size={16} className="text-gray-600" />
                          </Button>
                          <Button variant="outline" size="icon">
                            <Upload size={16} className="text-gray-600" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-4 text-center text-gray-500">
                      Nenhum imóvel encontrado
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

export default AdminImoveis;
