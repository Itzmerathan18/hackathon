import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  fetchSoilTests,
  fetchSensorReadings,
  generateSmartInsights,
} from "../services/mockApi.js";
import {
  Beaker,
  Activity,
  Droplets,
  MapPin,
  TrendingUp,
  AlertTriangle,
  Brain,
} from "lucide-react";
import NutrientOverview from "./partials/NutrientOverview.jsx";
import RecentTests from "./partials/RecentTests.jsx";
import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useLanguage } from "../context/LanguageContext.jsx";

const StatCard = ({ icon: Icon, title, value, subtitle, badge }) => (
  <div className="rounded-2xl border border-emerald-100 bg-white/90 p-6 shadow-sm">
    <div className="flex items-start justify-between mb-3">
      <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-700">
        <Icon className="w-6 h-6" />
      </div>

      {badge}
    </div>
    <p className="text-sm text-emerald-900/70">{title}</p>
    <p className="text-3xl font-bold mt-1 text-emerald-950">{value}</p>
    {subtitle && <p className="text-xs text-emerald-900/60 mt-1">{subtitle}</p>}
  </div>
);

export default function DashboardView() {
  const { t } = useLanguage();
  const {
    data: tests = [],
    isLoading,
  } = useQuery({ queryKey: ["soilTests"], queryFn: fetchSoilTests });

  const { data: sensors = [] } = useQuery({
    queryKey: ["sensorReadings"],
    queryFn: fetchSensorReadings,
  });

  const latestTest = tests[0];
  const moistureAlert = latestTest && latestTest.moisture < 35;
  const locations = useMemo(
    () =>
      Array.from(
        new Set(tests.map((test) => test.location).filter(Boolean))
      ),
    [tests]
  );

  const healthScore = useMemo(() => {
    if (!latestTest) return 0;
    let score = 70;
    if (latestTest.moisture > 30 && latestTest.moisture < 60) score += 10;
    if (latestTest.ph > 6 && latestTest.ph < 7.5) score += 10;
    if (latestTest.nitrogen > 150) score += 10;
    return Math.min(score, 100);
  }, [latestTest]);

  const { data: smartInsights } = useQuery({
    queryKey: [
      "smartInsights",
      tests.map((t) => t.id).join(","),
      sensors.map((s) => s.id).join(","),
    ],
    queryFn: () => generateSmartInsights({ tests, sensors }),
    enabled: tests.length > 0,
  });

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-emerald-800/60">
          {t("dashboard.title")}
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-emerald-950 mt-3">
          {t("dashboard.subtitle")}
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          icon={Beaker}
          title={t("dashboard.tests")}
          value={tests.length}
          subtitle={t("dashboard.tests")}
          badge={
            <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              +{tests.length > 4 ? Math.floor(tests.length / 2) : tests.length}
            </span>
          }
        />
        <StatCard
          icon={Activity}
          title={t("dashboard.sensors")}
          value={sensors.filter((s) => s.status === "online").length}
          subtitle="Streaming every 5 seconds"
          badge={
            <span className="bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
              Live
            </span>
          }
        />
        <StatCard
          icon={Droplets}
          title={t("dashboard.health")}
          value={`${healthScore}/100`}
          subtitle="Based on moisture, pH, nitrogen & micronutrients"
          badge={
            moistureAlert && (
              <span className="bg-red-100 text-red-700 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                Low Moisture
              </span>
            )
          }
        />
        <StatCard
          icon={MapPin}
          title={t("dashboard.locations")}
          value={locations.length}
          subtitle="Under continuous monitoring"
        />
      </div>

      {isLoading ? (
        <div className="h-64 rounded-3xl bg-white/70 animate-pulse" />
      ) : latestTest ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="border border-green-100 rounded-3xl bg-white/90 shadow-sm p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-emerald-800/60 mb-3">
                Latest Soil Test
              </p>
              <h2 className="text-2xl font-semibold text-emerald-950">
                {latestTest.test_name}
              </h2>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="rounded-lg border border-emerald-100 bg-emerald-50/50 p-3">
                  <p className="font-semibold text-emerald-900/80 text-xs uppercase tracking-[0.1em]">Location</p>
                  <p className="text-lg font-semibold text-emerald-950 mt-1">{latestTest.location}</p>
                </div>
                <div className="rounded-lg border border-emerald-100 bg-emerald-50/50 p-3">
                  <p className="font-semibold text-emerald-900/80 text-xs uppercase tracking-[0.1em]">Crop</p>
                  <p className="text-lg font-semibold text-emerald-950 mt-1">{latestTest.current_crop || "—"}</p>
                </div>
                <div className="rounded-lg border border-emerald-100 bg-emerald-50/50 p-3">
                  <p className="font-semibold text-emerald-900/80 text-xs uppercase tracking-[0.1em]">Moisture</p>
                  <p className="text-lg font-semibold text-emerald-950 mt-1">{parseFloat(latestTest.moisture).toFixed(2)}%</p>
                </div>
                <div className="rounded-lg border border-emerald-100 bg-emerald-50/50 p-3">
                  <p className="font-semibold text-emerald-900/80 text-xs uppercase tracking-[0.1em]">pH</p>
                  <p className="text-lg font-semibold text-emerald-950 mt-1">{parseFloat(latestTest.ph).toFixed(2)}</p>
                </div>
              </div>
            </div>
            <NutrientOverview test={latestTest} />
          </div>
          <RecentTests tests={tests.slice(0, 5)} />
          {smartInsights && (
            <div className="rounded-3xl border border-emerald-200 bg-white/90 p-6 space-y-6 shadow-xl">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-emerald-800/60">
                    {t("dashboard.smartInsightsTitle")}
                  </p>
                  <h2 className="text-2xl font-bold text-emerald-950 flex items-center gap-2">
                    <Brain className="w-5 h-5 text-emerald-600" />
                    {t("dashboard.smartInsightsDesc")}
                  </h2>
                </div>
              </div>
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={smartInsights.chartData}>
                      <CartesianGrid stroke="#d1fae5" strokeDasharray="3 3" />
                      <XAxis dataKey="date" stroke="#065f46" />
                      <Tooltip />
                      <Line type="monotone" dataKey="health" stroke="#10b981" strokeWidth={3} name="Health Score" />
                      <Line type="monotone" dataKey="nitrogen" stroke="#8b5cf6" strokeWidth={2} name="Nitrogen" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-3">
                  <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">
                    <p className="text-sm font-semibold text-emerald-900">
                      {t("dashboard.xaiTitle")}
                    </p>
                    <p className="text-xs text-emerald-900/70 mt-2">
                      {smartInsights.explainability}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-emerald-900 mb-2">
                      {t("dashboard.featureTitle")}
                    </p>
                    <div className="space-y-2">
                      {smartInsights.featureImportance.map((item) => (
                        <div key={item.feature}>
                          <div className="flex justify-between text-xs text-emerald-900/60">
                            <span>{item.feature}</span>
                            <span>{Math.round(item.weight * 100)}%</span>
                          </div>
                          <div className="h-2 bg-emerald-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-emerald-500 to-green-600"
                              style={{ width: `${item.weight * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <ul className="list-disc pl-5 text-sm text-emerald-900/80">
                    {smartInsights.insights.map((insight, index) => (
                      <li key={index}>{insight}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-emerald-200 bg-white/80 p-10 text-center">
          <p className="text-xl font-semibold text-emerald-900">
            No soil tests found yet
          </p>
          <p className="text-emerald-800/70 mt-2">
            Run your first IoT-driven analysis to unlock full insights.
          </p>
        </div>
      )}
    </div>
  );
}

