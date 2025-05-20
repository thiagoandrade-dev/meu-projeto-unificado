
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AdminSidebar from "@/components/AdminSidebar";
import { Plus, Search, Pencil, Trash2, UserCheck, UserX, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { userService } from "@/services/userService";

// Schema para validação do formulário
const userFormSchema = z.object({
  nome: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  tipo: z.enum(["Administrador", "Locatário", "Funcionário"]),
  telefone: z.string().min(10, "Telefone inválido").optional(),
  status: z.enum(["Ativo", "Inativo"]),
  senha: z.string().min(6, "Senha deve ter pelo menos 6 caracteres").optional(),
});

type UserFormValues = z.infer<typeof userFormSchema>;

const AdminUsuarios = () => {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<null | any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [usuarios, setUsuarios] = useState<any[]>([]);
  
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      nome: "",
      email: "",
      tipo: "Locatário",
      telefone: "",
      status: "Ativo",
      senha: "",
    },
  });

  // Carrega os usuários ao iniciar o componente
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      // Em um ambiente real, essa chamada seria para a API
      // const response = await userService.getAll();
      // setUsuarios(response.data);
      
      // Usando dados de exemplo por enquanto
      setUsuarios([
        {
          id: 1,
          nome: "João Silva",
          email: "joao.silva@exemplo.com",
          tipo: "Locatário",
          telefone: "(11) 98765-4321",
          status: "Ativo",
          dataRegistro: "15/01/2023"
        },
        {
          id: 2,
          nome: "Maria Souza",
          email: "maria.souza@exemplo.com",
          tipo: "Locatário",
          telefone: "(11) 91234-5678",
          status: "Ativo",
          dataRegistro: "03/03/2023"
        },
        {
          id: 3,
          nome: "Carlos Ferreira",
          email: "carlos.ferreira@exemplo.com",
          tipo: "Administrador",
          telefone: "(11) 99876-5432",
          status: "Ativo",
          dataRegistro: "10/10/2022"
        },
        {
          id: 4,
          nome: "Ana Oliveira",
          email: "ana.oliveira@exemplo.com",
          tipo: "Locatário",
          telefone: "(11) 95555-4444",
          status: "Inativo",
          dataRegistro: "22/05/2023"
        },
        {
          id: 5,
          nome: "Roberto Santos",
          email: "roberto.santos@exemplo.com",
          tipo: "Funcionário",
          telefone: "(11) 92222-3333",
          status: "Ativo",
          dataRegistro: "05/07/2023"
        }
      ]);
    } catch (error) {
      toast({
        title: "Erro ao carregar usuários",
        description: "Não foi possível obter a lista de usuários",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Filtra os usuários com base na pesquisa
  const usuariosFiltrados = usuarios.filter(
    (usuario) =>
      usuario.nome.toLowerCase().includes(search.toLowerCase()) ||
      usuario.email.toLowerCase().includes(search.toLowerCase()) ||
      usuario.tipo.toLowerCase().includes(search.toLowerCase())
  );

  const openAddDialog = () => {
    form.reset(); // Limpa o formulário
    setEditingUser(null);
    setDialogOpen(true);
  };

  const openEditDialog = (user: any) => {
    setEditingUser(user);
    form.reset({
      nome: user.nome,
      email: user.email,
      tipo: user.tipo,
      telefone: user.telefone,
      status: user.status,
      senha: "", // Campo de senha vazio ao editar
    });
    setDialogOpen(true);
  };
  
  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      // Em um ambiente real, essa chamada seria para a API
      // await userService.updateStatus(id, newStatus);
      
      // Atualizando localmente para demonstração
      setUsuarios(usuarios.map(user => 
        user.id === id ? { ...user, status: newStatus } : user
      ));
      
      toast({
        title: "Status alterado",
        description: `Usuário ID: ${id} agora está ${newStatus}`,
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Erro ao alterar status",
        description: "Não foi possível atualizar o status do usuário",
        variant: "destructive",
      });
    }
  };
  
  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja remover este usuário?")) return;
    
    try {
      // Em um ambiente real, essa chamada seria para a API
      // await userService.delete(id);
      
      // Atualizando localmente para demonstração
      setUsuarios(usuarios.filter(user => user.id !== id));
      
      toast({
        title: "Usuário removido",
        description: `O usuário ID: ${id} foi removido com sucesso`,
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Erro ao remover",
        description: "Não foi possível remover o usuário",
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (data: UserFormValues) => {
    setIsLoading(true);
    try {
      if (editingUser) {
        // Em um ambiente real, essa chamada seria para a API
        // await userService.update(editingUser.id, data);
        
        // Atualizando localmente para demonstração
        setUsuarios(usuarios.map(user => 
          user.id === editingUser.id ? { 
            ...user, 
            ...data,
            dataRegistro: user.dataRegistro
          } : user
        ));
        
        toast({
          title: "Usuário atualizado",
          description: `As informações de ${data.nome} foram atualizadas com sucesso`,
          duration: 3000,
        });
      } else {
        // Em um ambiente real, essa chamada seria para a API
        // const response = await userService.create(data);
        
        // Criando localmente para demonstração
        const newUser = {
          id: Math.max(...usuarios.map(u => u.id)) + 1,
          ...data,
          dataRegistro: new Date().toLocaleDateString('pt-BR')
        };
        
        setUsuarios([...usuarios, newUser]);
        
        toast({
          title: "Usuário criado",
          description: `${data.nome} foi cadastrado com sucesso`,
          duration: 3000,
        });
      }
      
      setDialogOpen(false);
    } catch (error) {
      toast({
        title: editingUser ? "Erro ao atualizar" : "Erro ao cadastrar",
        description: "Ocorreu um problema ao processar a operação",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <AdminSidebar />
      
      <div className="flex-1 p-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Gerenciamento de Usuários</h1>
            <p className="text-gray-600">Cadastre e gerencie os usuários do sistema</p>
          </div>
          
          <Button 
            className="bg-imobiliaria-azul hover:bg-imobiliaria-azul/90 flex items-center gap-2"
            onClick={openAddDialog}
          >
            <Plus size={16} />
            Novo Usuário
          </Button>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Buscar usuários por nome, email ou tipo..."
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Carregando usuários...</p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">ID</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Nome</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Email</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Tipo</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Telefone</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Registrado em</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-600">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {usuariosFiltrados.length > 0 ? (
                    usuariosFiltrados.map((usuario) => (
                      <tr key={usuario.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">{usuario.id}</td>
                        <td className="py-3 px-4">{usuario.nome}</td>
                        <td className="py-3 px-4">{usuario.email}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-block py-1 px-2 rounded-full text-xs font-medium ${
                              usuario.tipo === "Administrador"
                                ? "bg-purple-100 text-purple-800"
                                : usuario.tipo === "Funcionário"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {usuario.tipo}
                          </span>
                        </td>
                        <td className="py-3 px-4">{usuario.telefone}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-block py-1 px-2 rounded-full text-xs font-medium ${
                              usuario.status === "Ativo"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {usuario.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">{usuario.dataRegistro}</td>
                        <td className="py-3 px-4">
                          <div className="flex justify-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => openEditDialog(usuario)}
                            >
                              <Pencil size={16} className="text-blue-600" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleDelete(usuario.id)}
                            >
                              <Trash2 size={16} className="text-red-600" />
                            </Button>
                            {usuario.status === "Ativo" ? (
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleStatusChange(usuario.id, "Inativo")}
                              >
                                <UserX size={16} className="text-red-600" />
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleStatusChange(usuario.id, "Ativo")}
                              >
                                <UserCheck size={16} className="text-green-600" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="py-4 text-center text-gray-500">
                        Nenhum usuário encontrado
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Modal para adicionar/editar usuário */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingUser ? "Editar Usuário" : "Novo Usuário"}</DialogTitle>
            <DialogDescription>
              {editingUser 
                ? "Atualize as informações do usuário nos campos abaixo." 
                : "Preencha as informações do novo usuário nos campos abaixo."}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome completo</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do usuário" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="email@exemplo.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="tipo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de usuário</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Administrador">Administrador</SelectItem>
                          <SelectItem value="Funcionário">Funcionário</SelectItem>
                          <SelectItem value="Locatário">Locatário</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Ativo">Ativo</SelectItem>
                          <SelectItem value="Inativo">Inativo</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="telefone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <Input placeholder="(00) 00000-0000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="senha"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {editingUser ? "Nova senha (deixe em branco para manter a atual)" : "Senha"}
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="******"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter className="pt-4 gap-2">
                <Button 
                  variant="outline" 
                  type="button"
                  onClick={() => setDialogOpen(false)}
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="bg-imobiliaria-azul hover:bg-imobiliaria-azul/90"
                >
                  {isLoading ? "Processando..." : editingUser ? "Atualizar" : "Cadastrar"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUsuarios;
