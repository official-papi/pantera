import { NextResponse } from "next/server";
import { getAdminSupabase } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/email/resend";
import { getResendVerificationEmail } from "@/lib/email/templates";

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

    const redirectTo = `${origin}/auth/callback?next=/dashboard`;
    const supabaseAdmin = getAdminSupabase();

    // 1. Generate verification link via Supabase Admin SDK
    const { data: linkData, error: linkError } =
      await supabaseAdmin.auth.admin.generateLink({
        type: "magiclink",
        email: cleanEmail,
        options: {
          redirectTo,
        },
      });

    if (linkError) {
      console.warn("[Resend Verification] Supabase generateLink warning:", linkError.message);
      return NextResponse.json({
        success: true,
        message: "If an account exists with this email address, a verification link has been sent.",
      });
    }

    // 2. Fetch user's full name if stored
    let userName = "Investor";
    try {
      const { data: profile } = await supabaseAdmin
        .from("profiles")
        .select("full_name, username")
        .eq("email", cleanEmail)
        .maybeSingle();

      if (profile?.full_name) userName = profile.full_name;
      else if (profile?.username) userName = profile.username;
    } catch (e) {
      // Ignore profile lookup error
    }

    const verifyUrl =
      linkData?.properties?.action_link ||
      `${origin}/auth/callback?token_hash=${linkData?.properties?.hashed_token}&type=signup&next=/dashboard`;

    // 3. Render template
    const template = getResendVerificationEmail({
      name: userName,
      email: cleanEmail,
      verifyUrl,
    });

    // 4. Send email via Resend
    const sendResult = await sendEmail({
      to: cleanEmail,
      subject: template.subject,
      html: template.html,
    });

    if (!sendResult.success) {
      return NextResponse.json(
        { success: false, error: "Failed to dispatch verification email." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Verification email has been resent successfully.",
    });
  } catch (err: any) {
    console.error("[Resend Verification] Error:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to process request." },
      { status: 500 }
    );
  }
}
