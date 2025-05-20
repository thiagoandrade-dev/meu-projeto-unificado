import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Receipt, Bell, Download, CreditCard, FileIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import asaasService, { Boleto, Contrato } from "@/services/asaasService";

const AreaLocatario = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [boletos, setBoletos] = useState<Boleto[]>([]);
  const [contratos, setContratos] = useState<Contrato[]>([]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const clienteId = "cus_000005113026";
        const boletosData = await asaasService.getBoletos(clienteId);
        const contratosData = await asaasService.getContratos(clienteId);

        setBoletos(boletosData);
        setContratos(contratosData);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        toast({
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar seus boletos e contratos",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast, navigate, user]);

  const contratoAtual = {
    id: "C-2023-0125",
    endereco: "Av. Paulista, 1000, Apto. 501",
    bairro: "Bela Vista",
    cidade: "São Paulo",
    dataInicio: "15/01/2023",
    dataFim: "14/01/2024",
    valor: 2500,
    status: "Ativo"
  };

  const notificacoes = [
    { id: 1, titulo: "Reajuste anual", mensagem: "Seu contrato terá reajuste a partir do próximo mês", data: "Hoje", lida: false },
    { id: 2, titulo: "Recibo disponível", mensagem: "O recibo do mês de Maio está disponível", data: "01/06/2023", lida: true },
    { id: 3, titulo: "Vistoria agendada", mensagem: "Uma vistoria foi agendada para o dia 15/07", data: "28/05/2023", lida: true },
  ];

  const handleDownloadBoleto = async (boleto: Boleto) => {
    try {
      toast({
        title: "Boleto em processamento",
        description: "Estamos gerando o seu boleto para download",
      });

      setTimeout(() => {
        toast({
          title: "Boleto pronto!",
          description: `Boleto #${boleto.invoiceNumber} disponível para download`,
        });

        const link = document.createElement('a');
        link.href = boleto.bankSlipUrl !== '#' ? boleto.bankSlipUrl : '#';
        link.target = '_blank';
        link.click();
      }, 1500);
    } catch (error) {
      console.error("Erro ao baixar boleto:", error);
      toast({
        title: "Erro ao baixar boleto",
        description: "Não foi possível baixar o boleto selecionado",
        variant: "destructive",
      });
    }
  };

  const handleDownloadContrato = async (contrato: Contrato) => {
    try {
      toast({
        title: "Contrato em processamento",
        description: "Estamos preparando seu contrato para download",
      });

      setTimeout(() => {
        toast({
          title: "Contrato pronto!",
          description: `Contrato ${contrato.titulo} disponível para download`,
        });

        const link = document.createElement('a');
        link.href = contrato.arquivo;
        link.target = '_blank';
        link.download = `${contrato.titulo.replace(/ /g, '_')}.pdf`;
        link.click();
      }, 1500);
    } catch (error) {
      console.error("Erro ao baixar contrato:", error);
      toast({
        title: "Erro ao baixar contrato",
        description: "Não foi possível baixar o contrato selecionado",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-grow bg-gray-50">
        <div className="container-page py-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Olá, {user?.nome}</h1>
            <div className="relative">
              <Button variant="outline" size="icon" className="relative">
                <Bell size={20} />
                <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
                  {notificacoes.filter(n => !n.lida).length}
                </span>
              </Button>
            </div>
          </div>

          <Tabs defaultValue="contrato" className="space-y-6">
            <TabsList className="w-full bg-white p-1 rounded shadow-sm border">
              <TabsTrigger value="contrato" className="flex items-center gap-2">
                <FileText size={16} />
                <span className="hidden md:inline">Contrato</span>
              </TabsTrigger>
              <TabsTrigger value="pagamentos" className="flex items-center gap-2">
                <CreditCard size={16} />
                <span className="hidden md:inline">Pagamentos</span>
              </TabsTrigger>
              <TabsTrigger value="documentos" className="flex items-center gap-2">
                <FileIcon size={16} />
                <span className="hidden md:inline">Documentos</span>
              </TabsTrigger>
              <TabsTrigger value="notificacoes" className="flex items-center gap-2">
                <Bell size={16} />
                <span className="hidden md:inline">Notificações</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="contrato">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText size={20} className="text-imobiliaria-azul" />
                        Seu Contrato Atual
                      </CardTitle>
                      <CardDescription>
                        Detalhes do seu contrato de locação
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center pb-4 border-b">
                          <span className="text-gray-500">Contrato Nº:</span>
                          <span className="font-semibold">{contratoAtual.id}</span>
                        </div>
                        <div className="flex justify-between items-center pb-4 border-b">
                          <span className="text-gray-500">Endereço:</span>
                          <span className="font-semibold">{contratoAtual.endereco}</span>
                        </div>
                        <div className="flex justify-between items-center pb-4 border-b">
                          <span className="text-gray-500">Bairro:</span>
                          <span>{contratoAtual.bairro}</span>
                        </div>
                        <div className="flex justify-between items-center pb-4 border-b">
                          <span className="text-gray-500">Cidade:</span>
                          <span>{contratoAtual.cidade}</span>
                        </div>
                        <div className="flex justify-between items-center pb-4 border-b">
                          <span className="text-gray-500">Data de Início:</span>
                          <span>{contratoAtual.dataInicio}</span>
                        </div>
                        <div className="flex justify-between items-center pb-4 border-b">
                          <span className="text-gray-500">Data de Término:</span>
                          <span>{contratoAtual.dataFim}</span>
                        </div>
                        <div className="flex justify-between items-center pb-4 border-b">
                          <span className="text-gray-500">Valor do Aluguel:</span>
                          <span className="font-semibold">
                            {contratoAtual.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500">Status:</span>
                          <Badge className="bg-green-500">{contratoAtual.status}</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Documentos do Contrato</CardTitle>
                      <CardDescription>Acesse seus documentos importantes</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {contratos.length === 0 && (
                        <p className="text-gray-500">Nenhum documento disponível no momento.</p>
                      )}
                      <ul className="space-y-3">
                        {contratos.map((contrato) => (
                          <li key={contrato.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <FileText size={20} />
                              <span>{contrato.titulo}</span>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDownloadContrato(contrato)}
                            >
                              <Download size={16} className="mr-1" />
                              Baixar
                            </Button>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="pagamentos">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Receipt size={20} className="text-imobiliaria-azul" />
                    Seus Boletos
                  </CardTitle>
                  <CardDescription>
                    Histórico e downloads de boletos para pagamento
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading && <p>Carregando boletos...</p>}
                  {!loading && boletos.length === 0 && (
                    <p className="text-gray-500">Nenhum boleto disponível.</p>
                  )}
                  <ul className="divide-y">
                    {boletos.map((boleto) => (
                      <li
                        key={boleto.id}
                        className="flex justify-between items-center py-3"
                      >
                        <div>
                          <p className="font-semibold">{boleto.invoiceNumber}</p>
                          <p className="text-sm text-gray-500">
                            Vencimento: {boleto.dueDate}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownloadBoleto(boleto)}
                        >
                          <Download size={16} className="mr-1" />
                          Baixar Boleto
                        </Button>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documentos">
              <Card>
                <CardHeader>
                  <CardTitle>Documentos Importantes</CardTitle>
                  <CardDescription>
                    Acesse documentos relacionados à locação
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Documentos adicionais serão disponibilizados aqui em breve.</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notificacoes">
              <Card>
                <CardHeader>
                  <CardTitle>Notificações</CardTitle>
                  <CardDescription>
                    Mensagens importantes sobre seu contrato e pagamentos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {notificacoes.length === 0 && (
                    <p className="text-gray-500">Nenhuma notificação disponível.</p>
                  )}
                  <ul>
                    {notificacoes.map((notificacao) => (
                      <li
                        key={notificacao.id}
                        className={`p-3 rounded mb-2 ${
                          !notificacao.lida ? "bg-blue-100" : "bg-gray-100"
                        }`}
                      >
                        <h4 className="font-semibold">{notificacao.titulo}</h4>
                        <p>{notificacao.mensagem}</p>
                        <small className="text-gray-500">{notificacao.data}</small>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AreaLocatario;
