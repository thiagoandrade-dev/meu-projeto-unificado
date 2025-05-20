
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AdminSidebar from "@/components/AdminSidebar";
import { Plus, Search, FileText, Download, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminJuridico = () => {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  
  // Dados de exemplo para documentos jurídicos
  const documentos = [
    {
      id: "DOC-2023-001",
      titulo: "Contrato de Locação Padrão",
      tipo: "Contrato",
      criacao: "10/01/2023",
      autor: "Dr. Fernando Costa",
      tamanho: "245 KB",
      formato: "PDF"
    },
    {
      id: "DOC-2023-002",
      titulo: "Adendo de Reajuste",
      tipo: "Adendo",
      criacao: "15/02/2023",
      autor: "Dra. Camila Santos",
      tamanho: "120 KB",
      formato: "DOCX"
    },
    {
      id: "DOC-2023-003",
      titulo: "Notificação Extrajudicial",
      tipo: "Notificação",
      criacao: "22/03/2023",
      autor: "Dr. André Silva",
      tamanho: "198 KB",
      formato: "PDF"
    }
  ];
  
  // Filtra os documentos com base na pesquisa
  const documentosFiltrados = documentos.filter(
    (doc) =>
      doc.id.toLowerCase().includes(search.toLowerCase()) ||
      doc.titulo.toLowerCase().includes(search.toLowerCase()) ||
      doc.tipo.toLowerCase().includes(search.toLowerCase())
  );
  
  const handleDownload = (id: string) => {
    toast({
      title: "Download iniciado",
      description: `Baixando documento ID: ${id}`,
      duration: 3000,
    });
  };
  
  const handleDelete = (id: string) => {
    toast({
      title: "Documento removido",
      description: `O documento ID: ${id} foi removido com sucesso`,
      duration: 3000,
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <AdminSidebar />
      
      <div className="flex-1 p-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Documentos Jurídicos</h1>
            <p className="text-gray-600">Gerencie os documentos e modelos jurídicos da imobiliária</p>
          </div>
          
          <Button className="bg-imobiliaria-azul hover:bg-imobiliaria-azul/90 flex items-center gap-2">
            <Plus size={16} />
            Novo Documento
          </Button>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Buscar documentos por ID, título ou tipo..."
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
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Criação</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Autor</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Tamanho</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Formato</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-600">Ações</th>
                </tr>
              </thead>
              <tbody>
                {documentosFiltrados.length > 0 ? (
                  documentosFiltrados.map((doc) => (
                    <tr key={doc.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{doc.id}</td>
                      <td className="py-3 px-4">{doc.titulo}</td>
                      <td className="py-3 px-4">{doc.tipo}</td>
                      <td className="py-3 px-4">{doc.criacao}</td>
                      <td className="py-3 px-4">{doc.autor}</td>
                      <td className="py-3 px-4">{doc.tamanho}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block py-1 px-2 rounded-full text-xs font-medium ${
                            doc.formato === "PDF"
                              ? "bg-red-100 text-red-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {doc.formato}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex justify-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDownload(doc.id)}
                          >
                            <Download size={16} className="text-green-600" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDelete(doc.id)}
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
                      Nenhum documento encontrado
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

export default AdminJuridico;
