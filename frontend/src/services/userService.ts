
import axios from "axios";

// Definição do tipo de usuário
export interface User {
  id: number | string;
  nome: string;
  email: string;
  tipo: "Administrador" | "Locatário" | "Funcionário";
  telefone?: string;
  status: "Ativo" | "Inativo";
  dataRegistro?: string;
  senha?: string;
}

// URL base da API (ajuste conforme seu ambiente)
const API_URL = process.env.NODE_ENV === "production"
  ? "/auth" // URL em produção
  : "http://localhost:5000/auth"; // URL local para desenvolvimento

export const userService = {
  // Obter todos os usuários
  getAll: () => {
    return axios.get<User[]>(`${API_URL}/users`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });
  },

  // Obter um usuário pelo ID
  getById: (id: number | string) => {
    return axios.get<User>(`${API_URL}/users/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });
  },

  // Criar um novo usuário
  create: (user: Omit<User, "id" | "dataRegistro">) => {
    return axios.post<User>(`${API_URL}/register`, user, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });
  },

  // Atualizar um usuário existente
  update: (id: number | string, user: Partial<User>) => {
    return axios.put<User>(`${API_URL}/users/${id}`, user, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });
  },

  // Atualizar apenas o status de um usuário
  updateStatus: (id: number | string, status: "Ativo" | "Inativo") => {
    return axios.patch<User>(`${API_URL}/users/${id}/status`, { status }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });
  },

  // Deletar um usuário
  delete: (id: number | string) => {
    return axios.delete(`${API_URL}/users/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });
  },

  // Autenticar um usuário
  login: (email: string, password: string) => {
    return axios.post<{ token: string; user: User }>(`${API_URL}/login`, { 
      email, 
      password 
    });
  },

  // Verificar se o token é válido
  verifyToken: (token: string) => {
    return axios.get(`${API_URL}/verify-token`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
};
