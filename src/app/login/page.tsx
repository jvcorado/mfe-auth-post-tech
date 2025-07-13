"use client";

import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Button from "@/components/button";
import Link from "next/link";

export default function Login() {
  const { login, loading, isAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Redireciona se já estiver logado
  useEffect(() => {
    if (!loading && isAuthenticated) {
      window.location.href = "/dashboard";
    }
  }, [isAuthenticated, loading]);

  // Mostra loading enquanto verifica autenticação
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      alert("Por favor, preencha todos os campos");
      return;
    }

    try {
      await login(email, password);
    } catch (err: unknown) {
      // Os erros já são tratados pelo AuthContext com toast
      console.error("Erro no login:", err);
    }
  };

  const handleButtonClick = () => {
    const form = document.querySelector("form");
    if (form) {
      form.requestSubmit();
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-sm shadow-xl p-4 bg-white">
        <CardHeader>
          <CardTitle className="text-center text-[#47A138]">
            Faça seu Login
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="border border-[#47A138]"
              required
            />
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Senha"
              className="border border-[#47A138]"
              required
            />
            <Button
              text={loading ? "Entrando..." : "Entrar"}
              colors="green"
              className="w-full"
              onClick={handleButtonClick}
            />
          </form>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Não tem uma conta?{" "}
              <Link href="/register" className="text-[#47A138] hover:underline">
                Registre-se
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
