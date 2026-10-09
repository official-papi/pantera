import { NextResponse } from "next/server";
import { getAdminSupabase } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/email/resend";
import { getBroadcastEmailTemplate } from "@/lib/email/templates";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      targetAudience = "all",
      singleEmail,
      subject,
      message,
      ctaText,
      ctaUrl,
      sendInAppNotification = true,
    } = body;

    if (!subject || !message) {
      return NextResponse.json(
        { error: "Subject and message are required." },
        { status: 400 }
      );
    }

    const supabase = getAdminSupabase();

    type Recipient = { id?: string; email: string; name?: string };
    let recipients: Recipient[] = [];

    if (targetAudience === "single_user") {
      const cleanEmail = (singleEmail || "").trim().toLowerCase();
      if (!cleanEmail || !cleanEmail.includes("@")) {
        return NextResponse.json(
          { error: "Please enter a valid recipient email address." },
          { status: 400 }
        );
      }

      // Try to find matching user profile for name & notification insertion
      const { data: userProfile } = await supabase
        .from("profiles")
        .select("id, email, full_name")
        .eq("email", cleanEmail)
        .maybeSingle();

      recipients = [
        {
          id: userProfile?.id,
          email: cleanEmail,
          name: userProfile?.full_name || cleanEmail.split("@")[0],
        },
      ];
    } else if (targetAudience === "kyc_approved") {
      const { data: users, error } = await supabase
        .from("profiles")
        .select("id, email, full_name")
        .eq("is_kyc_verified", true)
        .not("email", "is", null);

      if (error) throw error;
      recipients = (users || []).map((u: any) => ({
        id: u.id,
        email: u.email,
        name: u.full_name,
      }));
    } else if (targetAudience === "active_investors") {
      // Find user ids with approved deposits or active investments
      const [depositsRes, investRes] = await Promise.all([
        supabase.from("deposits").select("user_id").eq("status", "approved"),
        supabase.from("investments").select("user_id").eq("status", "active"),
      ]);

      const userIds = new Set<string>();
      (depositsRes.data || []).forEach((d: any) => d.user_id && userIds.add(d.user_id));
      (investRes.data || []).forEach((i: any) => i.user_id && userIds.add(i.user_id));

      if (userIds.size === 0) {
        return NextResponse.json(
          { error: "No active investors found matching deposit or investment criteria." },
          { status: 404 }
        );
      }

      const { data: users, error } = await supabase
        .from("profiles")
        .select("id, email, full_name")
        .in("id", Array.from(userIds))
        .not("email", "is", null);

      if (error) throw error;
      recipients = (users || []).map((u: any) => ({
        id: u.id,
        email: u.email,
        name: u.full_name,
      }));
    } else {
      // Default: "all" registered profiles
      const { data: users, error } = await supabase
        .from("profiles")
        .select("id, email, full_name")
        .not("email", "is", null);

      if (error) throw error;
      recipients = (users || []).map((u: any) => ({
        id: u.id,
        email: u.email,
        name: u.full_name,
      }));
    }

    // Filter out invalid/empty emails and deduplicate
    const emailMap = new Map<string, Recipient>();
    for (const r of recipients) {
      const em = (r.email || "").trim().toLowerCase();
      if (em && em.includes("@") && !emailMap.has(em)) {
        emailMap.set(em, { ...r, email: em });
      }
    }
    const finalRecipients = Array.from(emailMap.values());

    if (finalRecipients.length === 0) {
      return NextResponse.json(
        { error: "No eligible recipients found for this audience." },
        { status: 404 }
      );
    }

    let successCount = 0;
    let failCount = 0;
    const errors: string[] = [];

    // Dispatch emails in parallel batches of 5 to avoid rate limits
    const BATCH_SIZE = 5;
    for (let i = 0; i < finalRecipients.length; i += BATCH_SIZE) {
      const batch = finalRecipients.slice(i, i + BATCH_SIZE);
      await Promise.all(
        batch.map(async (recipient) => {
          try {
            const template = getBroadcastEmailTemplate({
              subject,
              message,
              name: recipient.name,
              ctaText: ctaText?.trim() || undefined,
              ctaUrl: ctaUrl?.trim() || undefined,
            });

            const sendRes = await sendEmail({
              to: recipient.email,
              subject: template.subject,
              html: template.html,
            });

            if (sendRes.success) {
              successCount++;
            } else {
              failCount++;
              errors.push(`${recipient.email}: ${sendRes.error}`);
            }

            // Also insert in-app notification if user ID exists and option is enabled
            if (sendInAppNotification && recipient.id) {
              await supabase.from("notifications").insert({
                user_id: recipient.id,
                title: subject,
                message: message.replace(/<[^>]*>/g, " ").slice(0, 300),
                type: "info",
                is_read: false,
              });
            }
          } catch (err: any) {
            failCount++;
            errors.push(`${recipient.email}: ${err?.message || "Unknown error"}`);
          }
        })
      );
    }

    return NextResponse.json({
      success: true,
      sentCount: successCount,
      failedCount: failCount,
      totalRecipients: finalRecipients.length,
      errors: errors.slice(0, 10), // return top errors if any
    });
  } catch (error: any) {
    console.error("[Broadcast API Error]:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error while dispatching broadcast." },
      { status: 500 }
    );
  }
}
