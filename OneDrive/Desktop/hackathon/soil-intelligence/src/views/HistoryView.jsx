import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchSoilTests,
  deleteSoilTest,
} from "../services/mockApi.js";
import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  YAxis,
  CartesianGrid,
} from "recharts";
import { Trash2 } from "lucide-react";
import { useLanguage } from "../context/LanguageContext.jsx";

const nutrientKeys = [
  { key: "nitrogen", label: "Nitrogen", color: "#10b981" },
  { key: "phosphorus", label: "Phosphorus", color: "#8b5cf6" },
  { key: "potassium", label: "Potassium", color: "#f97316" },
  { key: "calcium", label: "Calcium", color: "#14b8a6", multiplier: 100 },
  { key: "magnesium", label: "Magnesium", color: "#0ea5e9", multiplier: 100 },
  { key: "sulfur", label: "Sulfur", color: "#eab308" },
];

export default function HistoryView() {
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const { data: tests = [], isLoading } = useQuery({
    queryKey: ["soilTests"],
    queryFn: fetchSoilTests,
  });
  const deleteMutation = useMutation({
    mutationFn: deleteSoilTest,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["soilTests"] }),
  });

  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedNutrients, setSelectedNutrients] = useState(
    nutrientKeys.slice(0, 3).map((item) => item.key)
  );

  const filteredTests = useMemo(() => {
    if (selectedLocation === "all") return tests;
    return tests.filter((test) => test.location === selectedLocation);
  }, [tests, selectedLocation]);

  const chartData = filteredTests
    .slice()
    .reverse()
    .map((test) => ({
      date: test.test_date,
      ...Object.fromEntries(
        nutrientKeys.map(({ key, multiplier }) => [
          key,
          Number(test[key] || 0) * (multiplier || 1),
        ])
      ),
    }));

  const toggleNutrient = (key) => {
    setSelectedNutrients((current) =>
      current.includes(key)
        ? current.filter((item) => item !== key)
        : [...current, key]
    );
  };

  const locations = Array.from(
    new Set(tests.map((test) => test.location).filter(Boolean))
  );

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-emerald-800/60">
            {t("nav.history")}
          </p>
          <h1 className="text-3xl font-bold text-emerald-950">History & Trends</h1>
          <p className="text-emerald-900/70 mt-2">
            Compare nutrient movement across tests, filter by location, and build soil intelligence over time.
          </p>
        </div>
        <select
          className="rounded-2xl border border-emerald-100 px-4 py-3 bg-white"
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
        >
          <option value="all">All Locations</option>
          {locations.map((location) => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </select>
      </header>

      <div className="rounded-3xl border border-emerald-100 bg-white/90 p-6 shadow-sm space-y-4">
        <div className="flex flex-wrap gap-2">
          {nutrientKeys.map((nutrient) => (
            <button
              key={nutrient.key}
              className={`px-3 py-1 rounded-full text-sm font-semibold border ${
                selectedNutrients.includes(nutrient.key)
                  ? "text-white"
                  : "text-emerald-900"
              }`}
              style={{
                borderColor: nutrient.color,
                backgroundColor: selectedNutrients.includes(nutrient.key)
                  ? nutrient.color
                  : "transparent",
              }}
              onClick={() => toggleNutrient(nutrient.key)}
            >
              {nutrient.label}
            </button>
          ))}
        </div>
        <div className="h-80">
          {isLoading ? (
            <div className="h-full rounded-2xl bg-emerald-50 animate-pulse" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#d1fae5" />
                <XAxis dataKey="date" stroke="#065f46" />
                <YAxis stroke="#065f46" />
                <Tooltip />
                {nutrientKeys
                  .filter((item) => selectedNutrients.includes(item.key))
                  .map((nutrient) => (
                    <Line
                      key={nutrient.key}
                      type="monotone"
                      dataKey={nutrient.key}
                      stroke={nutrient.color}
                      strokeWidth={2}
                      dot={false}
                      name={nutrient.label}
                    />
                  ))}
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="rounded-3xl border border-emerald-100 bg-white/90 p-6 shadow-sm space-y-4">
        <h2 className="text-xl font-semibold text-emerald-950">Test History</h2>
        <div className="space-y-4">
          {filteredTests.map((test) => (
            <div
              key={test.id}
              className="rounded-2xl border border-emerald-100 p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
            >
              <div>
                <p className="font-semibold text-emerald-950">{test.test_name}</p>
                <p className="text-sm text-emerald-900/70">
                  {test.location} • {test.test_date}
                </p>
              </div>
              <div className="flex flex-wrap gap-3 text-sm font-medium text-emerald-900">
                <div>N: {test.nitrogen}</div>
                <div>P: {test.phosphorus}</div>
                <div>K: {test.potassium}</div>
                <div>Moisture: {test.moisture}%</div>
                <div>pH: {test.ph}</div>
              </div>
              <button
                className="p-2 rounded-2xl bg-red-50 text-red-600 border border-red-100"
                onClick={() => deleteMutation.mutate(test.id)}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

