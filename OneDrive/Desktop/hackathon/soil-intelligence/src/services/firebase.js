import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Uses Vite env vars prefixed with VITE_ (keep secrets out of source control)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

let app;
let db;
let storage;

export function initFirebase() {
  if (!app && firebaseConfig.apiKey) {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    storage = getStorage(app);
  }
}

// Firestore helpers
async function fetchCollection(collName, options = {}) {
  initFirebase();
  if (!db) throw new Error("Firebase not configured. Set VITE_FIREBASE_* env vars.");
  const collRef = collection(db, collName);
  let q = collRef;
  if (options.orderBy) q = query(collRef, orderBy(options.orderBy, options.dir || "desc"));
  if (options.limit) q = query(q, limit(options.limit));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function fetchSoilTests() {
  return fetchCollection("soilTests", { orderBy: "test_date" });
}

export async function fetchSensorReadings() {
  return fetchCollection("sensorReadings", { orderBy: "reading_timestamp" });
}

export async function createSoilTest(payload) {
  initFirebase();
  if (!db) throw new Error("Firebase not configured. Set VITE_FIREBASE_* env vars.");
  const docRef = await addDoc(collection(db, "soilTests"), payload);
  return { id: docRef.id, ...payload };
}

export async function deleteSoilTest(id) {
  initFirebase();
  if (!db) throw new Error("Firebase not configured. Set VITE_FIREBASE_* env vars.");
  await deleteDoc(doc(db, "soilTests", id));
  return true;
}

export async function uploadImage(file, path = "disease-images") {
  initFirebase();
  if (!storage) throw new Error("Firebase not configured. Set VITE_FIREBASE_* env vars.");
  const fileRef = ref(storage, `${path}/${Date.now()}_${file.name}`);
  const result = await uploadBytes(fileRef, file);
  const url = await getDownloadURL(result.ref);
  return { url, fullPath: result.ref.fullPath };
}

// This function stores an image metadata document and returns its id.
// Actual model inference should be handled by a Cloud Function or external ML endpoint.
export async function recordDiseaseImage({ fileMeta = {}, imageUrl }) {
  initFirebase();
  if (!db) throw new Error("Firebase not configured. Set VITE_FIREBASE_* env vars.");
  const payload = {
    createdAt: new Date().toISOString(),
    imageUrl,
    ...fileMeta,
  };
  const docRef = await addDoc(collection(db, "diseaseImages"), payload);
  return { id: docRef.id, ...payload };
}

export default {
  initFirebase,
  fetchSoilTests,
  fetchSensorReadings,
  createSoilTest,
  deleteSoilTest,
  uploadImage,
  recordDiseaseImage,
};
