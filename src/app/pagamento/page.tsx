"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

// 1️⃣ Wrapper necessário para buildar na Vercel
export default function PagamentoPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40 }}>Carregando pagamento...</div>}>
      <PagamentoPageContent />
    </Suspense>
  );
}

// 2️⃣ Aqui fica TODO seu código original
function PagamentoPageContent() {
  const searchParams = useSearchParams();
  const plano = searchParams.get("plano");
  const [loading, setLoading] = useState(false);

  // LINKS DE PAGAMENTO DA PUSHIN PAY
  const links: Record<string, string> = {
    basico: "https://app.pushinpay.com.br/service/pay/A05FF614-C67F-4744-B3DD-F2AB45BB3E5B",
    destaque: "https://app.pushinpay.com.br/service/pay/A061104D-031A-4B51-B08C-FDE6638E5127",
    premium: "https://app.pushinpay.com.br/service/pay/A06111EE-929A-4345-9813-26E9CCF10FA9",
  };

  useEffect(() => {
    if (!plano || !links[plano]) return;
  }, [plano]);

  const handlePagamento = () => {
    if (!plano) return;
    setLoading(true);
    window.location.href = links[plano];
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
          >
            {loading ? "Redirecionando..." : "Pagar com Pushin Pay"}
          </button>
        </>
      )}
    </div>
  );
}
