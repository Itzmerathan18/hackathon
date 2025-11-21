# Soil Nutrient Intelligence Platform

Next-gen precision agriculture dashboard built with **React + Vite + Tailwind**. The system analyzes 12+ nutrients, ingests live sensor readings, runs AI/ML recommendations, and visualizes explainable insights for farmers.

## ✨ Key Features
- **Smart Insights Dashboard** – Lightweight ML auto-builds charts, predictions, and explains them (Grad-CAM-style narrative + feature contributions).
- **IoT Sensor Suite** – Live monitoring for the microbial sensor and 8-in-1 climate sensor with critical alerts, trend tables, and simulations.
- **AI Soil Analysis** – Manual entry or sensor import, AI-powered nutrient interpretation, fertilizer plans (chemical + organic), crop recommendations, and voice input.
- **Disease Detector** – Upload leaf imagery, see nutrient vs. fungal/bacterial causes, confidence %, ensemble-model prompt (EfficientNet + ViT), and step-by-step treatments.
- **Weather Intelligence** – Real-world forecast via Open-Meteo merged into irrigation insights (dedicated Weather view).
- **Smart Tools** – Fertilizer calculator, irrigation scheduler, nutrient forecaster, and crop-rotation planner driven by mock ML services.
- **Expert Chat** – Context-aware agronomy copilot with model selector (OpenAI/Gemini/Claude), local API-key entry, and streaming responses.
- **Authentication & Localization** – Centered login screen, Gmail/phone stubs, theme toggle, and English/Hindi/Kannada translations covering nav + UI.

## 🛠 Tech Stack
- React 19, Vite, Tailwind 3, lucide-react
- @tanstack/react-query for data caching
- Mock service layer (`src/services/mockApi.js`) mimicking AI/LLM pipelines, weather API, and sensor data
- Vercel-friendly build (`npm run build` → `dist/`)

## 🚀 Getting Started
```bash
git clone <repo-url>
cd soil-intelligence
npm install
npm run dev
```
Open `http://localhost:5173` in your browser. Use the login form (any email/password works—mock auth) to enter the dashboard.

## 📦 Production Build
```bash
npm run build
npm run preview
```
Deploy `dist/` to any static host (e.g., Vercel). In Vercel, set:
- Framework Preset: **Vite**
- Build Command: `npm run build`
- Output Directory: `dist`
- Root Directory: `soil-intelligence`

## 📁 Important Paths
- `src/context/` – Theme, language, auth providers
- `src/views/` – Page-level views (Dashboard, Sensors, Weather, About, etc.)
- `src/components/` – Shared UI components (Layout, WeatherWidget, Auth screens, voice button, etc.)
- `src/services/mockApi.js` – Mock AI/ML + weather + sensor data providers

## 🧑‍🤝‍🧑 Creators
- Anushree M – AI Engineer & Agronomy Lead
- Rathan A S – IoT & Sensor Integrations
- Nikitha Poojari – UX Research & Farmer Success
- Chetan Kumar N K – Data Scientist & ML Ops

## 📄 License
This project is intended for hackathon/demo use. Adapt freely for non-commercial prototypes; please credit the team above.

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
