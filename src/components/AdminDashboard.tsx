"use client";

import { useEffect, useState } from "react";
import { feriasService } from "@/services/feriasService";
import axios from "axios";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import Image from "next/image";

import userImage from "../../public/user.png";

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
  status: "pendente" | "aprovado" | "rejeitado";
  motivo: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const [ferias, setFerias] = useState<Ferias[]>([]);
  const [loading, setLoading] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Calcular índices para a paginação
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = ferias.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(ferias.length / itemsPerPage);

  // Função para mudar de página
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    loadFerias();
  }, []);

  const loadFerias = async () => {
    try {
      setError(null);
      const data = await feriasService.listAll();
      console.log("Dados recebidos da API:", data); // Log para debug
      // Filtra as férias que têm funcionário válido
      const feriasValidas = data.filter(
        (ferias) => ferias.funcionario && ferias.funcionario._id
      );
      setFerias(feriasValidas);
    } catch (err) {
      console.error("Erro ao carregar férias:", err);
      if (axios.isAxiosError(err)) {
        setError(
          "Erro ao carregar as solicitações de férias. Por favor, tente novamente."
        );
      } else {
        setError("Ocorreu um erro inesperado.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (
    id: string,
    novoStatus: "aprovado" | "rejeitado"
  ) => {
    setAtualizando(true);
    try {
      await feriasService.updateStatus(id, novoStatus);
      await loadFerias();
    } catch (err) {
      console.error("Erro ao atualizar status:", err);
      if (axios.isAxiosError(err)) {
        setError("Erro ao atualizar o status. Por favor, tente novamente.");
      } else {
        setError("Ocorreu um erro inesperado ao atualizar o status.");
      }
    } finally {
      setAtualizando(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "aprovado":
        return "bg-green-100 text-green-800";
      case "rejeitado":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  if (error) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      </div>
    );
  }

  const handleDeleteFerias = async (id: string) => {
    if (
      !window.confirm(
        "Tem certeza que deseja deletar esta solicitação de férias?"
      )
    ) {
      return;
    }
    try {
      setAtualizando(true);
      await feriasService.deleteAsAdmin(id);
      await loadFerias();
    } catch (err) {
      console.error("Erro ao deletar férias:", err);
      if (axios.isAxiosError(err)) {
        setError("Erro ao deletar férias. Por favor, tente novamente.");
      } else {
        setError("Ocorreu um erro inesperado ao deletar férias.");
      }
    } finally {
      setAtualizando(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#4012A1] to-[#E86E2F] bg-clip-text text-transparent mt-16">
          Gerenciamento de Férias
        </h1>
        <p className="text-gray-600 mt-2">
          Gerencie todas as solicitações de férias dos funcionários
        </p>
      </div>

      {loading ? (
        <div className="text-center py-8">Carregando...</div>
      ) : ferias.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-lg shadow-md">
          <p className="text-gray-600">Não há solicitações de férias.</p>
        </div>
      ) : (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-[#4012A1] via-[#4012A1] to-[#E86E2F]">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Funcionário
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Período
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Motivo
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Data da Solicitação
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.map((ferias) => (
                <tr
                  key={ferias._id}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 mr-3">
                        <Image
                          src={userImage}
                          alt="Foto do usuário"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {ferias.funcionario.nome}
                        </div>
                        <div className="text-sm text-gray-500">
                          {ferias.funcionario.cargo}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {formatDate(ferias.dataInicio)} <br />{" "}
                    {formatDate(ferias.dataFim)}
                  </td>
                  <td className="px-6 py-4 whitespace-normal break-words max-w-xs">
                    {ferias.motivo || "Sem motivo especificado"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                        ferias.status
                      )}`}
                    >
                      {ferias.status.charAt(0).toUpperCase() +
                        ferias.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {formatDate(ferias.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {ferias.status === "pendente" && !atualizando && (
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() =>
                            handleUpdateStatus(ferias._id, "aprovado")
                          }
                          className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-full text-sm hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer"
                        >
                          Aprovar
                        </button>
                        <button
                          onClick={() =>
                            handleUpdateStatus(ferias._id, "rejeitado")
                          }
                          className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-full text-sm hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer"
                        >
                          Rejeitar
                        </button>
                      </div>
                    )}
                    {(ferias.status === "aprovado" ||
                      ferias.status === "rejeitado") && (
                      <button
                        onClick={() => handleDeleteFerias(ferias._id)}
                        className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-full text-sm hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer"
                      >
                        Deletar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

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
                    {Math.min(indexOfLastItem, ferias.length)}
                  </span>{" "}
                  de <span className="font-medium">{ferias.length}</span>{" "}
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
      )}
    </div>
  );
}
