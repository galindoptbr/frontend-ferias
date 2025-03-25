import axios from 'axios';
import { authService } from './authService';

// Log da URL da API no momento da inicialização
console.log('[API Init] URL:', process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000');

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000, // 10 segundos
  withCredentials: false, // Desabilitando credentials por enquanto
});

// Log da configuração inicial da API
console.log('[API Config]', {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: false
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

// Interceptor para tratar erros de resposta
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
  (error) => {
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

      // Erro de rede (sem conexão com o servidor)
      if (!error.response) {
        console.error('[Network Error] Não foi possível conectar ao servidor');
        return Promise.reject(new Error('Não foi possível conectar ao servidor. Verifique se a API está rodando e tente novamente.'));
      }

      // Erro de autenticação
      if (error.response.status === 401) {
        // Não redireciona se for a rota de login
        if (!error.config?.url?.includes('/api/auth/login')) {
          authService.logout();
          window.location.href = '/login';
          return Promise.reject(new Error('Sessão expirada. Por favor, faça login novamente.'));
        }
        return Promise.reject(error);
      }

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