import { NextResponse } from "next/server";
import { getAdminSupabase } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/email/resend";
import { getDepositRejectedEmail } from "@/lib/email/templates";

// Elevated API endpoint to reject deposit and update audit state

export async function POST(req: Request) {
  try {
    const { depositId, feedback } = await req.json();

    if (!depositId) {
      return NextResponse.json({ success: false, error: "Missing depositId" }, { status: 400 });
    }

    const supabase = getAdminSupabase();

    // Fetch deposit and user profile
    const { data: depObj } = await supabase
      .from("deposits")
      .select("*, profiles(email, full_name)")
      .eq("id", depositId)
      .single();

    const rejectReason = feedback || "Invalid transaction hash or proof";

    // Try RPC first
    try {
      const { data: rpcRes, error: rpcErr } = await supabase.rpc("reject_deposit_rpc", {
        p_deposit_id: depositId,
        p_admin_id: "00000000-0000-0000-0000-000000000000",
        p_feedback: rejectReason,
      });

      if (!rpcErr && rpcRes && rpcRes.success) {
        // Send email
        if (depObj?.profiles?.email) {
          const emailData = getDepositRejectedEmail(
            depObj.profiles.full_name || "Investor",
            Number(depObj.final_amount || depObj.amount || 0),
            rejectReason
          );
          sendEmail({ to: depObj.profiles.email, subject: emailData.subject, html: emailData.html }).catch((e) =>
            console.warn("Reject email error:", e)
          );
        }

        return NextResponse.json({ success: true, message: "Deposit request rejected." });
      }
    } catch (rpcEx) {
      console.warn("reject_deposit_rpc failed, proceeding with direct admin execution:", rpcEx);
    }

    // Direct update
    const { error: updateErr } = await supabase.from("deposits").update({
      status: "rejected",
      admin_feedback: rejectReason,
      updated_at: new Date().toISOString(),
    }).eq("id", depositId);

    if (updateErr) {
      throw new Error(`Failed to update deposit status: ${updateErr.message}`);
    }

    // Send email notification
    if (depObj?.profiles?.email) {
      const emailData = getDepositRejectedEmail(
        depObj.profiles.full_name || "Investor",
        Number(depObj.final_amount || depObj.amount || 0),
        rejectReason
      );
      sendEmail({ to: depObj.profiles.email, subject: emailData.subject, html: emailData.html }).catch((e) =>
        console.warn("Reject email error in direct execution:", e)
      );
    }

    return NextResponse.json({ success: true, message: "Deposit request rejected." });
  } catch (err: any) {
    console.error("Deposit reject error:", err);
    return NextResponse.json({ success: false, error: err.message || "Internal server error" }, { status: 500 });
  }
}
