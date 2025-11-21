import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  analyzeSoil,
  createSoilTest,
  fetchSensorReadings,
  fetchSoilTests,
} from "../services/mockApi.js";
import {
  Activity,
  Sparkles,
  Loader2,
  Save,
  CheckCircle,
  AlertTriangle,
  Leaf,
  Calendar,
} from "lucide-react";
import VoiceInputButton from "../components/VoiceInputButton.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";

const nutrientFields = [
  { key: "nitrogen", label: "Nitrogen (mg/kg)", type: "number", step: "1" },
  { key: "phosphorus", label: "Phosphorus (mg/kg)", type: "number", step: "1" },
  { key: "potassium", label: "Potassium (mg/kg)", type: "number", step: "1" },
  { key: "calcium", label: "Calcium (%)", type: "number", step: "0.1" },
  { key: "magnesium", label: "Magnesium (%)", type: "number", step: "0.01" },
  { key: "sulfur", label: "Sulfur (mg/kg)", type: "number", step: "1" },
  { key: "zinc", label: "Zinc (mg/kg)", type: "number", step: "0.01" },
  { key: "iron", label: "Iron (mg/kg)", type: "number", step: "0.1" },
  { key: "manganese", label: "Manganese (mg/kg)", type: "number", step: "0.1" },
  { key: "copper", label: "Copper (mg/kg)", type: "number", step: "0.01" },
  { key: "boron", label: "Boron (mg/kg)", type: "number", step: "0.01" },
  { key: "molybdenum", label: "Molybdenum (mg/kg)", type: "number", step: "0.01" },
];

export default function NewAnalysisView() {
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const { data: sensors = [] } = useQuery({
    queryKey: ["sensorReadings"],
    queryFn: fetchSensorReadings,
  });
  useQuery({ queryKey: ["soilTests"], queryFn: fetchSoilTests });

  const [useManual, setUseManual] = useState(false);
  const [selectedSensor, setSelectedSensor] = useState("");
  const [formData, setFormData] = useState({
    test_name: "",
    test_date: new Date().toISOString().split("T")[0],
    location: "",
    soil_type: "",
    current_crop: "",
    moisture: "",
    ph: "",
  });
  const [analysis, setAnalysis] = useState(null);

  const analysisMutation = useMutation({
    mutationFn: analyzeSoil,
    onSuccess: (result) => setAnalysis(result),
  });

  const saveMutation = useMutation({
    mutationFn: createSoilTest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["soilTests"] });
      setAnalysis(null);
      setFormData({
        test_name: "",
        test_date: new Date().toISOString().split("T")[0],
        location: "",
        soil_type: "",
        current_crop: "",
        moisture: "",
        ph: "",
      });
    },
  });

  const latestReadings = useMemo(() => {
    const map = new Map();
    sensors.forEach((reading) => {
      if (!map.has(reading.sensor_id)) {
        map.set(reading.sensor_id, reading);
      }
    });
    return Array.from(map.values());
  }, [sensors]);

  const populateFromSensor = (sensorId) => {
    const reading = latestReadings.find((item) => item.sensor_id === sensorId);
    if (!reading) return;
    setFormData((prev) => ({
      ...prev,
      test_name: `${sensorId} Soil Snapshot`,
      location: reading.location,
      soil_type: "loamy",
      current_crop: prev.current_crop,
      moisture: reading.moisture,
      ph: reading.ph,
      nitrogen: reading.nitrogen,
      phosphorus: reading.phosphorus,
      potassium: reading.potassium,
    }));
  };

  const handleAnalyze = (event) => {
    event.preventDefault();
    const cleansed = Object.fromEntries(
      Object.entries(formData).filter(([, value]) => value !== "" && value !== undefined)
    );
    analysisMutation.mutate(cleansed);
  };

  const handleSave = () => {
    if (!analysis) return;
    saveMutation.mutate(formData);
  };

  const handleDiscard = () => {
    setAnalysis(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-emerald-800/60">
            {t("nav.analysis")}
          </p>
          <h1 className="text-3xl font-bold text-emerald-950">{t("nav.analysis")}</h1>
          <p className="text-emerald-900/70 mt-2">
            AI engine interprets 12 nutrients + pH + moisture from your sensors or lab uploads.
          </p>
        </div>
        <div className="rounded-2xl border border-emerald-100 bg-white/90 px-4 py-3 text-sm text-emerald-900 flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-600" />
          Context-aware ML recommendations
        </div>
      </div>

      {!analysis && (
        <div className="rounded-3xl border border-emerald-100 bg-white/90 p-6 shadow-sm space-y-6">
          <div className="flex gap-4">
            <button
              type="button"
              className={`flex-1 rounded-2xl px-4 py-3 font-semibold border ${!useManual ? "bg-gradient-to-r from-green-600 to-emerald-500 text-white" : "border-emerald-100"}`}
              onClick={() => setUseManual(false)}
            >
              IoT Sensor Import
            </button>
            <button
              type="button"
              className={`flex-1 rounded-2xl px-4 py-3 font-semibold border ${useManual ? "bg-gradient-to-r from-green-600 to-emerald-500 text-white" : "border-emerald-100"}`}
              onClick={() => setUseManual(true)}
            >
              Manual Entry
            </button>
          </div>

          {!useManual && (
            <div className="space-y-3">
              <label className="text-sm font-semibold text-emerald-900">Select Sensor</label>
              <select
                className="w-full rounded-2xl border border-emerald-100 px-4 py-3 bg-white"
                value={selectedSensor}
                onChange={(event) => {
                  setSelectedSensor(event.target.value);
                  populateFromSensor(event.target.value);
                }}
              >
                <option value="">Choose live sensor</option>
                {latestReadings.map((reading) => (
                  <option key={reading.id} value={reading.sensor_id}>
                    {reading.sensor_id} — {reading.location} (Moisture {reading.moisture}%)
                  </option>
                ))}
              </select>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleAnalyze}>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-emerald-900">Test Name *</label>
                  <VoiceInputButton onTranscript={(text) => setFormData((prev) => ({ ...prev, test_name: text }))} />
                </div>
                <input
                  className="w-full rounded-2xl border border-emerald-100 px-4 py-3"
                  required
                  value={formData.test_name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, test_name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-emerald-900">Location</label>
                  <VoiceInputButton onTranscript={(text) => setFormData((prev) => ({ ...prev, location: text }))} />
                </div>
                <input
                  className="w-full rounded-2xl border border-emerald-100 px-4 py-3"
                  value={formData.location}
                  onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-emerald-900">Date</label>
                <input
                  type="date"
                  className="w-full rounded-2xl border border-emerald-100 px-4 py-3"
                  value={formData.test_date}
                  onChange={(e) => setFormData((prev) => ({ ...prev, test_date: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-emerald-900">Soil Type</label>
                <select
                  className="w-full rounded-2xl border border-emerald-100 px-4 py-3"
                  value={formData.soil_type}
                  onChange={(e) => setFormData((prev) => ({ ...prev, soil_type: e.target.value }))}
                >
                  <option value="">Select soil</option>
                  <option value="loamy">Loamy</option>
                  <option value="clay">Clay</option>
                  <option value="sandy">Sandy</option>
                  <option value="silty">Silty</option>
                  <option value="peaty">Peaty</option>
                  <option value="chalky">Chalky</option>
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {["current_crop", "moisture", "ph"].map((field) => (
                <div key={field} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-emerald-900 capitalize">
                      {field.replace("_", " ")}
                    </label>
                    {field === "current_crop" && (
                      <VoiceInputButton
                        onTranscript={(text) =>
                          setFormData((prev) => ({ ...prev, current_crop: text }))
                        }
                      />
                    )}
                  </div>
                  <input
                    type={field === "current_crop" ? "text" : "number"}
                    className="w-full rounded-2xl border border-emerald-100 px-4 py-3"
                    value={formData[field] ?? ""}
                    onChange={(e) => setFormData((prev) => ({ ...prev, [field]: e.target.value }))}
                  />
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {nutrientFields.map((field) => (
                <div key={field.key} className="space-y-2">
                  <label className="text-sm font-semibold text-emerald-900">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    step={field.step}
                    className="w-full rounded-2xl border border-emerald-100 px-4 py-3"
                    value={formData[field.key] ?? ""}
                    onChange={(e) => setFormData((prev) => ({ ...prev, [field.key]: e.target.value }))}
                  />
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-emerald-900">
                  Notes / Field Observations
                </label>
                <VoiceInputButton
                  onTranscript={(text) =>
                    setFormData((prev) => ({ ...prev, notes: [prev.notes, text].filter(Boolean).join(" ") }))
                  }
                />
              </div>
              <textarea
                className="w-full rounded-2xl border border-emerald-100 px-4 py-3 min-h-[100px]"
                value={formData.notes ?? ""}
                onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                placeholder="Any field notes, pest sightings, irrigation status..."
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-2xl bg-gradient-to-r from-green-600 to-emerald-500 text-white font-semibold py-4 flex items-center justify-center gap-2"
              disabled={analysisMutation.isPending}
            >
              {analysisMutation.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing Soil Data
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate AI Analysis
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {analysis && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-emerald-100 bg-white/90 p-8 text-center space-y-4 shadow-sm">
            <p className="text-sm uppercase tracking-[0.3em] text-emerald-800/60">
              AI-Powered Soil Health
            </p>
            <h2 className="text-3xl font-bold text-emerald-950">{analysis.overall_health}</h2>
            <p className="text-5xl font-black text-emerald-600">{analysis.health_score}</p>
            <p className="text-sm text-emerald-900/70">Out of 100</p>
          </div>

          {analysis.warnings?.length > 0 && (
            <div className="rounded-3xl border border-red-100 bg-red-50 p-6 space-y-2 text-red-900">
              {analysis.warnings.map((warning, index) => (
                <div key={index} className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  {warning}
                </div>
              ))}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            {analysis.nutrient_status?.map((nutrient, index) => (
              <div key={index} className="rounded-2xl border border-emerald-100 bg-gradient-to-r from-white to-emerald-50/40 p-4">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-emerald-950">{nutrient.nutrient}</p>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-100">
                    {nutrient.level}
                  </span>
                </div>
                <p className="text-sm text-emerald-900/70 mt-2">{nutrient.impact}</p>
              </div>
            ))}
          </div>

          <div className="rounded-3xl border border-amber-100 bg-gradient-to-r from-amber-50 to-white p-6 space-y-4">
            <h3 className="text-xl font-semibold text-amber-900 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Fertilizer Recommendations
            </h3>
            {analysis.fertilizer_recommendations?.map((rec, i) => (
              <div key={i} className="rounded-2xl border border-amber-100 bg-white/80 p-4">
                <p className="font-semibold text-amber-900">{rec.product}</p>
                <p className="text-sm text-amber-800/80">{rec.type}</p>
                <p className="text-sm text-amber-900/90 mt-1">{rec.dosage}</p>
                <p className="text-xs text-amber-800/70">{rec.timing}</p>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-3xl border border-green-100 bg-white/90 p-6">
              <h3 className="font-semibold text-emerald-900 flex items-center gap-2 mb-3">
                <Leaf className="w-5 h-5" />
                Suitable Crops
              </h3>
              <div className="flex flex-wrap gap-2">
                {analysis.suitable_crops?.map((crop) => (
                  <span key={crop} className="px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-semibold">
                    {crop}
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-3xl border border-red-100 bg-white/90 p-6">
              <h3 className="font-semibold text-red-900 flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5" />
                Crops to Avoid
              </h3>
              <div className="flex flex-wrap gap-2">
                {analysis.avoid_crops?.map((crop) => (
                  <span key={crop} className="px-3 py-1 rounded-full bg-red-100 text-red-800 text-sm font-semibold">
                    {crop}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-3xl border border-orange-100 bg-white/90 p-6 space-y-2">
              <h3 className="font-semibold text-orange-900">Immediate Actions</h3>
              <ul className="list-disc pl-5 text-sm text-orange-900/80">
                {analysis.immediate_actions?.map((action, i) => (
                  <li key={i}>{action}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl border border-purple-100 bg-white/90 p-6 space-y-2">
              <h3 className="font-semibold text-purple-900">Long-term Plan</h3>
              <ul className="list-disc pl-5 text-sm text-purple-900/80">
                {analysis.long_term_plan?.map((plan, i) => (
                  <li key={i}>{plan}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-3">
            <button
              className="flex-1 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-500 text-white font-semibold py-4 flex items-center justify-center gap-2"
              onClick={handleSave}
              disabled={saveMutation.isPending}
            >
              {saveMutation.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving Test
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Soil Test
                </>
              )}
            </button>
            <button
              type="button"
              className="rounded-2xl border border-red-200 text-red-700 font-semibold px-4 py-4"
              onClick={handleDiscard}
            >
              Delete Current Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

