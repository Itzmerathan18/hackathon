import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { detectDisease } from "../services/mockApi.js";
import { ShieldCheck, UploadCloud, Loader2, Image as ImageIcon } from "lucide-react";
import { useLanguage } from "../context/LanguageContext.jsx";

export default function DiseaseDetectorView() {
  const { t } = useLanguage();
  const [notes, setNotes] = useState("");
  const [crop, setCrop] = useState("Areca");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const mutation = useMutation({ mutationFn: detectDisease });

  const handleAnalyze = (event) => {
    event.preventDefault();
    mutation.mutate({
      description: notes,
      imageMeta: {
        fileName: file?.name || "",
        crop,
      },
    });
  };

  const handleFileChange = (event) => {
    const selected = event.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm uppercase tracking-[0.3em] text-emerald-800/60">Vision AI</p>
        <h1 className="text-3xl font-bold text-emerald-950">{t("nav.disease")}</h1>
        <p className="text-emerald-900/70 max-w-3xl">
          Fine-tuned EfficientNet + ViT models (trained on Areca, Tomato, Banana datasets) run leaf segmentation, Grad-CAM explainers, and nutrient stress inference before prescribing treatments.
        </p>
      </header>

      <form className="rounded-3xl border border-emerald-100 bg-white/90 p-6 shadow-sm space-y-4" onSubmit={handleAnalyze}>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-emerald-900">Crop</label>
            <select
              className="rounded-2xl border border-emerald-100 px-3 py-3"
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
            >
              <option>Areca</option>
              <option>Tomato</option>
              <option>Banana</option>
              <option>Black Pepper</option>
              <option>Ginger</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-emerald-900 flex items-center gap-2">
              <UploadCloud className="w-4 h-4 text-emerald-700" />
              Leaf Image Upload
            </label>
            <label className="border border-dashed border-emerald-200 rounded-2xl px-4 py-6 flex flex-col items-center justify-center gap-2 cursor-pointer text-sm text-emerald-900/70">
              <ImageIcon className="w-6 h-6 text-emerald-700" />
              <span>{file ? file.name : "Drop or click to upload"}</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            </label>
          </div>
        </div>
        {preview && <img src={preview} alt="Leaf preview" className="w-full max-h-64 object-cover rounded-2xl border border-emerald-100" />}
        <label className="text-sm font-semibold text-emerald-900">
          Observations / Notes
        </label>
        <textarea
          className="w-full rounded-2xl border border-emerald-100 px-4 py-3 min-h-[150px]"
          placeholder="Dark circular spots with yellow halos, mild wilting, uneven color…"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          required
        />
        <button
          className="rounded-2xl bg-gradient-to-r from-green-600 to-emerald-500 text-white font-semibold py-4 flex items-center justify-center gap-2"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Running Vision Pipeline
            </>
          ) : (
            <>
              <ShieldCheck className="w-5 h-5" />
              Diagnose Leaf
            </>
          )}
        </button>
      </form>

      {mutation.error && (
        <p className="text-sm text-red-600">{mutation.error.message}</p>
      )}

      {mutation.data && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="rounded-3xl border border-emerald-100 bg-white/90 p-6 space-y-2">
            <p className="text-xs uppercase tracking-[0.3em] text-emerald-800/50">Diagnosis</p>
            <h2 className="text-2xl font-bold text-emerald-950">{mutation.data.disease_name}</h2>
            <p className="text-sm text-emerald-900/70">
              Cause: {mutation.data.cause_type} • Stage: {mutation.data.infection_stage} • Severity: {mutation.data.severity}
            </p>
            <p className="text-xs text-emerald-900/50">
              Dataset ID: {mutation.data.dataset_id} • Precision: {(mutation.data.accuracy * 100).toFixed(1)}%
            </p>
            <p className="text-xs text-emerald-900/70">
              {mutation.data.confidenceNarrative}
            </p>
            <div className="space-y-2 mt-4">
              <p className="font-semibold text-emerald-900">Visual Features</p>
              <ul className="list-disc pl-5 text-sm text-emerald-900/80">
                {mutation.data.visual_features_observed.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="rounded-3xl border border-emerald-100 bg-white/90 p-6 space-y-2">
            <p className="font-semibold text-emerald-900">Treatment Plan</p>
            {mutation.data.treatment_plan.map((step, index) => (
              <div key={index} className="rounded-2xl border border-emerald-100 p-3">
                <p className="font-semibold text-emerald-950">{step.action}</p>
                <p className="text-sm text-emerald-900/80">{step.timing} — {step.dosage}</p>
              </div>
            ))}
          </div>
          <div className="rounded-3xl border border-emerald-100 bg-white/90 p-6">
            <p className="font-semibold text-emerald-900">Vision Pipeline (AI + ML Layer)</p>
            <ol className="list-decimal pl-5 text-sm text-emerald-900/80 space-y-1">
              {mutation.data.image_processing_steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>
          <div className="rounded-3xl border border-emerald-100 bg-white/90 p-6 space-y-2">
            <p className="font-semibold text-emerald-900">Nutrient & Pest Insights</p>
            <p className="text-sm text-emerald-900/80">
              Nutrient alerts: {mutation.data.nutrient_deficiencies.join(", ")}
            </p>
            <p className="text-sm text-emerald-900/80">
              Predicted nutrient efficiency issues: {mutation.data.nutrient_deficiency_prediction?.join(", ") || "None"}
            </p>
            <p className="text-sm text-emerald-900/80">
              Pest indicators: {mutation.data.pest_indicators.join(", ")}
            </p>
            <p className="text-sm text-emerald-900/80">
              Recovery in {mutation.data.recovery_time} • Spread Risk: {mutation.data.spread_risk}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

