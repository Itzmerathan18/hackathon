import { useLanguage } from "../context/LanguageContext.jsx";

const options = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "kn", label: "ಕನ್ನಡ" },
];

export default function LanguageSelector() {
  const { lang, setLang } = useLanguage();

  return (
    <select
      className="rounded-2xl border border-emerald-100 px-3 py-2 bg-white/80 text-sm"
      value={lang}
      onChange={(e) => setLang(e.target.value)}
    >
      {options.map((opt) => (
        <option key={opt.code} value={opt.code}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

