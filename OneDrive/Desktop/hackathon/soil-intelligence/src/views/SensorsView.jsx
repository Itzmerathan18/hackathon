import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchSensorReadings,
  simulateSensorPing,
} from "../services/mockApi.js";
import {
  Waves,
  RefreshCcw,
  AlertTriangle,
  Thermometer,
  Droplets,
  Activity,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext.jsx";

export default function SensorsView() {
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const { data: readings = [], isLoading } = useQuery({
    queryKey: ["sensorReadings"],
    queryFn: fetchSensorReadings,
    refetchInterval: 5000,
  });

  const simulateMutation = useMutation({
    mutationFn: simulateSensorPing,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["sensorReadings"] }),
  });

  const latestPerSensor = [...readings].reduce((acc, reading) => {
    if (!acc.find((r) => r.sensor_id === reading.sensor_id)) {
      acc.push(reading);
    }
    return acc;
  }, []);

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-emerald-800/60">
            {t("sensors.title")}
          </p>
          <h1 className="text-3xl font-bold text-emerald-950 dark:text-white">
            {t("sensors.title")}
          </h1>
          <p className="text-emerald-900/70 dark:text-slate-200 mt-2">
            {t("sensors.subtitle")}
          </p>
          <p className="text-sm text-emerald-800/70 dark:text-slate-300 mt-2">
            {t("sensors.devices")}
          </p>
          <div className="flex gap-2 mt-3">
            <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-sm text-emerald-800">
              Microbial Sensor
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-sm text-emerald-800">
              8-in-1 Climate Sensor
            </span>
          </div>
        </div>
        <button
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-500 text-white font-semibold shadow hover:shadow-lg flex items-center gap-2"
          onClick={() => simulateMutation.mutate()}
        >
          <RefreshCcw className={`w-5 h-5 ${simulateMutation.isPending ? "animate-spin" : ""}`} />
          {t("sensors.button")}
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-44 rounded-3xl bg-white/70 animate-pulse" />
            ))
          : latestPerSensor.map((reading) => (
              <div
                key={reading.id}
                className="rounded-3xl border border-emerald-100 bg-white/90 p-5 shadow-sm space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-emerald-800/60">
                      {reading.sensor_id}
                    </p>
                    <p className="text-xl font-semibold text-emerald-950">
                      {reading.location}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      reading.status === "online"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {reading.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-100">
                    <p className="text-emerald-800/70">Moisture</p>
                    <p className="text-2xl font-bold text-emerald-950 flex items-center gap-1">
                      <Droplets className="w-4 h-4 text-emerald-600" />
                      {reading.moisture}%
                    </p>
                  </div>
                  <div className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-100">
                    <p className="text-emerald-800/70">Temperature</p>
                    <p className="text-2xl font-bold text-emerald-950 flex items-center gap-1">
                      <Thermometer className="w-4 h-4 text-orange-500" />
                      {reading.temperature}°C
                    </p>
                  </div>
                  <div className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-100">
                    <p className="text-emerald-800/70">pH</p>
                    <p className="text-xl font-bold text-emerald-950">{reading.ph}</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-100">
                    <p className="text-emerald-800/70">Conductivity</p>
                    <p className="text-xl font-bold text-emerald-950">
                      {reading.conductivity} dS/m
                    </p>
                  </div>
                </div>

                {(reading.moisture < 30 || reading.moisture > 70 || reading.ph < 5.5 || reading.ph > 8) && (
                  <div className="flex items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-100 rounded-2xl px-3 py-2">
                    <AlertTriangle className="w-4 h-4" />
                    Critical parameter needs attention
                  </div>
                )}
              </div>
            ))}
      </div>

      <div className="rounded-3xl border border-emerald-100 bg-white/90 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <Activity className="w-5 h-5 text-emerald-700" />
          <h2 className="text-xl font-semibold text-emerald-950">
            Latest Telemetry Table
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-emerald-900/70 uppercase text-xs">
                <th className="py-2">Sensor</th>
                <th>Location</th>
                <th>Moisture</th>
                <th>Temp</th>
                <th>pH</th>
                <th>N</th>
                <th>P</th>
                <th>K</th>
                <th>Updated</th>
              </tr>
            </thead>
            <tbody>
              {readings.slice(0, 10).map((reading) => (
                <tr key={reading.id} className="border-t border-emerald-50">
                  <td className="py-2 font-semibold">{reading.sensor_id}</td>
                  <td>{reading.location}</td>
                  <td>{reading.moisture}%</td>
                  <td>{reading.temperature}°C</td>
                  <td>{reading.ph}</td>
                  <td>{reading.nitrogen}</td>
                  <td>{reading.phosphorus}</td>
                  <td>{reading.potassium}</td>
                  <td>{new Date(reading.reading_timestamp).toLocaleTimeString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

