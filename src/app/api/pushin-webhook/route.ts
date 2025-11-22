// src/app/api/pushin-webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // SERVICE ROLE (só backend)

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    console.log("💳 Webhook Pushin recebido:", body);

    const status = body.status;            // ex: "paid"
    const referenceId = body.reference_id; // aqui vai ser o userId
    const plan = body.plan ?? "basico";    // planejo que venha "basico", "pro", etc

    if (!referenceId) {
      console.error("Webhook sem referenceId");
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    // Só processa se estiver pago
    const isPaid =
      status === "paid" ||
      status === "approved" ||
      status === "concluded";

    if (!isPaid) {
      console.log("Pagamento com status não-aprovado:", status);
      return NextResponse.json({ ok: true });
    }

    // 👉 AQUI é onde liberamos o plano pro usuário

    // 🔁 Ajuste os nomes da tabela e colunas conforme seu banco.
    // Exemplo supondo uma tabela "profiles" com colunas:
    // - id (igual ao user.id do Supabase Auth)
    // - plan (texto: "basico", "pro", etc.)
    // - plan_status (texto: "active", "expired" etc.)
    const { error } = await supabase
      .from("profiles") // TROQUE se sua tabela tiver outro nome
      .update({
        plan,
        plan_status: "active",
        plan_updated_at: new Date().toISOString(),
      })
      .eq("id", referenceId);

    if (error) {
      console.error("Erro ao atualizar plano do usuário:", error);
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }

    console.log(
      `✅ Pagamento aprovado. Usuário ${referenceId} agora está no plano: ${plan}`
    );

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("Erro no webhook da Pushin:", err);
    return NextResponse.json({ ok: false, error: err?.message }, { status: 500 });
  }
}

// Opcional, pra ver no navegador se a rota existe
export async function GET() {
  return NextResponse.json({
    ok: true,
    message: "Pushin webhook endpoint ativo",
  });
}
