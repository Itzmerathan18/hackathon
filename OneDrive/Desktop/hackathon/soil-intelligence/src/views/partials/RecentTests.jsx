import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";

const TrendIcon = ({ current, previous }) => {
  if (previous === undefined || previous === null) return <Minus className="w-4 h-4 text-gray-400" />;
  if (current > previous)
    return <ArrowUpRight className="w-4 h-4 text-green-600" />;
  if (current < previous)
    return <ArrowDownRight className="w-4 h-4 text-red-500" />;
  return <Minus className="w-4 h-4 text-gray-400" />;
};

export default function RecentTests({ tests }) {
  return (
    <div className="rounded-3xl border border-emerald-100 bg-white/90 p-6 shadow-sm">
      <p className="text-xs uppercase tracking-[0.3em] text-emerald-800/60 mb-4">
        Recent Soil Tests
      </p>
      <div className="space-y-4">
        {tests.map((test, index) => {
          const prev = tests[index + 1];
          return (
            <div key={test.id} className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border border-emerald-100 rounded-2xl p-4 bg-emerald-50/40">
              <div>
                <p className="font-semibold text-emerald-950">{test.test_name}</p>
                <p className="text-sm text-emerald-900/70">
                  {test.location} • {test.test_date}
                </p>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm font-medium text-emerald-900">
                {["nitrogen", "phosphorus", "potassium"].map((nutrient) => (
                  <div key={nutrient} className="flex items-center gap-2">
                    <TrendIcon current={test[nutrient]} previous={prev?.[nutrient]} />
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.3em] text-emerald-800/50">
                        {nutrient.slice(0, 1).toUpperCase() + nutrient.slice(1, 3)}
                      </p>
                      <p>{test[nutrient] ?? "—"}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

