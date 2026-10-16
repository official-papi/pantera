import { NextResponse } from "next/server";
import { getAdminSupabase } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/email/resend";
import { getPasswordResetEmail } from "@/lib/email/templates";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = body;

    const cleanEmail = (email || "").trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes("@") || !cleanEmail.includes(".")) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const origin =
      req.headers.get("origin") ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      "https://pantera.cfd";

    const redirectTo = `${origin}/auth/callback?next=/reset-password`;
    const supabaseAdmin = getAdminSupabase();

    // 1. Generate the recovery link via Supabase Admin SDK
    const { data: linkData, error: linkError } =
      await supabaseAdmin.auth.admin.generateLink({
        type: "recovery",
        email: cleanEmail,
        options: {
          redirectTo,
        },
      });

    if (linkError) {
      console.warn("[Forgot Password] Supabase generateLink warning:", linkError.message);
      // For security against user enumeration, return a neutral message even if user doesn't exist
      return NextResponse.json({
        success: true,
        message:
          "If an account exists with this email address, a password reset link has been dispatched.",
      });
    }

    // 2. Lookup profile name if available
    let userName = "Investor";
    try {
      const { data: profile } = await supabaseAdmin
        .from("profiles")
        .select("full_name, username")
        .eq("email", cleanEmail)
        .maybeSingle();

      if (profile?.full_name) {
        userName = profile.full_name;
      } else if (profile?.username) {
        userName = profile.username;
      }
    } catch (e) {
      // Non-critical if profile fetch fails
    }

    // 3. Construct the reset action link
    // linkData.properties.action_link is the verified Supabase recovery link
    const resetUrl =
      linkData?.properties?.action_link ||
      `${origin}/auth/callback?token_hash=${linkData?.properties?.hashed_token}&type=recovery&next=/reset-password`;

    // 4. Render branded institutional email template
    const template = getPasswordResetEmail({
      name: userName,
      email: cleanEmail,
      resetUrl,
      expiresInMinutes: 60,
    });

    // 5. Send email via Resend
    const sendResult = await sendEmail({
      to: cleanEmail,
      subject: template.subject,
      html: template.html,
    });

    if (!sendResult.success) {
      console.error("[Forgot Password] Resend error:", sendResult.error);
      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to send reset email at this moment. Please check server configuration.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "A secure password reset link has been dispatched to your email address.",
    });
  } catch (err: any) {
    console.error("[Forgot Password] Unexpected exception:", err);
    return NextResponse.json(
      {
        success: false,
        error: err?.message || "An unexpected error occurred while processing your request.",
      },
      { status: 500 }
    );
  }
}
