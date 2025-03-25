"use client";

import { useState, useEffect } from "react";
import { authService } from "@/services/authService";
import { feriasService } from "@/services/feriasService";
import api from "@/services/api";
import Image from "next/image";
import userImage from "../../public/user.png";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

import axios from "axios";

interface User {
  _id: string;
  nome: string;
  email: string;
  cargo: string;
  isAdmin: boolean;
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Calcular índices para a paginação
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = users.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(users.length / itemsPerPage);

  // Função para mudar de página
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await api.get<User[]>("/api/auth/users");
      setUsers(response.data.filter((user) => !user.isAdmin)); // Mostra apenas usuários não-admin
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError("Erro ao carregar usuários");
        console.error("Erro ao carregar usuários:", err.message);
      } else {
        setError("Erro ao carregar usuários");
        console.error("Erro ao carregar usuários:", err);
      }
    }
  };

  const handlePromoteToAdmin = async (userId: string) => {
    try {
      setError("");
      setSuccess("");
      await authService.promoteToAdmin(userId);
      setSuccess("Usuário promovido a administrador com sucesso!");
      loadUsers();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.message || "Erro ao promover usuário");
      } else {
        setError("Erro ao promover usuário");
        console.error("Erro ao promover usuário:", err);
      }
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (
      !window.confirm(
        "Tem certeza que deseja deletar este usuário? Todas as suas solicitações de férias também serão excluídas."
      )
    ) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      // Primeiro deleta todas as solicitações de férias do usuário
      try {
        await feriasService.deleteByUserId(userId);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          console.error("Erro ao deletar férias:", err.message);
        } else {
          console.error("Erro ao deletar férias:", err);
        }
        // Continua mesmo se houver erro ao deletar férias
      }

      // Depois deleta o usuário
      await authService.deleteUser(userId);
      setSuccess(
        "Usuário e suas solicitações de férias foram deletados com sucesso!"
      );
      loadUsers();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error("Erro ao deletar usuário:", err.message);
        setError(err.message || "Erro ao deletar usuário");
      } else {
        console.error("Erro ao deletar usuário:", err);
        setError("Erro ao deletar usuário");
      }
    }
  };

  if (users.length === 0) {
    return null; // Não mostra nada se não houver usuários para promover
  }

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#4012A1] to-[#E86E2F] bg-clip-text text-transparent">
          Gerenciamento de Usuários
        </h1>
        <p className="text-gray-600 mt-2">
          Gerencie os usuários do sistema e suas permissões
        </p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4">
          {success}
        </div>
      )}

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {currentItems.map((user) => (
            <div
              key={user._id}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 mr-3">
                  <Image
                    src={userImage}
                    alt="Foto do usuário"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="font-medium text-lg text-gray-900">
                  {user.nome}
                </div>
              </div>
              <div className="text-sm text-gray-600 mb-1">{user.email}</div>
              <div className="text-sm text-gray-500 mb-4">{user.cargo}</div>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => handlePromoteToAdmin(user._id)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm hover:bg-blue-600 transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer"
                >
                  Promover a Admin
                </button>
                <button
                  onClick={() => handleDeleteUser(user._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-full text-sm hover:bg-red-600 transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer"
                >
                  Deletar
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Paginação */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Anterior
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Próxima
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Mostrando{" "}
                <span className="font-medium">{indexOfFirstItem + 1}</span> a{" "}
                <span className="font-medium">
                  {Math.min(indexOfLastItem, users.length)}
                </span>{" "}
                de <span className="font-medium">{users.length}</span>{" "}
                resultados
              </p>
            </div>
            <div>
              <nav
                className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <span className="sr-only">Anterior</span>
                  <FiChevronLeft className="h-5 w-5" />
                </button>
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => handlePageChange(index + 1)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      currentPage === index + 1
                        ? "z-10 bg-[#4012A1] border-[#4012A1] text-white cursor-pointer"
                        : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50 cursor-pointer"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <span className="sr-only">Próxima</span>
                  <FiChevronRight className="h-5 w-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
