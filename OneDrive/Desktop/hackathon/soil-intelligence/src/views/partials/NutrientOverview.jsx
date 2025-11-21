import { CheckCircle, AlertTriangle, XCircle } from "lucide-react";

const nutrientGroups = {
  Primary: [
    { key: "nitrogen", label: "Nitrogen (N)", unit: "mg/kg", optimal: "280-450" },
    { key: "phosphorus", label: "Phosphorus (P)", unit: "mg/kg", optimal: "20-50" },
    { key: "potassium", label: "Potassium (K)", unit: "mg/kg", optimal: "120-200" },
  ],
  Secondary: [
    { key: "calcium", label: "Calcium (Ca)", unit: "%", optimal: "2-4%" },
    { key: "magnesium", label: "Magnesium (Mg)", unit: "%", optimal: "0.3-1%" },
    { key: "sulfur", label: "Sulfur (S)", unit: "mg/kg", optimal: "10-20" },
  ],
  Micronutrients: [
    { key: "zinc", label: "Zinc (Zn)", unit: "mg/kg", optimal: "0.6-1" },
    { key: "iron", label: "Iron (Fe)", unit: "mg/kg", optimal: "4-6" },
    { key: "manganese", label: "Manganese (Mn)", unit: "mg/kg", optimal: "2-4" },
    { key: "copper", label: "Copper (Cu)", unit: "mg/kg", optimal: "0.2-0.5" },
    { key: "boron", label: "Boron (B)", unit: "mg/kg", optimal: "0.5-1" },
    { key: "molybdenum", label: "Molybdenum (Mo)", unit: "mg/kg", optimal: "0.1-0.5" },
  ],
};

const getStatusIcon = (value, key) => {
  if (value === undefined || value === null) return null;
  const thresholds = {
    nitrogen: [280, 450],
    phosphorus: [20, 50],
    potassium: [120, 200],
    calcium: [2, 4],
    magnesium: [0.3, 1],
    sulfur: [10, 20],
    zinc: [0.6, 1],
    iron: [4, 6],
    manganese: [2, 4],
    copper: [0.2, 0.5],
    boron: [0.5, 1],
    molybdenum: [0.1, 0.5],
  }[key];
  if (!thresholds) return null;
  if (value < thresholds[0])
    return <AlertTriangle className="w-4 h-4 text-amber-500" />;
  if (value > thresholds[1])
    return <XCircle className="w-4 h-4 text-red-500" />;
  return <CheckCircle className="w-4 h-4 text-green-600" />;
};

export default function NutrientOverview({ test }) {
  return (
    <div className="rounded-3xl border border-emerald-100 bg-white/90 p-6 shadow-sm">
      <p className="text-xs uppercase tracking-[0.3em] text-emerald-800/60 mb-4">
        Nutrient Overview
      </p>
      <div className="space-y-5">
        {Object.entries(nutrientGroups).map(([group, nutrients]) => (
          <div key={group}>
            <p className="text-sm font-semibold text-emerald-900 mb-2">{group}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {nutrients.map((nutrient) => (
                <div
                  key={nutrient.key}
                  className="rounded-2xl border border-emerald-100 bg-gradient-to-r from-white to-emerald-50/40 p-4 flex flex-col items-start justify-between h-full space-y-2"
                >
                  <div className="w-full flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-emerald-900">
                        {nutrient.label}
                      </p>
                      <p className="text-2xl font-bold text-emerald-950 mt-1">
                        {test[nutrient.key] !== undefined ? parseFloat(test[nutrient.key]).toFixed(2) : "—"}
                        <span className="text-xs font-normal text-emerald-900/70 ml-1">
                          {test[nutrient.key] !== undefined ? nutrient.unit : ""}
                        </span>
                      </p>
                    </div>
                    <div className="ml-2">
                      {getStatusIcon(test[nutrient.key], nutrient.key)}
                    </div>
                  </div>
                  <p className="text-[11px] uppercase tracking-[0.4em] text-emerald-800/40 w-full">
                    Optimal {nutrient.optimal}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

