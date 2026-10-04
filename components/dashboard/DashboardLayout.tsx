"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard, Wallet, ArrowDownRight, ArrowUpRight,
  History, Users, User, ShieldCheck, Key, ShieldAlert,
  LogOut, TrendingUp, Menu, X, Bell, Globe, Sparkles
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import LanguageSelector from "@/components/common/LanguageSelector";
import { getActiveUser, exitImpersonation } from "@/lib/auth/activeUser";

interface DashboardLayoutProps {
  children: React.ReactNode;
  userEmail?: string;
}

export default function DashboardLayout({ children, userEmail: initialEmail }: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useLanguage();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isImpersonating, setIsImpersonating] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [userEmail, setUserEmail] = useState(initialEmail || "");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [notifications, setNotifications] = useState<any[]>([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      const supabase = createClient();
      const activeUser = await getActiveUser(supabase);
      if (activeUser) {
        setUserEmail(activeUser.email);
        setFullName(activeUser.full_name);
        setAvatarUrl(activeUser.avatar_url || "");
        setIsImpersonating(activeUser.isImpersonating);

        // Check if logged-in user is admin
        const adminUser = activeUser.adminUser;
        const metaRole = adminUser?.user_metadata?.role as string | undefined;
        if (metaRole === "admin") {
          setIsAdmin(true);
        } else {
          const { data: adminProfile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", adminUser.id)
            .single();
          if (adminProfile?.role === "admin") {
            setIsAdmin(true);
          }
        }

        const { data: notifs } = await supabase
          .from("notifications")
          .select("*")
          .eq("user_id", activeUser.id)
          .order("created_at", { ascending: false })
          .limit(10);

        if (notifs) {
          setNotifications(notifs);
          setUnreadCount(notifs.filter((n: any) => !n.is_read).length);
        }
      }
    };
    fetchUserData();
  }, [initialEmail]);

  const handleMarkNotificationsRead = async () => {
    setNotifOpen(!notifOpen);
    if (!notifOpen && unreadCount > 0) {
      setUnreadCount(0);
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("notifications").update({ is_read: true }).eq("user_id", user.id);
      }
    }
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  const navItems = [
    { label: t.dashboard.overview,         href: "/dashboard",              icon: LayoutDashboard },
    { label: t.dashboard.investments,      href: "/dashboard/investments",  icon: TrendingUp },
    { label: t.dashboard.depositFunds,     href: "/dashboard/deposit",      icon: ArrowDownRight },
    { label: t.dashboard.withdrawFunds,    href: "/dashboard/withdraw",     icon: ArrowUpRight },
    { label: t.dashboard.transactions,     href: "/dashboard/transactions", icon: History },
    { label: t.dashboard.referrals,        href: "/dashboard/referral",     icon: Users },
    { label: t.dashboard.accountSettings,  href: "/dashboard/profile",      icon: User },
    { label: t.dashboard.kycVerification,  href: "/dashboard/kyc",          icon: ShieldCheck },
    { label: t.dashboard.twoFactor,        href: "/dashboard/two-factor",   icon: Key },
  ];

  const userInitial = (fullName || userEmail || "U").charAt(0).toUpperCase();

  return (
    <div className="h-screen overflow-hidden bg-[#fafafa] flex flex-col md:flex-row">

      {/* ── Mobile Top Bar ── */}
      <div className="md:hidden bg-[#15182B] border-b border-[#232742] px-4 h-14 flex items-center justify-between flex-shrink-0 z-50 sticky top-0 text-white">
        <div className="flex items-center gap-2">
          <Link href="/" className="p-1.5 rounded-md border border-[#232742] text-slate-300 hover:text-white hover:bg-white/5 flex items-center gap-1 text-[11px] font-mono mr-1 transition-colors">
            <Globe className="w-3.5 h-3.5 text-[#E9B737]" />
            <span>Site</span>
          </Link>
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-[#0E101D] border border-[#232742] flex items-center justify-center">
              <Wallet className="w-3.5 h-3.5 text-[#E9B737]" />
            </div>
            <span className="text-[15px] font-bold tracking-tight text-white font-display uppercase">
              Pantera<span className="text-[#E9B737]">.</span>
            </span>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <LanguageSelector variant="compact" />
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-1.5 rounded-md border border-[#232742] text-slate-300 hover:bg-white/5 cursor-pointer"
          >
            {mobileOpen ? <X className="w-4.5 h-4.5" /> : <Menu className="w-4.5 h-4.5" />}
          </button>
        </div>
      </div>

      {/* ── Sidebar ── */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-[#E2E4EC] flex flex-col flex-shrink-0 transition-transform duration-200 md:static md:translate-x-0 md:h-screen
        ${mobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}
      `}>
        {/* Logo Header */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-[#E2E4EC] flex-shrink-0 bg-white">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-md bg-[#15182B] border border-[#232742] flex items-center justify-center shadow-xs text-[#E9B737] group-hover:scale-105 transition-transform">
              <Wallet className="w-4.5 h-4.5" />
            </div>
            <div>
              <div className="text-[15px] font-extrabold tracking-tight text-[#15182B] leading-none font-display uppercase">
                Pantera<span className="text-[#E9B737]">.</span>
              </div>
              <div className="text-[10px] text-slate-500 font-mono tracking-wide mt-1 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E9B737] inline-block animate-pulse" />
                {t.dashboard.investorWorkspace}
              </div>
            </div>
          </Link>
          <button onClick={() => setMobileOpen(false)} className="md:hidden p-1 text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2 font-mono">
            Navigation
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-md text-[13px] font-medium transition-all border-l-[3px] ${
                  isActive
                    ? "bg-[#15182B]/6 text-[#15182B] font-bold border-l-[#E9B737] shadow-xs"
                    : "text-slate-600 hover:bg-[#15182B]/4 hover:text-[#15182B] border-l-transparent"
                }`}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-[#15182B]" : "text-slate-400 group-hover:text-[#15182B]"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-[#E2E4EC] p-3 space-y-1.5 flex-shrink-0 bg-slate-50/50">
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-md text-[12px] font-semibold text-slate-700 bg-white border border-[#E2E4EC] hover:border-[#15182B] hover:text-[#15182B] transition-all shadow-xs font-mono"
          >
            <Globe className="w-3.5 h-3.5 text-[#15182B]" />
            <span>{t.nav.backToSite}</span>
          </Link>

          {isAdmin && (
            <Link
              href="/admin"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-md text-[12px] font-bold text-white bg-[#15182B] hover:bg-[#0E101D] transition-colors shadow-xs font-mono"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-[#E9B737]" />
              <span>{t.dashboard.adminPortal}</span>
            </Link>
          )}
          <div className="px-3 py-1.5">
            <div className="text-[13px] font-bold text-slate-900 truncate">{fullName || "Investor"}</div>
            <div className="text-[11px] text-slate-400 truncate font-mono">{userEmail}</div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-[12px] font-medium text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer font-mono"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{t.dashboard.signOut}</span>
          </button>
        </div>
      </aside>

      {/* ── Main Panel ── */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">

        {/* Desktop Header */}
        <header className="hidden md:flex items-center justify-between px-8 h-16 bg-white border-b border-[#E2E4EC] flex-shrink-0 z-40">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-[12px] font-semibold text-slate-500 hover:text-[#15182B] transition-colors font-mono"
            >
              <Globe className="w-3.5 h-3.5 text-[#15182B]" />
              <span>{t.nav.backToSite}</span>
            </Link>
            <span className="text-slate-300">/</span>
            <div className="flex items-center gap-1.5 text-[12px] font-bold text-[#15182B] bg-[#15182B]/5 px-2.5 py-1 rounded-md border border-[#15182B]/10 font-mono uppercase tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-[#E9B737]" />
              <span>{t.dashboard.investorWorkspace}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <LanguageSelector variant="default" />

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={handleMarkNotificationsRead}
                className="relative p-2 rounded-md text-slate-500 hover:text-[#15182B] hover:bg-[#15182B]/5 transition-colors cursor-pointer border border-[#E2E4EC]"
              >
                <Bell className="w-4.5 h-4.5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#E9B737] text-[#15182B] text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-[#E2E4EC] rounded-xl shadow-xl p-3 z-50 space-y-2">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 font-mono">
                    <span className="text-[13px] font-bold text-slate-900 uppercase">Notifications</span>
                    <span className="text-[11px] text-[#E9B737] hover:text-[#15182B] font-semibold cursor-pointer">Mark all read</span>
                  </div>
                  <div className="space-y-1.5 max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="text-[13px] text-slate-400 py-4 text-center font-mono">No notifications yet.</div>
                    ) : (
                      notifications.map((n: any) => (
                        <div key={n.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                          <div className="text-[13px] font-semibold text-slate-900">{n.title}</div>
                          <div className="text-[12px] text-slate-500 mt-0.5 leading-snug">{n.message}</div>
                          <div className="text-[10px] text-slate-400 mt-1 text-right font-mono">{new Date(n.created_at).toLocaleTimeString()}</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile */}
            <Link
              href="/dashboard/profile"
              className="flex items-center gap-2 pl-3 border-l border-slate-200 hover:opacity-85 transition-opacity"
            >
              {avatarUrl ? (
                <img src={avatarUrl} alt="Profile" className="w-8 h-8 rounded-full object-cover border border-[#E9B737]/40" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#15182B] text-[#E9B737] font-bold text-[12px] flex items-center justify-center shadow-xs font-mono">
                  {userInitial}
                </div>
              )}
              <div className="hidden lg:block text-left">
                <div className="text-[13px] font-bold text-slate-900 leading-none truncate max-w-[120px]">{fullName || "Investor"}</div>
                <div className="text-[11px] text-slate-400 mt-0.5 truncate max-w-[120px] font-mono">{userEmail}</div>
              </div>
            </Link>
          </div>
        </header>

        {isImpersonating && (
          <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2.5 sm:px-6 flex flex-wrap items-center justify-between gap-3 text-xs text-amber-900 flex-shrink-0 z-30">
            <div className="flex items-center gap-2 font-medium">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
              </span>
              <span>
                <strong>Admin Impersonation Mode:</strong> Viewing as <strong>{fullName || "Investor"}</strong> ({userEmail})
              </span>
            </div>
            <button
              type="button"
              onClick={exitImpersonation}
              className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-all cursor-pointer shadow-xs whitespace-nowrap"
            >
              Exit to Admin
            </button>
          </div>
        )}

        <main className="flex-1 min-w-0 overflow-y-auto p-5 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
