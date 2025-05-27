
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

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

export interface Notificacao {
  _id?: string;
  titulo: string;
  mensagem: string;
  tipo: "info" | "warning" | "success" | "error";
  destinatario: string;
  remetente: string;
  lida: boolean;
  urgente: boolean;
  dataEnvio: string;
  dataLeitura?: string;
  link?: string;
  metadata?: any;
}

export interface EmailConfig {
  tipo: "cobranca" | "lembrete" | "vencimento" | "juridico" | "manutencao" | "boas-vindas";
  destinatario: string;
  assunto: string;
  dados: any;
}

export const notificationService = {
  // Notificações no sistema
  getAll: async (userId?: string): Promise<Notificacao[]> => {
    try {
      const url = userId ? `/api/notifications?userId=${userId}` : '/api/notifications';
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
      throw error;
    }
  },

  create: async (notificacao: Omit<Notificacao, '_id' | 'dataEnvio'>): Promise<Notificacao> => {
    try {
      const response = await api.post('/api/notifications', notificacao);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar notificação:', error);
      throw error;
    }
  },

  markAsRead: async (id: string): Promise<void> => {
    try {
      await api.patch(`/api/notifications/${id}/read`);
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`/api/notifications/${id}`);
    } catch (error) {
      console.error('Erro ao deletar notificação:', error);
      throw error;
    }
  },

  // Envio de emails automáticos
  enviarEmail: async (config: EmailConfig): Promise<void> => {
    try {
      const emailData = {
        ...config,
        remetente: getEmailRemetente(config.tipo),
        template: getEmailTemplate(config.tipo),
        timestamp: new Date().toISOString()
      };

      await api.post('/api/notifications/email', emailData);
    } catch (error) {
      console.error('Erro ao enviar email:', error);
      throw error;
    }
  },

  // Envio de cobranças em lote
  enviarCobrancasLote: async (contratos: string[]): Promise<void> => {
    try {
      await api.post('/api/notifications/cobrancas-lote', {
        contratos,
        remetente: 'financeiro@imobiliariafirenze.com.br',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Erro ao enviar cobranças em lote:', error);
      throw error;
    }
  },

  // Lembretes automáticos
  criarLembretesVencimento: async (diasAntecedencia: number = 7): Promise<void> => {
    try {
      await api.post('/api/notifications/lembretes-vencimento', {
        diasAntecedencia,
        remetente: 'cadastro@imobiliariafirenze.com.br'
      });
    } catch (error) {
      console.error('Erro ao criar lembretes de vencimento:', error);
      throw error;
    }
  },

  // Notificações jurídicas
  enviarNotificacaoJuridica: async (tipo: string, destinatario: string, dados: any): Promise<void> => {
    try {
      await api.post('/api/notifications/juridico', {
        tipo,
        destinatario,
        dados,
        remetente: 'doc@imobiliariafirenze.com.br',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Erro ao enviar notificação jurídica:', error);
      throw error;
    }
  }
};

// Função auxiliar para determinar o email remetente baseado no tipo
const getEmailRemetente = (tipo: string): string => {
  switch (tipo) {
    case 'cobranca':
      return 'financeiro@imobiliariafirenze.com.br';
    case 'juridico':
      return 'doc@imobiliariafirenze.com.br';
    case 'lembrete':
    case 'vencimento':
      return 'cadastro@imobiliariafirenze.com.br';
    case 'manutencao':
      return 'cadastro@imobiliariafirenze.com.br';
    case 'boas-vindas':
      return 'cadastro@imobiliariafirenze.com.br';
    default:
      return 'adm@imobiliariafirenze.com.br';
  }
};

// Função auxiliar para determinar o template do email
const getEmailTemplate = (tipo: string): string => {
  switch (tipo) {
    case 'cobranca':
      return 'template-cobranca';
    case 'lembrete':
      return 'template-lembrete';
    case 'vencimento':
      return 'template-vencimento';
    case 'juridico':
      return 'template-juridico';
    case 'manutencao':
      return 'template-manutencao';
    case 'boas-vindas':
      return 'template-boas-vindas';
    default:
      return 'template-padrao';
  }
};

export default notificationService;
