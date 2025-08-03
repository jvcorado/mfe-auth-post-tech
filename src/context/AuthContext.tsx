"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { UserModel } from "@/models/User";
import { Account } from "@/models/Account";
import { AuthService } from "@/services/AuthService";
import toast from "react-hot-toast";

interface AuthContextType {
  user: UserModel | null;
  accounts: Account[];
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUserData: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserModel | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);

  // Verifica se há token e carrega dados do usuário
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = AuthService.getToken();

        console.log(
          "🔍 Verificando autenticação no MFE Auth:",
          token ? "EXISTE" : "NÃO EXISTE"
        );

        if (token) {
          // Tenta carregar dados do usuário do localStorage primeiro
          const storedUser = AuthService.getUserFromStorage();
          if (storedUser) {
            setUser(storedUser);
          }

          // Depois busca dados atualizados do servidor
          await refreshUserData();
        }
      } catch (error) {
        console.error("Erro ao inicializar autenticação:", error);
        // Se houver erro, limpa os dados
        await logout();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { user: loggedUser, token } = await AuthService.login(
        email,
        password
      );
      setUser(loggedUser);
      toast.success("Login realizado com sucesso!");

      // ENVIA APENAS O TOKEN PARA O MFE CORE
      if (typeof window !== "undefined") {
        console.log("📤 Enviando token para MFE Core após login");
        window.parent.postMessage(
          {
            type: "AUTH_SUCCESS",
            token: token,
          },
          "*"
        );
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao fazer login";
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
      const { user: newUser, account } = await AuthService.register(
        name,
        email,
        password
      );
      setUser(newUser);
      setAccounts([account]);

      toast.success("Conta criada com sucesso!");

      // ENVIA APENAS O TOKEN PARA O MFE CORE APÓS REGISTRO
      if (typeof window !== "undefined") {
        const token = AuthService.getToken();
        console.log("📤 Enviando token para MFE Core após registro");
        window.parent.postMessage(
          {
            type: "AUTH_SUCCESS",
            token: token,
          },
          "*"
        );
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao registrar usuário";
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      console.log("🚪 Iniciando logout...");
      await AuthService.logout();
      setUser(null);
      setAccounts([]);

      toast.success("Logout realizado com sucesso!");

      // COMUNICA LOGOUT PARA O MFE CORE
      if (typeof window !== "undefined") {
        console.log("📤 Enviando mensagem de logout para MFE Core");
        window.parent.postMessage({ type: "AUTH_LOGOUT" }, "*");
      }
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      // Mesmo com erro, limpa os dados e comunica
      setUser(null);
      setAccounts([]);

      if (typeof window !== "undefined") {
        console.log("📤 Enviando mensagem de logout para MFE Core (após erro)");
        window.parent.postMessage({ type: "AUTH_LOGOUT" }, "*");
      }
    }
  };

  const refreshUserData = async () => {
    try {
      const { user: userData, accounts: userAccounts } =
        await AuthService.getCurrentUser();
      setUser(userData);
      setAccounts(userAccounts);
    } catch (error) {
      console.error("Erro ao atualizar dados do usuário:", error);
    }
  };

  const isAuthenticated = !!user && AuthService.isAuthenticated();

  return (
    <AuthContext.Provider
      value={{
        user,
        accounts,
        loading,
        login,
        register,
        logout,
        refreshUserData,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
