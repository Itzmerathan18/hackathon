import { useQuery } from "@tanstack/react-query";
import { fetchWeatherForecast } from "../services/mockApi.js";
import { CloudSun, Droplets, ThermometerSun } from "lucide-react";
import { useLanguage } from "../context/LanguageContext.jsx";

export default function WeatherWidget({ compact = false }) {
  const { t } = useLanguage();
  const { data, isLoading, error } = useQuery({
    queryKey: ["weatherForecast"],
    queryFn: fetchWeatherForecast,
    staleTime: 1000 * 60 * 30,
  });

  return (
    <div className="rounded-3xl border border-emerald-100 dark:border-slate-700 bg-white/90 dark:bg-slate-800/80 p-6 space-y-4">
      <div className="flex items-center gap-3">
        <CloudSun className="w-6 h-6 text-emerald-600" />
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-emerald-800/60 dark:text-slate-300">
            {t("weather.title")}
          </p>
          <p className="text-xs text-emerald-900/70 dark:text-slate-200">
            {t("weather.subtitle")}
          </p>
        </div>
      </div>

      {isLoading && <p className="text-sm text-emerald-900/70 dark:text-slate-200">Loading forecast…</p>}
      {error && (
        <p className="text-sm text-red-600">Unable to load weather data right now.</p>
      )}

      {data && (
        <>
          <div className="flex items-center justify-between rounded-2xl border border-emerald-100 dark:border-slate-700 p-4">
            <div>
              <p className="text-xs uppercase text-emerald-800/60 dark:text-slate-300">Now</p>
              <p className="text-3xl font-bold text-emerald-950 dark:text-white">
                {data.current.temperature}°C
              </p>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1 text-emerald-900/70 dark:text-slate-200">
                <ThermometerSun className="w-4 h-4" />
                {data.current.winddirection}°
              </span>
              <span className="flex items-center gap-1 text-emerald-900/70 dark:text-slate-200">
                <Droplets className="w-4 h-4" />
                {data.current.windspeed} km/h
              </span>
            </div>
          </div>

          {!compact && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-center text-sm">
              {data.daily.slice(0, 5).map((day) => (
                <div
                  key={day.date}
                  className="rounded-2xl border border-emerald-100 dark:border-slate-700 p-3"
                >
                  <p className="text-xs text-emerald-900/60 dark:text-slate-300">
                    {new Date(day.date).toLocaleDateString(undefined, {
                      weekday: "short",
                    })}
                  </p>
                  <p className="text-lg font-semibold text-emerald-950 dark:text-white">
                    {day.tmax}°/{day.tmin}°
                  </p>
                  <p className="text-xs text-emerald-900/70 dark:text-slate-200">
                    Rain: {day.rain}%
                  </p>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

