"use client";

import { useEffect, useRef, useState } from "react";
import { AuthService } from "@/services/AuthService";

export default function DashboardPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMicroFrontend = async () => {
      try {
        // Limpar container antes de carregar
        if (containerRef.current) {
          containerRef.current.innerHTML = "";
        }

        const dashboardUrl = process.env.NEXT_PUBLIC_MF_URL_DASHBOARD;

        if (!dashboardUrl) {
          setError(
            "URL do dashboard não configurada. Verifique a variável NEXT_PUBLIC_MF_URL_DASHBOARD no arquivo .env.local"
          );
          setLoading(false);
          return;
        }
        // Obter o token de autenticação
        const token = AuthService.getToken();
        if (!token) {
          setError(
            "Token de autenticação não encontrado. Faça login novamente."
          );
          setLoading(false);
          return;
        }

        // Carrega o iframe com a aplicação (sem token na URL)
        if (containerRef.current) {
          const iframe = document.createElement("iframe");
          iframe.src = dashboardUrl;
          iframe.style.width = "100%";
          iframe.style.height = "100vh";
          iframe.style.border = "none";
          iframe.style.minHeight = "600px";

          // Salvar referência do iframe
          iframeRef.current = iframe;

          // Adicionar eventos de load
          iframe.onload = () => {
            setLoading(false);
            setError(null);

            // Enviar token via PostMessage após o iframe carregar
            setTimeout(() => {
              if (iframe.contentWindow) {
                iframe.contentWindow.postMessage(
                  {
                    type: "AUTH_TOKEN",
                    token: token,
                    timestamp: Date.now(),
                  },
                  dashboardUrl
                );
              } else {
                console.log("❌ iframe.contentWindow não disponível");
              }
            }, 1000); // Aguarda 1 segundo para garantir que o iframe esteja pronto
          };

          iframe.onerror = () => {
            setLoading(false);
            setError(
              `Erro ao carregar o dashboard. Verifique se a aplicação está rodando em: ${dashboardUrl}`
            );
          };

          containerRef.current.appendChild(iframe);
        }
      } catch (error) {
        console.error("Erro ao carregar micro frontend DASHBOARD:", error);
        setError("Erro interno ao carregar o dashboard");
        setLoading(false);
      }
    };

    loadMicroFrontend();

    // Listener para receber mensagens do iframe
    const handleMessage = (event: MessageEvent) => {
      const isLocalhost =
        event.origin.includes("localhost") ||
        event.origin.includes("127.0.0.1");
      if (!isLocalhost) {
        console.log("❌ Origem não confiável:", event.origin);
        return;
      }

      // Responder a solicitações de token
      if (event.data.type === "REQUEST_TOKEN") {
        const token = AuthService.getToken();
        if (token && iframeRef.current?.contentWindow) {
          iframeRef.current.contentWindow.postMessage(
            {
              type: "AUTH_TOKEN",
              token: token,
              timestamp: Date.now(),
            },
            event.origin
          );
        } else {
          console.log("❌ Token não encontrado ou iframe não disponível");
        }
      }
    };

    // Adicionar listener para PostMessage
    window.addEventListener("message", handleMessage);

    // Cleanup function
    return () => {
      window.removeEventListener("message", handleMessage);
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, []); // Array vazio para executar apenas uma vez

  if (loading) {
    <p>carregando...</p>;
  }

  if (error) {
    <p>error</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="w-full">
        <div
          ref={containerRef}
          className="w-full min-h-[calc(100vh-80px)]"
          id="dashboard-microfrontend"
        />
      </main>
    </div>
  );
}
