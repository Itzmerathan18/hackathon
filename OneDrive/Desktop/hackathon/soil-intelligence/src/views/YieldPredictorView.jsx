import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchSoilTests, predictYield } from "../services/mockApi.js";
import { Brain, Thermometer, CloudRain, ShieldAlert } from "lucide-react";
import { useLanguage } from "../context/LanguageContext.jsx";

export default function YieldPredictorView() {
  const { t } = useLanguage();
  const { data: tests = [] } = useQuery({
    queryKey: ["soilTests"],
    queryFn: fetchSoilTests,
  });
  const [form, setForm] = useState({
    testId: "",
    crop: "",
    rainfall: 1100,
    temperature: 29,
  });
  const mutation = useMutation({ mutationFn: predictYield });
  const selectedTest = tests.find((test) => test.id === form.testId);

  const handlePredict = (event) => {
    event.preventDefault();
    mutation.mutate({
      test: selectedTest,
      crop: form.crop,
      rainfall: Number(form.rainfall),
      temperature: Number(form.temperature),
    });
  };

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm uppercase tracking-[0.3em] text-emerald-800/60">ML Studio</p>
        <h1 className="text-3xl font-bold text-emerald-950">{t("nav.yield")}</h1>
        <p className="text-emerald-900/70 max-w-3xl">
          Hybrid Ridge Regression + Gradient Boosting style model estimates yield by blending soil nutrients,
          rainfall outlook, canopy temperature, and agronomic best practices.
        </p>
      </header>

      <form className="rounded-3xl border border-emerald-100 bg-white/90 p-6 shadow-sm grid md:grid-cols-2 gap-4" onSubmit={handlePredict}>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-emerald-900">Soil Test</label>
          <select
            className="w-full rounded-2xl border border-emerald-100 px-4 py-3 bg-white"
            value={form.testId}
            onChange={(e) => setForm((prev) => ({ ...prev, testId: e.target.value }))}
            required
          >
            <option value="">Select soil test</option>
            {tests.map((test) => (
              <option key={test.id} value={test.id}>
                {test.test_name} • {test.location}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-emerald-900">Crop</label>
          <input
            className="w-full rounded-2xl border border-emerald-100 px-4 py-3"
            value={form.crop}
            onChange={(e) => setForm((prev) => ({ ...prev, crop: e.target.value }))}
            placeholder="Areca, Maize, Tomato…"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-emerald-900 flex items-center gap-2">
            <CloudRain className="w-4 h-4 text-emerald-700" />
            Rainfall Forecast (mm)
          </label>
          <input
            type="number"
            className="w-full rounded-2xl border border-emerald-100 px-4 py-3"
            value={form.rainfall}
            onChange={(e) => setForm((prev) => ({ ...prev, rainfall: e.target.value }))}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-emerald-900 flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-emerald-700" />
            Avg. Temperature (°C)
          </label>
          <input
            type="number"
            className="w-full rounded-2xl border border-emerald-100 px-4 py-3"
            value={form.temperature}
            onChange={(e) => setForm((prev) => ({ ...prev, temperature: e.target.value }))}
          />
        </div>

        <button
          type="submit"
          className="md:col-span-2 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-500 text-white font-semibold py-4 flex items-center justify-center gap-2"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Running Model…" : (
            <>
              <Brain className="w-5 h-5" />
              Predict Yield
            </>
          )}
        </button>
      </form>

      {mutation.error && <p className="text-sm text-red-600">{mutation.error.message}</p>}

      {mutation.data && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="rounded-3xl border border-emerald-100 bg-white/90 p-6 text-center space-y-3">
            <p className="text-sm uppercase tracking-[0.3em] text-emerald-800/60">Projected Yield</p>
            <p className="text-5xl font-black text-emerald-600">{mutation.data.predictedYield}</p>
            <p className="text-sm text-emerald-900/70">tons per acre</p>
            <p className="text-sm text-emerald-900">Confidence: {mutation.data.confidence}%</p>
          </div>
          <div className="rounded-3xl border border-emerald-100 bg-white/90 p-6 space-y-3">
            <h3 className="font-semibold text-emerald-900 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-500" />
              Limiting Factors
            </h3>
            {mutation.data.limitingFactors?.length ? (
              mutation.data.limitingFactors.map((factor, index) => (
                <div key={index} className="rounded-2xl border border-amber-100 bg-amber-50/80 p-3">
                  <p className="font-semibold text-amber-900">{factor.factor} — {factor.severity}</p>
                  <p className="text-sm text-amber-900/80">{factor.impact}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-emerald-900/70">No major risks detected.</p>
            )}
          </div>
          <div className="rounded-3xl border border-emerald-100 bg-white/90 p-6 space-y-2">
            <h3 className="font-semibold text-emerald-900">Improvement Strategies</h3>
            <ul className="list-disc pl-5 text-sm text-emerald-900/80">
              {mutation.data.strategies.map((strategy) => (
                <li key={strategy}>{strategy}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-emerald-100 bg-white/90 p-6 space-y-2">
            <h3 className="font-semibold text-emerald-900">Optimal Nutrient Targets</h3>
            <div className="grid grid-cols-3 gap-3 text-center">
              {Object.entries(mutation.data.optimalTargets).map(([key, target]) => (
                <div key={key} className="rounded-2xl border border-emerald-100 p-4">
                  <p className="text-sm uppercase tracking-[0.3em] text-emerald-800/50">{key}</p>
                  <p className="text-lg font-semibold text-emerald-950">{target}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

