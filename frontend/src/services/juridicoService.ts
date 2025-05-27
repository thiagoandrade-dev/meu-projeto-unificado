
import axios from 'axios';

// URL base da API
const API_URL = import.meta.env.VITE_API_URL || 'https://seu-backend.vercel.app' || 'http://localhost:5000';

// Criando instância do axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptador para adicionar o token de autenticação
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptador para tratar respostas e erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface DocumentoJuridico {
  _id?: string;
  titulo: string;
  tipo: "Contrato" | "Adendo" | "Notificação" | "Procuração" | "Distrato" | "Vistoria" | "Outros";
  descricao?: string;
  arquivo: string; // URL ou path do arquivo
  tamanho: string;
  formato: string;
  autor: string;
  contratoRelacionado?: string;
  imovelRelacionado?: string;
  status: "Ativo" | "Arquivado" | "Pendente";
  dataCriacao: string;
  dataModificacao?: string;
  tags?: string[];
  observacoes?: string;
}

export interface ProcessoJuridico {
  _id?: string;
  numero: string;
  tipo: "Despejo" | "Cobrança" | "Danos" | "Distrato" | "Renovação" | "Outros";
  contratoId: string;
  status: "Aberto" | "Em Andamento" | "Concluído" | "Arquivado";
  prioridade: "Baixa" | "Média" | "Alta" | "Urgente";
  descricao: string;
  advogadoResponsavel: string;
  dataAbertura: string;
  dataPrazo?: string;
  documentos: string[];
  observacoes?: string;
  valor?: number;
}

export const juridicoService = {
  // Documentos
  getAllDocumentos: async (): Promise<DocumentoJuridico[]> => {
    try {
      const response = await api.get('/api/juridico/documentos');
      return response.data;
    } catch (error) {
      console.error('Erro ao listar documentos jurídicos:', error);
      throw error;
    }
  },

  createDocumento: async (documentoData: FormData): Promise<DocumentoJuridico> => {
    try {
      const response = await api.post('/api/juridico/documentos', documentoData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao criar documento jurídico:', error);
      throw error;
    }
  },

  updateDocumento: async (id: string, documentoData: Partial<DocumentoJuridico>): Promise<DocumentoJuridico> => {
    try {
      const response = await api.put(`/api/juridico/documentos/${id}`, documentoData);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar documento jurídico:', error);
      throw error;
    }
  },

  deleteDocumento: async (id: string): Promise<void> => {
    try {
      await api.delete(`/api/juridico/documentos/${id}`);
    } catch (error) {
      console.error('Erro ao deletar documento jurídico:', error);
      throw error;
    }
  },

  // Processos
  getAllProcessos: async (): Promise<ProcessoJuridico[]> => {
    try {
      const response = await api.get('/api/juridico/processos');
      return response.data;
    } catch (error) {
      console.error('Erro ao listar processos jurídicos:', error);
      throw error;
    }
  },

  createProcesso: async (processoData: Omit<ProcessoJuridico, '_id' | 'dataAbertura'>): Promise<ProcessoJuridico> => {
    try {
      const response = await api.post('/api/juridico/processos', processoData);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar processo jurídico:', error);
      throw error;
    }
  },

  updateProcesso: async (id: string, processoData: Partial<ProcessoJuridico>): Promise<ProcessoJuridico> => {
    try {
      const response = await api.put(`/api/juridico/processos/${id}`, processoData);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar processo jurídico:', error);
      throw error;
    }
  },

  deleteProcesso: async (id: string): Promise<void> => {
    try {
      await api.delete(`/api/juridico/processos/${id}`);
    } catch (error) {
      console.error('Erro ao deletar processo jurídico:', error);
      throw error;
    }
  },

  // Enviar notificação automática
  enviarNotificacao: async (tipo: string, destinatario: string, dados: any): Promise<void> => {
    try {
      await api.post('/api/juridico/notificacoes', {
        tipo,
        destinatario,
        dados,
        remetente: 'doc@imobiliariafirenze.com.br'
      });
    } catch (error) {
      console.error('Erro ao enviar notificação jurídica:', error);
      throw error;
    }
  }
};

export default juridicoService;
