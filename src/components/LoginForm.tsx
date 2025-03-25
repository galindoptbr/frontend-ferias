"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { authService } from "@/services/authService";
import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";

interface LoginForm {
  email: string;
  senha: string;
}

export default function LoginForm() {
  const router = useRouter();
  const { updateAuthState } = useAuth();
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    try {
      setError("");
      const response = await authService.loginWithCredentials(data);
      updateAuthState();

      // Redireciona baseado no tipo de usuário
      if (response.user.isAdmin) {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        setError("Email ou senha incorretos");
        return;
      }
      setError("Erro ao fazer login. Tente novamente mais tarde.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 pt-24">
      <div className="max-w-md mx-auto">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="mb-8 p-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#4012A1] to-[#E86E2F] bg-clip-text text-transparent">
              Login
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  {...register("email", {
                    required: "Email é obrigatório",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Email inválido",
                    },
                  })}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#4012A1] focus:ring-[#4012A1] transition-all duration-300 p-2.5"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Senha
                </label>
                <input
                  type="password"
                  {...register("senha", {
                    required: "Senha é obrigatória",
                    minLength: {
                      value: 6,
                      message: "A senha deve ter pelo menos 6 caracteres",
                    },
                  })}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#4012A1] focus:ring-[#4012A1] transition-all duration-300 p-2.5"
                />
                {errors.senha && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.senha.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#4012A1] to-[#E86E2F] text-white px-6 py-2.5 rounded-full hover:opacity-90 transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer"
              >
                Entrar
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
