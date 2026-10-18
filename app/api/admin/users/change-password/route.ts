import { NextResponse } from "next/server";
import { getAdminSupabase } from "@/lib/supabase/admin";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email/resend";
import { getAdminAssistedPasswordResetEmail } from "@/lib/email/templates";

export async function POST(req: Request) {
  try {
    // 1. Verify caller has admin privileges if session exists
    const serverSupabase = await createServerClient();
    const {
      data: { user: callerUser },
    } = await serverSupabase.auth.getUser();

    const supabaseAdmin = getAdminSupabase();

    if (callerUser) {
      const { data: callerProfile } = await supabaseAdmin
        .from("profiles")
        .select("role")
        .eq("id", callerUser.id)
        .maybeSingle();

      const isAdmin =
        callerUser.user_metadata?.role === "admin" ||
        callerProfile?.role === "admin";

      if (!isAdmin) {
        return NextResponse.json(
          { success: false, error: "Access denied. Administrator privileges required." },
          { status: 403 }
        );
      }
    }

    const body = await req.json();
    const {
      userId,
      action = "set_password",
      newPassword,
      sendEmailNotification = true,
      sendInAppNotification = true,
      adminNote = "",
    } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Missing required parameter: userId." },
        { status: 400 }
      );
    }

    // 2. Fetch the target user profile from profiles table
    const { data: targetProfile, error: profileErr } = await supabaseAdmin
      .from("profiles")
      .select("id, email, full_name, username")
      .eq("id", userId)
      .maybeSingle();

    if (profileErr || !targetProfile) {
      return NextResponse.json(
        { success: false, error: "Target user profile not found." },
        { status: 404 }
      );
    }

    const userEmail = targetProfile.email?.trim().toLowerCase();
    const userName =
      targetProfile.full_name || targetProfile.username || "Investor";

    const origin =
      req.headers.get("origin") ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      "https://pantera.cfd";

    // ── Action: Generate Password Reset Recovery Link ──
    if (action === "generate_reset_link") {
      if (!userEmail) {
        return NextResponse.json(
          { success: false, error: "Target user does not have a registered email address." },
          { status: 400 }
        );
      }

      const redirectTo = `${origin}/reset-password`;
      const { data: linkData, error: linkErr } =
        await supabaseAdmin.auth.admin.generateLink({
          type: "recovery",
          email: userEmail,
          options: {
            redirectTo,
          },
        });

      if (linkErr) {
        return NextResponse.json(
          { success: false, error: linkErr.message || "Failed to generate recovery link." },
          { status: 400 }
        );
      }

      const resetUrl =
        linkData?.properties?.action_link ||
        `${origin}/reset-password#token=${linkData?.properties?.hashed_token}`;

      return NextResponse.json({
        success: true,
        resetUrl,
        message: "Password recovery link successfully generated.",
      });
    }

    // ── Action: Directly Set New Password ──
    if (action === "set_password") {
      if (!newPassword || newPassword.length < 6) {
        return NextResponse.json(
          {
            success: false,
            error: "Password must be at least 6 characters in length.",
          },
          { status: 400 }
        );
      }

      // Update password directly using Supabase Auth Admin API
      const { error: updateErr } =
        await supabaseAdmin.auth.admin.updateUserById(userId, {
          password: newPassword,
        });

      if (updateErr) {
        return NextResponse.json(
          {
            success: false,
            error: updateErr.message || "Failed to update user password in Supabase Auth.",
          },
          { status: 400 }
        );
      }

      // 3. Create In-App Notification if enabled
      if (sendInAppNotification) {
        try {
          await supabaseAdmin.from("notifications").insert({
            user_id: userId,
            title: "Account Password Updated by Support",
            message:
              adminNote.trim() ||
              "Your account password was updated by system administration. Please ensure you update your password after logging in.",
            type: "warning",
            link: "/dashboard/profile",
            is_read: false,
          });
        } catch (notifErr) {
          console.warn("[Admin Change Password] In-app notification warning:", notifErr);
        }
      }

      // 4. Send Email Notification if enabled
      let emailDispatched = false;
      let emailError: string | null = null;

      if (sendEmailNotification && userEmail) {
        try {
          const emailTemplate = getAdminAssistedPasswordResetEmail({
            name: userName,
            email: userEmail,
            newPassword: newPassword,
            adminNote: adminNote.trim() || undefined,
            loginUrl: `${origin}/login`,
          });

          const sendResult = await sendEmail({
            to: userEmail,
            subject: emailTemplate.subject,
            html: emailTemplate.html,
          });

          if (sendResult.success) {
            emailDispatched = true;
          } else {
            emailError = sendResult.error || "Email delivery failed";
          }
        } catch (err: any) {
          console.warn("[Admin Change Password] Email dispatch warning:", err);
          emailError = err?.message || "Failed to deliver email";
        }
      }

      return NextResponse.json({
        success: true,
        message: `Password for ${userEmail || userName} has been successfully updated.`,
        emailDispatched,
        emailError,
      });
    }

    return NextResponse.json(
      { success: false, error: `Invalid action specified: ${action}` },
      { status: 400 }
    );
  } catch (err: any) {
    console.error("[Admin Change Password] Exception:", err);
    return NextResponse.json(
      {
        success: false,
        error: err?.message || "Internal server error occurred while updating password.",
      },
      { status: 500 }
    );
  }
}
