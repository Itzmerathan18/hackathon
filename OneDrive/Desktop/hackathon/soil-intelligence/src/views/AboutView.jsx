import { useLanguage } from "../context/LanguageContext.jsx";
import { Phone, Mail } from "lucide-react";

const creators = [
  { name: "Anushree M", role: "AI Engineer & Agronomy Lead" },
  { name: "Rathan A S", role: "IoT & Sensor Integrations" },
  { name: "Nikitha Poojari", role: "UX Research & Farmer Success" },
  { name: "Chetan Kumar N K", role: "Data Scientist & ML Ops" },
];

// Update these contact values as needed
const CONTACT = {
  phone: "+91-7760518409",
  email: "agreesense@gmail.com",
};

export default function AboutView() {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm uppercase tracking-[0.3em] text-emerald-800/60">
          {t("about.title")}
        </p>
        <h1 className="text-3xl font-bold text-emerald-950 dark:text-white">
          {t("about.subtitle")}
        </h1>
        <p className="text-emerald-900/70 dark:text-slate-200 max-w-3xl">
          We are committed to combining real-world agronomy, IoT sensors, and explainable AI
          to empower farmers with actionable soil intelligence.
        </p>
      </header>
      <div className="grid md:grid-cols-2 gap-4">
        {creators.map((creator) => (
          <div
            key={creator.name}
            className="rounded-3xl border border-emerald-100 dark:border-slate-700 bg-white/90 dark:bg-slate-800/80 p-5 shadow-sm"
          >
            <p className="text-xl font-semibold text-emerald-950 dark:text-white">
              {creator.name}
            </p>
            <p className="text-sm text-emerald-900/70 dark:text-slate-200">
              {creator.role}
            </p>
          </div>
        ))}
      </div>
      <div className="rounded-2xl border border-emerald-100 bg-white/90 p-4 shadow-sm flex items-center gap-6">
        <div className="flex items-center gap-3">
          <Phone className="w-5 h-5 text-emerald-600" />
          <div>
            <p className="text-xs text-emerald-800/70">Mobile</p>
            <p className="font-semibold text-emerald-950">{CONTACT.phone}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Mail className="w-5 h-5 text-emerald-600" />
          <div>
            <p className="text-xs text-emerald-800/70">Email</p>
            <p className="font-semibold text-emerald-950">{CONTACT.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

