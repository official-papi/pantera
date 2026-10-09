import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email/resend";
import {
  getWelcomeEmail,
  getDepositReceivedEmail,
  getDepositApprovedEmail,
  getWithdrawalRequestedEmail,
  getWithdrawalApprovedEmail,
} from "@/lib/email/templates";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, to, name, amount, gateway, trxId, method, destination, newBalance } = body;

    if (!to) {
      return NextResponse.json({ success: false, error: "Recipient email is required" }, { status: 400 });
    }

    let emailData: { subject: string; html: string } | null = null;

    switch (type) {
      case "welcome":
        emailData = getWelcomeEmail(name || "Investor", to);
        break;
      case "deposit_received":
        emailData = getDepositReceivedEmail(name || "Investor", Number(amount || 0), gateway || "Crypto", trxId || "");
        break;
      case "deposit_approved":
        emailData = getDepositApprovedEmail(name || "Investor", Number(amount || 0), gateway || "Crypto", Number(newBalance || 0));
        break;
      case "withdrawal_requested":
        emailData = getWithdrawalRequestedEmail(name || "Investor", Number(amount || 0), method || "Crypto", destination || "");
        break;
      case "withdrawal_approved":
        emailData = getWithdrawalApprovedEmail(name || "Investor", Number(amount || 0), method || "Crypto");
        break;
      default:
        return NextResponse.json({ success: false, error: `Unknown email type: ${type}` }, { status: 400 });
    }

    const res = await sendEmail({
      to,
      subject: emailData.subject,
      html: emailData.html,
    });

    return NextResponse.json(res);
  } catch (err: any) {
    console.error("[Email API] Error:", err);
    return NextResponse.json({ success: false, error: err?.message || "Internal server error" }, { status: 500 });
  }
}
