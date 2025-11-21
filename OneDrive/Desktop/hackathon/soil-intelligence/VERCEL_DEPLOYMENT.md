# Vercel Deployment Guide

## Specifications for Vercel

**Project Type:** Vite + React (static SPA + optional serverless functions)

**Build Settings:**
- **Framework:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Node.js Version:** 18.x (default, auto-selected by Vercel)

**Environment Variables Required:**

Add these to Vercel Project Settings → Environment Variables:

```
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

**Important Notes:**
- All `VITE_*` prefixed env vars are embedded into the frontend bundle at build time (they're safe to expose in the browser since they're already public Firebase credentials).
- Do NOT commit `.env.local` to git; `.vercelignore` excludes it automatically.
- The `.vercelignore` file ignores `node_modules`, `.env.*.local`, `tools/`, and `build/` artifacts.

## Deployment Steps

### Option 1: Deploy via Vercel CLI

```powershell
# Install Vercel CLI (if not already installed)
npm install -g vercel

# Navigate to the project directory
cd C:\Users\Suhas\OneDrive\Desktop\hackathon\soil-intelligence

# Deploy to Vercel
vercel
```

**First-time prompts:**
- Link to existing Vercel project or create new one? → Choose "Link to existing" if already set up, or "Create new".
- Which scope? → Select your Vercel account/team.
- Link to Git? → Yes (recommended for automatic deployments on push).

After deployment, you'll get a unique URL like `https://soil-intelligence.vercel.app`.

### Option 2: Deploy via GitHub (Recommended)

1. Ensure the `soil-intelligence/` directory is committed to your GitHub repo (`hackathon`).
2. Go to https://vercel.com/import and connect your GitHub account.
3. Select the `hackathon` repository.
4. Select "Vite" as framework (or auto-detected).
5. In **Environment Variables**, add the `VITE_FIREBASE_*` vars.
6. Click **Deploy**.

On future pushes to `main`, Vercel will auto-redeploy.

## Serverless Functions (Optional)

If you want to host an inference endpoint for disease detection:

1. Create a `vercel/functions/` directory (alongside the Vite app root).
2. Add a Python or Node handler, e.g., `api/predict.py` or `api/predict.js`.
3. Update `vercel.json` if needed to route `/api/*` requests to the functions.

Example minimal Node function (in `vercel/functions/api/predict.js`):

```javascript
export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { imageUrl } = req.body;
    // Call your ML model (hosted externally or loaded here)
    // For now, just echo back
    res.status(200).json({ disease: "sample_result", confidence: 0.87 });
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
```

Then call from React:
```javascript
const res = await fetch('/api/predict', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ imageUrl }),
});
const data = await res.json();
console.log(data);
```

## Troubleshooting

**Build fails with "Cannot find module":**
- Ensure `package.json` dependencies are up to date: `npm install`.
- Check that all imports use correct paths (e.g., `./services/firebase` not `./services/firebase.js`).

**Firebase env vars not loading:**
- Confirm vars are added to Vercel Project Settings with the `VITE_` prefix.
- Rebuild/redeploy after adding env vars.
- In development, use `.env.local` locally (Vercel only reads Project Settings).

**Images not uploading to Firebase Storage:**
- Check that Firebase Storage bucket is enabled and CORS is configured.
- Verify `VITE_FIREBASE_STORAGE_BUCKET` is correct in Vercel env vars.

**Slow deployments:**
- Check build logs in Vercel dashboard for large dependencies or build steps.
- Consider lazy-loading images and code-splitting if bundle is >500KB.
