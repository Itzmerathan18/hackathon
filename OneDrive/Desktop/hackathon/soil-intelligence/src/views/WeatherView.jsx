import WeatherWidget from "../components/WeatherWidget.jsx";

export default function WeatherView() {
  return (
    <div className="space-y-6">
      <WeatherWidget compact={false} />
    </div>
  );
}

