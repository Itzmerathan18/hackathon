import { useState } from "react";
import { X } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";

export default function AuthModal({ open, onClose }) {
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

  if (!open) return null;

  const handleSubmit = (event) => {
    event.preventDefault();
    try {
      if (mode === "login") {
        login({ email: form.email, password: form.password });
      } else {
        signup(form);
      }
      setError("");
      onClose();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-emerald-800/60">
              {mode === "login" ? t("auth.welcome") : t("auth.signup")}
            </p>
            <h3 className="text-2xl font-bold text-emerald-950">
              {mode === "login" ? t("auth.login") : t("auth.signup")}
            </h3>
          </div>
          <button
            className="p-2 rounded-full hover:bg-emerald-50"
            onClick={onClose}
            aria-label="Close auth modal"
          >
            <X className="w-5 h-5 text-emerald-900" />
          </button>
        </div>
        <button
          type="button"
          className="w-full rounded-2xl border border-emerald-100 py-2 font-semibold text-emerald-900"
          onClick={() => {
            signup({ name: "Google User", email: "farmer@gmail.com", password: "oauth" });
            onClose();
          }}
        >
          {t("auth.google")}
        </button>
        <form className="space-y-3" onSubmit={handleSubmit}>
          {mode === "signup" && (
            <>
              <div className="space-y-1">
                <label className="text-sm font-medium text-emerald-900">
                  {t("auth.name")}
                </label>
                <input
                  className="w-full rounded-2xl border border-emerald-100 px-4 py-3"
                  value={form.name}
                  onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-emerald-900">
                  {t("auth.phone")}
                </label>
                <input
                  className="w-full rounded-2xl border border-emerald-100 px-4 py-3"
                  value={form.phone}
                  onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                />
              </div>
            </>
          )}
          <div className="space-y-1">
            <label className="text-sm font-medium text-emerald-900">
              {t("auth.email")}
            </label>
            <input
              type="email"
              className="w-full rounded-2xl border border-emerald-100 px-4 py-3"
              value={form.email}
              onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-emerald-900">
              {t("auth.password")}
            </label>
            <input
              type="password"
              className="w-full rounded-2xl border border-emerald-100 px-4 py-3"
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
        <p className="text-sm text-emerald-900/70">
          {mode === "login" ? "New here?" : "Already registered?"}{" "}
          <button
            className="font-semibold text-emerald-700"
            onClick={() => setMode((prev) => (prev === "login" ? "signup" : "login"))}
          >
            {mode === "login" ? t("auth.signup") : t("auth.login")}
          </button>
        </p>
      </div>
    </div>
  );
}

