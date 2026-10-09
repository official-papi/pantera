import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
export const resend = resendApiKey ? new Resend(resendApiKey) : null;

export const DEFAULT_FROM_EMAIL =
  process.env.EMAIL_FROM || "Pantera Capital <support@pantera.cfd>";

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
}

export async function sendEmail({
  to,
  subject,
  html,
  text,
  from = DEFAULT_FROM_EMAIL,
}: SendEmailOptions) {
  if (!resend) {
    console.warn("[Resend] RESEND_API_KEY is not configured. Email not sent:", {
      to,
      subject,
    });
    return { success: false, error: "RESEND_API_KEY not configured" };
  }

  try {
    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
      text,
    });

    if (error) {
      console.error("[Resend] Failed to send email:", error);
      return { success: false, error: error.message };
    }

    console.log("[Resend] Email delivered successfully:", data?.id);
    return { success: true, data };
  } catch (err: any) {
    console.error("[Resend] Unexpected exception while sending email:", err);
    return { success: false, error: err?.message || "Internal email error" };
  }
}
