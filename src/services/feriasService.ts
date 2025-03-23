import api from './api';

interface Ferias {
  _id: string;
  funcionario: {
    _id: string;
    nome: string;
    email: string;
    cargo: string;
  };
  dataInicio: string;
  dataFim: string;
  status: 'pendente' | 'aprovado' | 'rejeitado';
  motivo: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateFeriasData {
  dataInicio: string;
  dataFim: string;
  motivo: string;
}

export const feriasService = {
  async create(data: CreateFeriasData): Promise<Ferias> {
    const response = await api.post<Ferias>('/api/ferias', data);
    return response.data;
  },

  async list(): Promise<Ferias[]> {
    const response = await api.get<Ferias[]>('/api/ferias/minhas');
    return response.data;
  },

  async listAll(): Promise<Ferias[]> {
    const response = await api.get<Ferias[]>('/api/ferias/admin');
    return response.data;
  },

  async updateStatus(id: string, status: 'aprovado' | 'rejeitado'): Promise<Ferias> {
    const response = await api.patch<Ferias>(`/api/ferias/${id}/status`, { status });
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/api/ferias/${id}`);
  }
};