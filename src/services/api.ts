import axios from 'axios';

const API_URL = 'https://vacation-node-dp2yb3hh-galindoptbrs-projects.vercel.app';
console.log('[API] Inicializando com URL:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  }
});

// Interceptor para adicionar o token em todas as requisições
api.interceptors.request.use((config) => {
  console.log('[API] Fazendo requisição para:', config.url);
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  console.error('[API] Erro na configuração da requisição:', error);
  return Promise.reject(error);
});

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => {
    console.log('[API] Resposta recebida de:', response.config.url);
    return response;
  },
  async (error) => {
    console.error('[API] Erro na requisição:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data
    });

    if (error.code === 'ECONNABORTED' || !error.response) {
      throw new Error('Não foi possível conectar ao servidor. Verifique sua conexão.');
    }

    if (error.response?.status === 500) {
      const errorMessage = error.response?.data?.message || 'Erro interno do servidor';
      if (errorMessage.includes('MongoDB') || errorMessage.includes('database')) {
        throw new Error('Erro de conexão com o banco de dados. Tente novamente mais tarde.');
      }
      throw new Error(errorMessage);
    }
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }

    if (error.response?.status === 400) {
      throw new Error(error.response?.data?.message || 'Dados inválidos. Verifique as informações.');
    }

    if (error.response?.status === 404) {
      throw new Error('Recurso não encontrado.');
    }
    
    throw error;
  }
);

export default api; 