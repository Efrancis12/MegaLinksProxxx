import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    console.log("🚀 Webhook Pushin recebido:", body);

    // Aqui você adapta de acordo com o que a Pushin manda
    // Esses nomes são exemplos – depois é bom conferir no painel / docs deles:
    const status = body.status;                // ex: "paid", "approved"
    const referenceId = body.reference_id;     // ID interno que você enviar

    // Se não tiver referenceId, não tem como saber quem é o usuário
    if (!referenceId) {
      console.error("Webhook sem referenceId");
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    // Só faz algo se o pagamento foi aprovado
    const isPaid =
      status === "paid" ||
      status === "approved" ||
      status === "concluded";

    if (isPaid) {
      // 👉 AQUI entra a lógica de atualizar o plano no seu banco (Supabase, etc.)
      // Exemplo (quando você quiser implementar de verdade):
      //
      // const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
      // await supabase.from("profiles")
      //   .update({ plano: "basico", plano_ativo: true })
      //   .eq("id", referenceId);
      //
      console.log("Pagamento aprovado para referência:", referenceId);
    }

    // Sempre responde 200 para a Pushin não ficar reenviando sem parar
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Erro no webhook da Pushin:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

// Opcional, só pra você conseguir abrir no navegador e ver que a rota existe
export async function GET() {
  return NextResponse.json({ ok: true, message: "Pushin webhook endpoint ativo" });
}
