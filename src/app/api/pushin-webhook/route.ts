// src/app/api/pushin-webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // SERVICE ROLE (só backend)
const pushinSecret = process.env.PUSHIN_WEBHOOK_TOKEN!;            // mesmo token da Pushin

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: NextRequest) {
  try {
    // ✅ valida o token que a Pushin manda no header
    const headerToken = req.headers.get("x-pushinpay-token");
    if (!headerToken || headerToken !== pushinSecret) {
      console.error("❌ Token do webhook inválido:", headerToken);
      return NextResponse.json({ ok: false }, { status: 401 });
    }

    const body = await req.json();

    console.log("💳 Webhook Pushin recebido:", body);

    const status = body.status;               // ex: "paid"
    const referenceId = body.reference_id;    // aqui vai ser o userId
    const plan = body.plan ?? "basico";       // "basico", "destaque", "premium"...

    if (!referenceId) {
      console.error("Webhook sem referenceId");
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const isPaid =
      status === "paid" ||
      status === "approved" ||
      status === "concluded";

    if (!isPaid) {
      console.log("Pagamento com status não-aprovado:", status);
      return NextResponse.json({ ok: true });
    }

    // 👉 Atualiza o plano do usuário na tabela profiles
    const { error } = await supabase
      .from("profiles")
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
    return NextResponse.json(
      { ok: false, error: err?.message },
      { status: 500 }
    );
  }
}

// Opcional, pra ver no navegador se a rota existe
export async function GET() {
  return NextResponse.json({
    ok: true,
    message: "Pushin webhook endpoint ativo",
  });
}
