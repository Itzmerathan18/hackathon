import { useState } from "react";
import Layout from "./components/Layout.jsx";
import DashboardView from "./views/DashboardView.jsx";
import SensorsView from "./views/SensorsView.jsx";
import NewAnalysisView from "./views/NewAnalysisView.jsx";
import HistoryView from "./views/HistoryView.jsx";
import SmartToolsView from "./views/SmartToolsView.jsx";
import YieldPredictorView from "./views/YieldPredictorView.jsx";
import DiseaseDetectorView from "./views/DiseaseDetectorView.jsx";
import ExpertChatView from "./views/ExpertChatView.jsx";
import WeatherView from "./views/WeatherView.jsx";
import AboutView from "./views/AboutView.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import AuthScreen from "./components/AuthScreen.jsx";

const viewMap = {
  dashboard: DashboardView,
  sensors: SensorsView,
  analysis: NewAnalysisView,
  history: HistoryView,
  smarttools: SmartToolsView,
  yield: YieldPredictorView,
  disease: DiseaseDetectorView,
  chat: ExpertChatView,
  weather: WeatherView,
  about: AboutView,
};

function App() {
  const [activeView, setActiveView] = useState("dashboard");
  const { user } = useAuth();
  const ActiveComponent = viewMap[activeView] || DashboardView;

  if (!user) {
    return <AuthScreen />;
  }

  return (
    <Layout activeView={activeView} onNavigate={setActiveView}>
      <div className="p-4 md:p-10 max-w-7xl mx-auto">
        <ActiveComponent />
      </div>
    </Layout>
  );
}

export default App;
