import { NextResponse } from "next/server";
import { getAdminSupabase } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/email/resend";
import { getWithdrawalApprovedEmail } from "@/lib/email/templates";

export async function POST(req: Request) {
  try {
    const { withdrawalId, feedback } = await req.json();

    if (!withdrawalId) {
      return NextResponse.json({ success: false, error: "Missing withdrawalId" }, { status: 400 });
    }

    const supabase = getAdminSupabase();

    // 1. Fetch withdrawal details
    const { data: withObj, error: fetchErr } = await supabase
      .from("withdrawals")
      .select("*, profiles(email, full_name)")
      .eq("id", withdrawalId)
      .single();

    if (fetchErr || !withObj) {
      return NextResponse.json({ success: false, error: "Withdrawal record not found" }, { status: 404 });
    }

    if (withObj.status === "approved") {
      return NextResponse.json({ success: false, error: "Withdrawal is already approved." }, { status: 400 });
    }

    const netAmount = Number(withObj.net_amount || withObj.amount || 0);
    const userId = withObj.user_id;
    const approvalFeedback = feedback || "Withdrawal payout sent successfully";

    // 2. Try RPC first
    try {
      const { data: rpcRes, error: rpcErr } = await supabase.rpc("approve_withdrawal_rpc", {
        p_withdrawal_id: withdrawalId,
        p_admin_id: userId,
        p_feedback: approvalFeedback,
      });

      if (!rpcErr && rpcRes && rpcRes.success) {
        if (withObj.profiles?.email) {
          const emailData = getWithdrawalApprovedEmail(
            withObj.profiles.full_name || "Investor",
            netAmount,
            withObj.method_name || "Crypto Transfer"
          );
          sendEmail({ to: withObj.profiles.email, subject: emailData.subject, html: emailData.html }).catch((e) =>
            console.warn("Withdrawal approve email error:", e)
          );
        }

        return NextResponse.json({ success: true, message: "Withdrawal approved and completed!" });
      }
    } catch (rpcEx) {
      console.warn("approve_withdrawal_rpc failed, proceeding with direct admin execution:", rpcEx);
    }

    // 3. Direct admin execution fallback
    const { error: updateErr } = await supabase.from("withdrawals").update({
      status: "approved",
      admin_feedback: approvalFeedback,
      updated_at: new Date().toISOString(),
    }).eq("id", withdrawalId);

    if (updateErr) {
      throw updateErr;
    }

    // Send email notification
    if (withObj.profiles?.email) {
      const emailData = getWithdrawalApprovedEmail(
        withObj.profiles.full_name || "Investor",
        netAmount,
        withObj.method_name || "Crypto Transfer"
      );
      sendEmail({ to: withObj.profiles.email, subject: emailData.subject, html: emailData.html }).catch((e) =>
        console.warn("Withdrawal approve email error in direct execution:", e)
      );
    }

    return NextResponse.json({ success: true, message: "Withdrawal approved and completed!" });
  } catch (err: any) {
    console.error("Error approving withdrawal:", err);
    return NextResponse.json({ success: false, error: err.message || "Failed to approve withdrawal" }, { status: 500 });
  }
}
