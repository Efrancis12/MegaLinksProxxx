import { NextRequest, NextResponse } from "next/server";

// Mapeamento dos planos para links fixos da Pushin (NOVOS LINKS)
const PLAN_LINKS: Record<string, string> = {
  basico: "https://app.pushinpay.com.br/service/pay/A05FF614-C67F-4744-B3DD-F2AB45BB3E5B",
  destaque: "https://app.pushinpay.com.br/service/pay/A061104D-031A-4B51-B08C-FDE6638E5127",
  premium: "https://app.pushinpay.com.br/service/pay/A06111EE-929A-4345-9813-26E9CCF10FA9",
};

export async function POST(req: NextRequest) {
  try {
    const { plano } = await req.json();

    if (!plano) {
      return NextResponse.json(
        { ok: false, erro: "Plano não enviado" },
        { status: 400 }
      );
    }

    const paymentUrl = PLAN_LINKS[plano];

    if (!paymentUrl) {
      return NextResponse.json(
        { ok: false, erro: `Plano inválido: ${plano}` },
        { status: 400 }
      );
    }

    return NextResponse.json({
      ok: true,
      paymentUrl,
    });
  } catch (err) {
    console.error("Erro em /api/pushin-create-checkout:", err);
    return NextResponse.json(
      { ok: false, erro: "Erro interno ao iniciar pagamento" },
      { status: 500 }
    );
  }
}
