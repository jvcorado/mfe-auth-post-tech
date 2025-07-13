"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { Account } from "@/models/Account";
import { Transaction } from "@/models/Transaction";
import { useAuth } from "./AuthContext";
import { AccountService } from "@/services/AccountService";
import { TransactionService } from "@/services/TransactionService";
import toast from "react-hot-toast";

interface BankContextData {
  accounts: Account[];
  selectedAccount: Account | null;
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  selectAccount: (account: Account) => void;
  refreshAccounts: () => Promise<void>;
  refreshTransactions: () => Promise<void>;
  createAccount: (name: string) => Promise<void>;
  updateAccount: (id: number, name: string) => Promise<void>;
  deleteAccount: (id: number) => Promise<void>;
  addTransaction: (type: "INCOME" | "EXPENSE", amount: number) => Promise<void>;
  updateTransaction: (
    id: number,
    type: "INCOME" | "EXPENSE",
    amount: number
  ) => Promise<void>;
  deleteTransaction: (id: number) => Promise<void>;
}

const BankContext = createContext<BankContextData | undefined>(undefined);

export const BankProvider = ({ children }: { children: React.ReactNode }) => {
  const { accounts: authAccounts, isAuthenticated } = useAuth();

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sincronizar contas do AuthContext
  useEffect(() => {
    if (authAccounts && authAccounts.length > 0) {
      setAccounts(authAccounts);
      if (!selectedAccount && authAccounts.length > 0) {
        setSelectedAccount(authAccounts[0]);
      }
    }
  }, [authAccounts, selectedAccount]);

  // Carregar transações quando uma conta é selecionada
  useEffect(() => {
    const loadTransactions = async () => {
      if (!selectedAccount || !isAuthenticated) return;

      setLoading(true);
      setError(null);

      try {
        const { account: updatedAccount, transactions: fetchedTransactions } =
          await AccountService.getById(selectedAccount.id);
        setTransactions(fetchedTransactions);

        // Atualizar a conta na lista de contas
        setAccounts((prev) =>
          prev.map((acc) =>
            acc.id === updatedAccount.id ? updatedAccount : acc
          )
        );
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erro ao carregar transações";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, [selectedAccount?.id, isAuthenticated]);

  const selectAccount = (account: Account) => {
    setSelectedAccount(account);
  };

  const refreshAccounts = useCallback(async () => {
    if (!isAuthenticated) return;

    setLoading(true);
    setError(null);

    try {
      const fetchedAccounts = await AccountService.getAll();
      setAccounts(fetchedAccounts);

      // Se não há conta selecionada, selecionar a primeira
      if (!selectedAccount && fetchedAccounts.length > 0) {
        setSelectedAccount(fetchedAccounts[0]);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao carregar contas";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, selectedAccount]);

  const refreshTransactions = useCallback(async () => {
    if (!selectedAccount || !isAuthenticated) return;

    setLoading(true);
    setError(null);

    try {
      const { account: updatedAccount, transactions: fetchedTransactions } =
        await AccountService.getById(selectedAccount.id);
      setTransactions(fetchedTransactions);

      // Não atualizar selectedAccount aqui para evitar loop infinito

      // Atualizar a conta na lista de contas
      setAccounts((prev) =>
        prev.map((acc) => (acc.id === updatedAccount.id ? updatedAccount : acc))
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao carregar transações";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [selectedAccount, isAuthenticated]);

  const createAccount = async (name: string) => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      const newAccount = await AccountService.create(name);
      setAccounts((prev) => [...prev, newAccount]);
      toast.success("Conta criada com sucesso!");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao criar conta";
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateAccount = async (id: number, name: string) => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      const updatedAccount = await AccountService.update(id, name);
      setAccounts((prev) =>
        prev.map((acc) => (acc.id === id ? updatedAccount : acc))
      );

      if (selectedAccount?.id === id) {
        setSelectedAccount(updatedAccount);
      }

      toast.success("Conta atualizada com sucesso!");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao atualizar conta";
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteAccount = async (id: number) => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      await AccountService.delete(id);
      setAccounts((prev) => prev.filter((acc) => acc.id !== id));

      if (selectedAccount?.id === id) {
        const remainingAccounts = accounts.filter((acc) => acc.id !== id);
        setSelectedAccount(
          remainingAccounts.length > 0 ? remainingAccounts[0] : null
        );
      }

      toast.success("Conta deletada com sucesso!");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao deletar conta";
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addTransaction = async (type: "INCOME" | "EXPENSE", amount: number) => {
    if (!selectedAccount || !isAuthenticated) return;

    try {
      setLoading(true);
      await TransactionService.create(selectedAccount.id, type, amount);
      await refreshTransactions();
      toast.success("Transação adicionada com sucesso!");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao adicionar transação";
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTransaction = async (
    id: number,
    type: "INCOME" | "EXPENSE",
    amount: number
  ) => {
    if (!selectedAccount || !isAuthenticated) return;

    try {
      setLoading(true);
      await TransactionService.update(id, type, amount);
      await refreshTransactions();
      toast.success("Transação atualizada com sucesso!");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao atualizar transação";
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteTransaction = async (id: number) => {
    if (!selectedAccount || !isAuthenticated) return;

    try {
      setLoading(true);
      await TransactionService.delete(id);
      await refreshTransactions();
      toast.success("Transação deletada com sucesso!");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao deletar transação";
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <BankContext.Provider
      value={{
        accounts,
        selectedAccount,
        transactions,
        loading,
        error,
        selectAccount,
        refreshAccounts,
        refreshTransactions,
        createAccount,
        updateAccount,
        deleteAccount,
        addTransaction,
        updateTransaction,
        deleteTransaction,
      }}
    >
      {children}
    </BankContext.Provider>
  );
};

export const useBank = () => {
  const context = useContext(BankContext);
  if (context === undefined) {
    throw new Error("useBank deve ser usado dentro de um BankProvider");
  }
  return context;
};
