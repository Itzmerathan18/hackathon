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

Firebase & Kaggle (image model) integration
-------------------------------------------

This project ships with an in-memory `mockApi` for demos. To use a real backend and a trained image model:

- Firebase: add client initialization and Firestore / Storage helpers in `src/services/firebase.js`. Provide config via a Vite env file `.env.local` with keys prefixed `VITE_FIREBASE_` (see template below).
- Image model training: download a Kaggle plant-disease dataset locally, arrange it in `tools/train_model/dataset/{train,val}/{class}/...`, then use the provided `tools/train_model/train.py` to train a transfer-learning classifier. The script saves a `saved_model/` you can deploy to a Cloud Function or an ML endpoint.

Env template (.env.local):

VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

Quick steps:

1. Create a Firebase project and enable Firestore and Storage.
2. Add the `.env.local` file to the project root (do NOT commit it).
3. In the app, call `import firebase from './src/services/firebase'` and `firebase.initFirebase()` early (e.g., in `main.jsx`).
4. To store disease images from the frontend: upload the file using `firebase.uploadImage(file)`, then create a Firestore doc via `firebase.recordDiseaseImage(...)`.
5. To train an image model locally from a Kaggle dataset:

	- Install Kaggle CLI and authenticate: `pip install kaggle` then put your `kaggle.json` in `~/.kaggle/`.
	- Download a dataset (example):

```powershell
kaggle datasets download -d username/dataset-name -p tools/train_model --unzip
```

	- Prepare the directory `tools/train_model/dataset/train` and `tools/train_model/dataset/val` (one folder per class).
	- Create a Python virtualenv and install requirements: `python -m venv .venv; .\.venv\Scripts\Activate; pip install -r tools/train_model/requirements.txt`.
	- Run training: `python tools/train_model/train.py --data_dir tools/train_model/dataset --epochs 10 --batch_size 32`.

Deployment notes:

- For inference in production, host the trained model on an endpoint (Cloud Run, Vertex AI, AWS SageMaker, or a Cloud Function that calls the model). The frontend can then POST images to that endpoint and receive predictions.
- Alternatively, deploy a small API (Node/Python) that loads the model and serves inference; when a new image is uploaded to Storage, trigger a Cloud Function to run inference and write results back to Firestore.

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
