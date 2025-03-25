import axios from 'axios';
import { authService } from './authService';

// Log da URL da API no momento da inicialização
console.log('[API Init] URL:', process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000');

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  timeout: 30000, // aumentando para 30 segundos
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true // Habilitando credentials para CORS
});

// Log da configuração inicial da API
console.log('[API Config]', {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true
});

// Interceptor para adicionar o token em todas as requisições
api.interceptors.request.use(
  (config) => {
    // Log detalhado da requisição para debug
    console.log('[API Request]', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`,
      headers: config.headers,
      data: config.data,
      withCredentials: config.withCredentials
    });

    const token = authService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('[API Request Error]', {
      message: error.message,
      config: error.config,
      stack: error.stack
    });
    return Promise.reject(error);
  }
);

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => {
    // Log detalhado da resposta para debug
    console.log('[API Response]', {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      data: response.data,
      config: {
        url: response.config.url,
        method: response.config.method,
        baseURL: response.config.baseURL,
        withCredentials: response.config.withCredentials
      }
    });
    return response;
  },
  async (error) => {
    if (error.code === 'ECONNABORTED' || !error.response) {
      console.error('Erro de conexão:', error);
      throw new Error('Não foi possível conectar ao servidor. Verifique sua conexão.');
    }
    
    if (error.response?.status === 401) {
      authService.logout();
      window.location.href = '/login';
    }
    
    if (axios.isAxiosError(error)) {
      // Log detalhado do erro
      console.error('[API Error]', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          baseURL: error.config?.baseURL,
          headers: error.config?.headers,
          withCredentials: error.config?.withCredentials
        }
      });

      // Erro de permissão
      if (error.response.status === 403) {
        return Promise.reject(new Error('Você não tem permissão para realizar esta ação.'));
      }

      // Erro 404
      if (error.response.status === 404) {
        return Promise.reject(new Error('Endpoint não encontrado. Verifique se a rota está correta.'));
      }

      // Erro 500
      if (error.response.status === 500) {
        return Promise.reject(new Error('Erro interno do servidor. Tente novamente mais tarde.'));
      }
    }

    return Promise.reject(error);
  }
);

export default api; 