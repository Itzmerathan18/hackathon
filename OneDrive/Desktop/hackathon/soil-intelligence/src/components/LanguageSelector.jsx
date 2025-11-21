import { useLanguage } from "../context/LanguageContext.jsx";

const options = [
  { code: "en" },
  { code: "hi" },
  { code: "kn" },
];

export default function LanguageSelector() {
  const { lang, setLang, t } = useLanguage();

  return (
    <select
      className="rounded-2xl border border-emerald-100 px-3 py-2 bg-white/80 text-sm"
      value={lang}
      onChange={(e) => setLang(e.target.value)}
    >
      {options.map((opt) => (
        <option key={opt.code} value={opt.code}>
          {t(`languages.${opt.code}`) || opt.code}
        </option>
      ))}
    </select>
  );
}

