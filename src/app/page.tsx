"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import Login from "./login/page";

export default function Home() {
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      // Se o usuário já está autenticado, redireciona para o dashboard
      window.location.href = "/dashboard";
    }
  }, [isAuthenticated, loading]);

  // Enquanto carrega, mostra uma tela de loading
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#47A138] mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Se não está autenticado, mostra o login
  return <Login />;
}
