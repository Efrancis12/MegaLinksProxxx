"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from '@/lib/supabase';

// 1️⃣ Wrapper necessário para buildar na Vercel
export default function PagamentoPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40 }}>Carregando pagamento...</div>}>
      <PagamentoPageContent />
    </Suspense>
  );
}

// 2️⃣ Aqui fica TODO seu código original (agora ajustado)
function PagamentoPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const plano = searchParams.get("plano");

  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Buscar usuário logado
  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        console.warn("Usuário não logado, redirecionando para login");
        router.push("/login"); // ajuste se sua rota de login for outra
        return;
      }
      setUserId(data.user.id);
    };
    fetchUser();
  }, [router]);

  // Se não tiver plano válido, não faz nada
  useEffect(() => {
    if (!plano) return;
    // pode colocar validação de plano aqui se quiser
  }, [plano]);

  const handlePagamento = async () => {
    if (!plano || !userId) return;

    try {
      setLoading(true);

      const res = await fetch("/api/pushin-create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plano, userId }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        console.error("Erro ao criar checkout:", data);
        alert("Erro ao criar link de pagamento. Tente novamente.");
        setLoading(false);
        return;
      }

      const paymentUrl = data.paymentUrl as string;
      window.location.href = paymentUrl;
    } catch (err) {
      console.error("Erro ao iniciar pagamento:", err);
      alert("Erro ao iniciar pagamento. Tente novamente.");
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>Finalize seu pagamento</h1>

      {!plano && <p>Nenhum plano selecionado.</p>}

      {plano && (
        <>
          <p>
            Você está contratando o plano: <strong>{plano}</strong>
          </p>

          <button
            onClick={handlePagamento}
            style={{
              marginTop: "20px",
              padding: "12px 28px",
              background: "#6366f1",
              color: "white",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              fontSize: "18px",
            }}
            disabled={loading || !userId}
          >
            {loading ? "Redirecionando..." : "Pagar com Pushin Pay"}
          </button>
        </>
      )}
    </div>
  );
}
