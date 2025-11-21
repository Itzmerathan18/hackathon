import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";
import { Sprout } from "lucide-react";

export default function AuthScreen() {
  const { login, signup } = useAuth();
  const { t } = useLanguage();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    try {
      if (mode === "login") {
        login({ email: form.email, password: form.password });
      } else {
        signup(form);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogle = () => {
    signup({ name: "Google User", email: "farmer@gmail.com", password: "oauth" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-amber-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 px-4">
      <div className="max-w-md w-full space-y-6 rounded-3xl border border-emerald-100 dark:border-slate-700 bg-white/95 dark:bg-slate-900/90 p-6 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-600 to-emerald-500 flex items-center justify-center text-white shadow-xl">
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <p className="text-lg font-bold text-emerald-950 dark:text-white">
              {t("brand")}
            </p>
            <p className="text-xs text-emerald-900/70 dark:text-slate-200">
              {t("auth.subtitle")}
            </p>
          </div>
        </div>
        <div className="flex gap-2 text-sm">
          <button
            className={`flex-1 rounded-2xl py-2 font-semibold ${
              mode === "login"
                ? "bg-gradient-to-r from-green-600 to-emerald-500 text-white"
                : "border border-emerald-100 dark:border-slate-700 text-emerald-900 dark:text-slate-100"
            }`}
            onClick={() => setMode("login")}
          >
            {t("auth.login")}
          </button>
          <button
            className={`flex-1 rounded-2xl py-2 font-semibold ${
              mode === "signup"
                ? "bg-gradient-to-r from-green-600 to-emerald-500 text-white"
                : "border border-emerald-100 dark:border-slate-700 text-emerald-900 dark:text-slate-100"
            }`}
            onClick={() => setMode("signup")}
          >
            {t("auth.signup")}
          </button>
        </div>
        <button
          type="button"
          onClick={handleGoogle}
          className="w-full rounded-2xl border border-emerald-100 dark:border-slate-600 py-2 font-semibold text-emerald-900 dark:text-white"
        >
          {t("auth.google")}
        </button>
        <form className="space-y-3" onSubmit={handleSubmit}>
          {mode === "signup" && (
            <>
              <div className="space-y-1">
                <label className="text-sm text-emerald-900 dark:text-slate-200">
                  {t("auth.name")}
                </label>
                <input
                  className="w-full rounded-2xl border border-emerald-100 dark:border-slate-700 px-4 py-3 bg-white dark:bg-slate-800 text-emerald-950 dark:text-white"
                  value={form.name}
                  onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm text-emerald-900 dark:text-slate-200">
                  {t("auth.phone")}
                </label>
                <div className="flex gap-2">
                  <input
                    className="flex-1 rounded-2xl border border-emerald-100 dark:border-slate-700 px-4 py-3 bg-white dark:bg-slate-800 text-emerald-950 dark:text-white"
                    value={form.phone}
                    onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                  />
                  <button type="button" className="rounded-2xl border border-emerald-200 px-3 text-sm">
                    {t("auth.otp")}
                  </button>
                </div>
              </div>
            </>
          )}
          <div className="space-y-1">
            <label className="text-sm text-emerald-900 dark:text-slate-200">
              {t("auth.email")}
            </label>
            <input
              type="email"
              className="w-full rounded-2xl border border-emerald-100 dark:border-slate-700 px-4 py-3 bg-white dark:bg-slate-800 text-emerald-950 dark:text-white"
              value={form.email}
              onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm text-emerald-900 dark:text-slate-200">
              {t("auth.password")}
            </label>
            <input
              type="password"
              className="w-full rounded-2xl border border-emerald-100 dark:border-slate-700 px-4 py-3 bg-white dark:bg-slate-800 text-emerald-950 dark:text-white"
              value={form.password}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, password: e.target.value }))
              }
              required
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            className="w-full rounded-2xl bg-gradient-to-r from-green-600 to-emerald-500 text-white font-semibold py-3"
          >
            {mode === "login" ? t("auth.login") : t("auth.signup")}
          </button>
        </form>
      </div>
    </div>
  );
}

