import { useState } from "react";
import {
  Sprout,
  LayoutDashboard,
  Waves,
  FlaskConical,
  History,
  Brain,
  ShieldCheck,
  Calculator,
  MessageCircle,
  Info,
  Menu,
  CloudSun,
} from "lucide-react";
import clsx from "clsx";
import ThemeToggle from "./ThemeToggle.jsx";
import LanguageSelector from "./LanguageSelector.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";
import AuthModal from "./AuthModal.jsx";

const primaryNav = [
  { id: "dashboard", labelKey: "nav.dashboard", icon: LayoutDashboard },
  { id: "sensors", labelKey: "nav.sensors", icon: Waves },
  { id: "analysis", labelKey: "nav.analysis", icon: FlaskConical },
  { id: "history", labelKey: "nav.history", icon: History },
  { id: "weather", labelKey: "nav.weather", icon: CloudSun },
];

const aiNav = [
  { id: "smarttools", labelKey: "nav.smarttools", icon: Calculator },
  { id: "yield", labelKey: "nav.yield", icon: Brain },
  { id: "disease", labelKey: "nav.disease", icon: ShieldCheck },
  { id: "chat", labelKey: "nav.chat", icon: MessageCircle },
  { id: "about", labelKey: "nav.about", icon: Info },
];

export default function Layout({ activeView, onNavigate, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const { user, logout } = useAuth();
  const { t } = useLanguage();

  const NavSection = ({ title, items }) => (
    <div className="space-y-1">
      <p className="text-xs uppercase tracking-widest text-emerald-900/70 px-5">
        {title}
      </p>
      {items.map((item) => {
        const Icon = item.icon;
        const active = activeView === item.id;
        return (
          <button
            key={item.id}
            onClick={() => {
              onNavigate(item.id);
              setSidebarOpen(false);
            }}
            className={clsx(
              "w-full flex items-center gap-3 rounded-xl px-5 py-3 text-left font-medium transition-all",
              active
                ? "bg-green-100 text-green-900 shadow"
                : "text-emerald-900/80 hover:bg-emerald-50"
            )}
          >
            <Icon className="w-5 h-5" />
            {t(item.labelKey)}
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-green-50 to-emerald-50 text-emerald-950 dark:bg-slate-900">
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white/80 backdrop-blur border-b border-green-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-green-600 to-emerald-500 flex items-center justify-center text-white shadow">
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <p className="font-semibold text-lg">{t("brand")}</p>
            <p className="text-xs text-emerald-900/70">{t("slogan")}</p>
          </div>
        </div>
        <button
          className="p-2 rounded-xl bg-emerald-50 text-emerald-900"
          onClick={() => setSidebarOpen((prev) => !prev)}
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      <div className="flex">
        <aside
          className={clsx(
            "w-72 bg-white/80 backdrop-blur border-r border-green-100 hidden md:flex flex-col py-8 gap-8",
            sidebarOpen ? "flex fixed inset-y-0 z-20" : "md:flex"
          )}
        >
          <div className="flex items-center gap-4 px-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-600 to-emerald-500 flex items-center justify-center text-white shadow-xl">
              <Sprout className="w-7 h-7" />
            </div>
            <div>
              <p className="text-xl font-bold leading-none">{t("brand")}</p>
              <p className="text-xs text-emerald-900/70">{t("slogan")}</p>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto space-y-8 px-4">
            {user ? (
              <>
                <NavSection title={t("navSections.core")} items={primaryNav} />
                <NavSection title={t("navSections.ai")} items={aiNav} />
              </>
            ) : (
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4 text-sm text-emerald-900">
                {t("auth.subtitle")}
              </div>
            )}
          </nav>

          <div className="px-5 space-y-3">
            <div className="rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50 p-4 border border-green-100 text-sm text-emerald-900">
              <p className="font-semibold mb-1">🚀 ML-Powered Platform</p>
              <p>Digital twin for soil + crop + weather + nutrient decisions.</p>
            </div>
            <div className="flex items-center justify-between gap-2">
              <LanguageSelector />
              <ThemeToggle />
            </div>
            {user ? (
              <button
                className="w-full rounded-2xl border border-emerald-200 py-2 font-semibold text-emerald-900"
                onClick={logout}
              >
                Logout ({user.name})
              </button>
            ) : (
              <button
                className="w-full rounded-2xl bg-gradient-to-r from-green-600 to-emerald-500 text-white py-2 font-semibold"
                onClick={() => setAuthOpen(true)}
              >
                {t("auth.login")}
              </button>
            )}
          </div>
        </aside>

        <main className="flex-1 min-h-screen">{children}</main>
      </div>
    </div>
  );
}

