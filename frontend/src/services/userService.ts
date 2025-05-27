
import axios from "axios";

// URL base da API
const API_URL = import.meta.env.VITE_API_URL || 'https://seu-backend.vercel.app' || 'http://localhost:5000';

// Definição do tipo de usuário baseado no seu backend
export interface User {
  _id?: string;
  id?: number | string;
  nome: string;
  email: string;
  tipo: "Administrador" | "Locatário" | "Funcionário";
  telefone?: string;
  status: "Ativo" | "Inativo";
  dataRegistro?: string;
  senha?: string;
}

// Configuração do axios com interceptors para token
const apiClient = axios.create({
  baseURL: API_URL,
});

// Interceptor para adicionar token automaticamente
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para tratar erros de autenticação
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const userService = {
  // Autenticar um usuário
  login: (email: string, senha: string) => {
    return axios.post<{ token: string; usuario: User }>(`${API_URL}/auth/login`, { 
      email, 
      senha 
    });
  },

  // Registrar um novo usuário
  register: (userData: Omit<User, "id" | "_id" | "dataRegistro">) => {
    return axios.post<User>(`${API_URL}/auth/register`, userData);
  },

  // Obter todos os usuários (protegido)
  getAll: () => {
    return apiClient.get<User[]>(`/api/usuarios`);
  },

  // Obter um usuário pelo ID
  getById: (id: number | string) => {
    return apiClient.get<User>(`/api/usuarios/${id}`);
  },

  // Criar um novo usuário (admin)
  create: (user: Omit<User, "id" | "_id" | "dataRegistro">) => {
    return apiClient.post<User>(`/api/usuarios`, user);
  },

  // Atualizar um usuário existente
  update: (id: number | string, user: Partial<User>) => {
    return apiClient.put<User>(`/api/usuarios/${id}`, user);
  },

  // Atualizar apenas o status de um usuário
  updateStatus: (id: number | string, status: "Ativo" | "Inativo") => {
    return apiClient.patch<User>(`/api/usuarios/${id}/status`, { status });
  },

  // Deletar um usuário
  delete: (id: number | string) => {
    return apiClient.delete(`/api/usuarios/${id}`);
  },

  // Verificar se o token é válido
  verifyToken: (token: string) => {
    return axios.get(`${API_URL}/auth/verify-token`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },

  // Logout
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }
};
