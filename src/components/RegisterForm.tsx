'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { authService } from '@/services/authService';

interface RegisterForm {
  nome: string;
  email: string;
  senha: string;
  cargo: string;
}

export default function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>();

  const onSubmit = async (data: RegisterForm) => {
    try {
      await authService.register(data);
      router.push("/login");
    } catch {
      setError("Erro ao criar conta. Tente novamente.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 pt-24">
      <div className="max-w-md mx-auto">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="mb-8 p-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#4012A1] to-[#E86E2F] bg-clip-text text-transparent">
              Criar Conta
            </h1>
          </div>
          <div className="p-8">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nome</label>
                <input
                  type="text"
                  {...register('nome', { 
                    required: 'Nome é obrigatório',
                    minLength: {
                      value: 3,
                      message: 'Nome deve ter pelo menos 3 caracteres'
                    }
                  })}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#4012A1] focus:ring-[#4012A1] transition-all duration-300 p-2.5"
                  placeholder="Digite seu nome completo"
                />
                {errors.nome && (
                  <p className="text-red-500 text-sm mt-1">{errors.nome.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  {...register('email', { 
                    required: 'Email é obrigatório',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Email inválido'
                    }
                  })}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#4012A1] focus:ring-[#4012A1] transition-all duration-300 p-2.5"
                  placeholder="seu.email@exemplo.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cargo</label>
                <input
                  type="text"
                  {...register('cargo', { 
                    required: 'Cargo é obrigatório',
                    minLength: {
                      value: 2,
                      message: 'Cargo deve ter pelo menos 2 caracteres'
                    }
                  })}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#4012A1] focus:ring-[#4012A1] transition-all duration-300 p-2.5"
                  placeholder="Ex: Desenvolvedor, Analista, Gerente"
                />
                {errors.cargo && (
                  <p className="text-red-500 text-sm mt-1">{errors.cargo.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Senha</label>
                <input
                  type="password"
                  {...register('senha', { 
                    required: 'Senha é obrigatória',
                    minLength: {
                      value: 6,
                      message: 'A senha deve ter pelo menos 6 caracteres'
                    }
                  })}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#4012A1] focus:ring-[#4012A1] transition-all duration-300 p-2.5"
                  placeholder="Mínimo 6 caracteres"
                />
                {errors.senha && (
                  <p className="text-red-500 text-sm mt-1">{errors.senha.message}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#4012A1] to-[#E86E2F] text-white px-6 py-2.5 rounded-full hover:opacity-90 transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer"
              >
                Criar Conta
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 