import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  fetchSoilTests,
  generateFertilizerPlan,
  generateIrrigationPlan,
  forecastNutrients,
  planRotation,
} from "../services/mockApi.js";
import { Calculator, Droplets, TrendingUp, Repeat } from "lucide-react";
import { useLanguage } from "../context/LanguageContext.jsx";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const ToolCard = ({ title, icon: Icon, children }) => (
  <div className="rounded-3xl border border-emerald-100 bg-white/90 p-6 shadow-sm space-y-4">
    <div className="flex items-center gap-3">
      <Icon className="w-5 h-5 text-emerald-700" />
      <h3 className="text-xl font-semibold text-emerald-950">{title}</h3>
    </div>
    {children}
  </div>
);

export default function SmartToolsView() {
  const { t } = useLanguage();
  const { data: tests = [] } = useQuery({
    queryKey: ["soilTests"],
    queryFn: fetchSoilTests,
  });
  const [selectedTest, setSelectedTest] = useState("");

  const fertilizerMutation = useMutation({ mutationFn: generateFertilizerPlan });
  const irrigationMutation = useMutation({ mutationFn: generateIrrigationPlan });
  const nutrientMutation = useMutation({ mutationFn: forecastNutrients });
  const rotationMutation = useMutation({ mutationFn: planRotation });

  const activeTest = tests.find((test) => test.id === selectedTest);

  return (
    <div className="space-y-6">
      <header className="space-y-3">
        <p className="text-sm uppercase tracking-[0.3em] text-emerald-800/60">Precision Suite</p>
        <h1 className="text-3xl font-bold text-emerald-950">{t("nav.smarttools")}</h1>
        <p className="text-emerald-900/70 max-w-3xl">
          AI models inspired by Ridge Regression, Gradient Boosting, and time-series
          forecasting deliver exact NPK dosages, irrigation schedules, nutrient
          depletion curves, and crop rotation strategies.
        </p>
      </header>

      <div className="rounded-3xl border border-emerald-100 bg-white/70 p-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold text-emerald-900">Reference Soil Test</p>
          <p className="text-sm text-emerald-900/70">
            All AI tools will use the selected soil profile as context.
          </p>
        </div>
        <select
          className="rounded-2xl border border-emerald-100 px-4 py-3 bg-white"
          value={selectedTest}
          onChange={(e) => setSelectedTest(e.target.value)}
        >
          <option value="">Pick soil test</option>
          {tests.map((test) => (
            <option key={test.id} value={test.id}>
              {test.test_name} • {test.location}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ToolCard title="Fertilizer Calculator" icon={Calculator}>
          <button
            className="rounded-2xl bg-gradient-to-r from-green-600 to-emerald-500 text-white font-semibold px-4 py-3"
            onClick={() => fertilizerMutation.mutate({ test: activeTest, crop: activeTest?.current_crop || "Generic", area: 1 })}
            disabled={fertilizerMutation.isPending || !activeTest}
          >
            {fertilizerMutation.isPending ? "Calculating…" : "Generate Precise NPK Plan"}
          </button>
          {fertilizerMutation.error && (
            <p className="text-sm text-red-600">{fertilizerMutation.error.message}</p>
          )}
          {fertilizerMutation.data && (
            <div className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4 text-center">
                {Object.entries(fertilizerMutation.data.requirements).map(([key, value]) => (
                  <div key={key} className="rounded-2xl border border-emerald-100 p-4">
                    <p className="text-sm uppercase tracking-[0.3em] text-emerald-800/60">{key}</p>
                    <p className="text-2xl font-bold text-emerald-950">{value} kg</p>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <p className="font-semibold text-emerald-900">Chemical Inputs</p>
                {fertilizerMutation.data.chemical.map((item) => (
                  <div key={item.product} className="rounded-2xl border border-emerald-100 p-3 flex justify-between text-sm">
                    <span>{item.product} ({item.ratio})</span>
                    <span className="font-semibold">{item.amount}</span>
                  </div>
                ))}
              </div>
              <p className="text-sm text-emerald-900/80">
                Estimated Cost: <span className="font-semibold">{fertilizerMutation.data.costEstimate}</span>
              </p>
            </div>
          )}
        </ToolCard>

        <ToolCard title="Irrigation Scheduler" icon={Droplets}>
          <button
            className="rounded-2xl bg-gradient-to-r from-green-600 to-emerald-500 text-white font-semibold px-4 py-3"
            onClick={() =>
              irrigationMutation.mutate({
                moisture: activeTest?.moisture,
                soilType: activeTest?.soil_type,
                crop: activeTest?.current_crop,
              })
            }
            disabled={irrigationMutation.isPending || !activeTest}
          >
            {irrigationMutation.isPending ? "Forecasting…" : "Create 7-Day Schedule"}
          </button>
          {irrigationMutation.data && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                {irrigationMutation.data.days.map((day) => (
                  <div key={day.day} className="rounded-2xl border border-emerald-100 p-3 text-center">
                    <p className="font-semibold">{day.day}</p>
                    <p className="text-emerald-900/70">{day.predicted}%</p>
                    <p className={`text-xs font-semibold ${day.irrigate ? "text-red-600" : "text-emerald-700"}`}>
                      {day.irrigate ? "Irrigate" : "Hold"}
                    </p>
                    <p className="text-xs">{day.amount}</p>
                  </div>
                ))}
              </div>
              <ul className="list-disc pl-5 text-sm text-emerald-900/70">
                {irrigationMutation.data.tips.map((tip) => (
                  <li key={tip}>{tip}</li>
                ))}
              </ul>
            </div>
          )}
        </ToolCard>

        <ToolCard title="Nutrient Forecaster" icon={TrendingUp}>
          <button
            className="rounded-2xl bg-gradient-to-r from-green-600 to-emerald-500 text-white font-semibold px-4 py-3"
            onClick={() => nutrientMutation.mutate({ test: activeTest })}
            disabled={nutrientMutation.isPending || !activeTest}
          >
            {nutrientMutation.isPending ? "Projecting…" : "Forecast 90 Days"}
          </button>
          {nutrientMutation.data && (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={nutrientMutation.data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#d1fae5" />
                  <XAxis dataKey="day" stroke="#065f46" />
                  <YAxis stroke="#065f46" />
                  <Tooltip />
                  <Line dataKey="nitrogen" stroke="#10b981" strokeWidth={2} name="Nitrogen" />
                  <Line dataKey="phosphorus" stroke="#8b5cf6" strokeWidth={2} name="Phosphorus" />
                  <Line dataKey="potassium" stroke="#f97316" strokeWidth={2} name="Potassium" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </ToolCard>

        <ToolCard title="Crop Rotation Planner" icon={Repeat}>
          <button
            className="rounded-2xl bg-gradient-to-r from-green-600 to-emerald-500 text-white font-semibold px-4 py-3"
            onClick={() => rotationMutation.mutate({ test: activeTest })}
            disabled={rotationMutation.isPending || !activeTest}
          >
            {rotationMutation.isPending ? "Designing…" : "Generate 3-Year Plan"}
          </button>
          {rotationMutation.data && (
            <div className="space-y-3">
              {rotationMutation.data.map((season) => (
                <div key={season.season} className="rounded-2xl border border-emerald-100 p-4">
                  <p className="text-sm uppercase tracking-[0.3em] text-emerald-800/60">{season.season}</p>
                  <p className="text-xl font-semibold text-emerald-950">{season.crop}</p>
                  <p className="text-sm text-emerald-900/70">{season.reason}</p>
                  <p className="text-sm text-emerald-900 font-semibold">Impact: {season.nutrient_impact}</p>
                </div>
              ))}
            </div>
          )}
        </ToolCard>
      </div>
    </div>
  );
}

