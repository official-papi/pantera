import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email/resend";
import {
  getWelcomeEmail,
  getDepositReceivedEmail,
  getDepositApprovedEmail,
  getDepositRejectedEmail,
  getWithdrawalRequestedEmail,
  getWithdrawalApprovedEmail,
  getWithdrawalRejectedEmail,
  getInvestmentStartedEmail,
  getKycStatusEmail,
  getPasswordResetEmail,
  getPasswordChangedNotificationEmail,
  getResendVerificationEmail,
} from "@/lib/email/templates";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      type,
      to,
      name,
      amount,
      gateway,
      trxId,
      method,
      destination,
      newBalance,
      feedback,
      targetWallet,
      planName,
      roiPercentage,
      totalPeriods,
      status,
      resetUrl,
      verifyUrl,
      expiresInMinutes,
    } = body;

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
      case "deposit_rejected":
        emailData = getDepositRejectedEmail(name || "Investor", Number(amount || 0), feedback || "");
        break;
      case "withdrawal_requested":
        emailData = getWithdrawalRequestedEmail(name || "Investor", Number(amount || 0), method || "Crypto", destination || "");
        break;
      case "withdrawal_approved":
        emailData = getWithdrawalApprovedEmail(name || "Investor", Number(amount || 0), method || "Crypto");
        break;
      case "withdrawal_rejected":
        emailData = getWithdrawalRejectedEmail(name || "Investor", Number(amount || 0), feedback || "", targetWallet || "interest_wallet");
        break;
      case "investment_started":
        emailData = getInvestmentStartedEmail(name || "Investor", planName || "Growth Plan", Number(amount || 0), Number(roiPercentage || 0), Number(totalPeriods || 0));
        break;
      case "kyc_status":
        emailData = getKycStatusEmail(name || "Investor", status || "approved", feedback);
        break;
      case "password_reset":
        if (!resetUrl) {
          return NextResponse.json({ success: false, error: "resetUrl is required for password_reset" }, { status: 400 });
        }
        emailData = getPasswordResetEmail({
          name: name || "Investor",
          email: to,
          resetUrl,
          expiresInMinutes: expiresInMinutes || 60,
        });
        break;
      case "password_changed":
        emailData = getPasswordChangedNotificationEmail({
          name: name || "Investor",
          email: to,
        });
        break;
      case "resend_verification":
        if (!verifyUrl) {
          return NextResponse.json({ success: false, error: "verifyUrl is required for resend_verification" }, { status: 400 });
        }
        emailData = getResendVerificationEmail({
          name: name || "Investor",
          email: to,
          verifyUrl,
        });
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
