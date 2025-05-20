import axios from "axios";

const API_URL = "http://localhost:5000";

export const login = async (email: string, senha: string) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, { email, senha });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data.erro || "Erro no login";
    } else {
      throw "Erro no login";
    }
  }
};

export const register = async (nome: string, email: string, senha: string) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, { nome, email, senha });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data.erro || "Erro no registro";
    } else {
      throw "Erro no registro";
    }
  }
};
