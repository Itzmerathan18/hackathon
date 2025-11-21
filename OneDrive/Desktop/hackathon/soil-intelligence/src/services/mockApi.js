import { v4 as uuidv4 } from "uuid";

const nutrientRanges = {
  nitrogen: { deficient: 280, medium: 450 },
  phosphorus: { deficient: 20, medium: 50, optimalMax: 100 },
  potassium: { deficient: 120, medium: 200 },
  calcium: { deficient: 2, optimal: 4 },
  magnesium: { deficient: 0.3, optimal: 1 },
  sulfur: { deficient: 10, optimal: 20 },
  zinc: { deficient: 0.6, optimal: 1 },
  iron: { deficient: 4, optimal: 6 },
  manganese: { deficient: 2, optimal: 4 },
  copper: { deficient: 0.2, optimal: 0.5 },
  boron: { deficient: 0.5, optimal: 1 },
  molybdenum: { deficient: 0.1, optimal: 0.5 },
};

const soilTypeDefaults = {
  loamy: { moisture: 42, ph: 6.8 },
  sandy: { moisture: 28, ph: 6.2 },
  clay: { moisture: 55, ph: 7.4 },
  silty: { moisture: 48, ph: 6.5 },
};

const defaultFarmLocation = {
  name: "Karnataka Coastal Belt",
  latitude: 15.85,
  longitude: 74.5,
};

const diseaseDataset = [
  {
    id: "ds-001",
    crop: "Areca",
    disease_name: "Koleroga (Mahali)",
    cause_type: "Fungal",
    visual_signatures: ["black", "water soaked", "fruit rot"],
    nutrient_flags: ["Calcium Imbalance"],
    accuracy: 0.95,
    solution: "Copper oxychloride spray + drainage improvement",
  },
  {
    id: "ds-002",
    crop: "Tomato",
    disease_name: "Early Blight",
    cause_type: "Fungal",
    visual_signatures: ["target spot", "yellow halo"],
    nutrient_flags: ["Potassium stress"],
    accuracy: 0.93,
    solution: "Mancozeb + balanced K schedule",
  },
  {
    id: "ds-003",
    crop: "Banana",
    disease_name: "Sigatoka Leaf Spot",
    cause_type: "Fungal",
    visual_signatures: ["brown streak", "yellow margin"],
    nutrient_flags: ["Magnesium deficiency"],
    accuracy: 0.92,
    solution: "Propiconazole spray + MgSO4 foliar",
  },
];

let soilTests = [
  {
    id: uuidv4(),
    test_name: "Areca Main Block",
    test_date: "2025-11-18",
    location: "Field A - North",
    soil_type: "loamy",
    current_crop: "Areca",
    moisture: 41,
    ph: 7.4,
    nitrogen: 180,
    phosphorus: 34,
    potassium: 210,
    calcium: 2.4,
    magnesium: 0.22,
    sulfur: 7,
    zinc: 0.4,
    iron: 3.4,
    manganese: 1.2,
    copper: 0.18,
    boron: 0.32,
    molybdenum: 0.08,
    notes: "Moisture slightly low; visible Zn deficiency.",
  },
  {
    id: uuidv4(),
    test_name: "Cocoa Alley Plot",
    test_date: "2025-11-14",
    location: "Field B - South",
    soil_type: "clay",
    current_crop: "Cocoa",
    moisture: 52,
    ph: 6.5,
    nitrogen: 265,
    phosphorus: 44,
    potassium: 180,
    calcium: 3.2,
    magnesium: 0.52,
    sulfur: 13,
    zinc: 0.65,
    iron: 4.8,
    manganese: 3.1,
    copper: 0.24,
    boron: 0.62,
    molybdenum: 0.18,
    notes: "Root zone well-drained, maintain mulch.",
  },
  {
    id: uuidv4(),
    test_name: "Vegetable Polyhouse",
    test_date: "2025-11-09",
    location: "Field C - East",
    soil_type: "sandy",
    current_crop: "Tomato",
    moisture: 32,
    ph: 6.1,
    nitrogen: 305,
    phosphorus: 68,
    potassium: 260,
    calcium: 2.8,
    magnesium: 0.35,
    sulfur: 17,
    zinc: 0.98,
    iron: 5.4,
    manganese: 2.4,
    copper: 0.27,
    boron: 0.78,
    molybdenum: 0.21,
    notes: "Excellent tomato bed; watch EC spikes.",
  },
];

let sensorReadings = [
  {
    id: uuidv4(),
    sensor_id: "SENSOR-001",
    location: "Field A - North",
    reading_timestamp: new Date().toISOString(),
    moisture: 38,
    temperature: 30,
    ph: 7.3,
    nitrogen: 165,
    phosphorus: 32,
    potassium: 220,
    conductivity: 0.9,
    status: "online",
  },
  {
    id: uuidv4(),
    sensor_id: "SENSOR-002",
    location: "Field B - South",
    reading_timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    moisture: 58,
    temperature: 27,
    ph: 6.5,
    nitrogen: 250,
    phosphorus: 46,
    potassium: 205,
    conductivity: 1.2,
    status: "online",
  },
  {
    id: uuidv4(),
    sensor_id: "SENSOR-003",
    location: "Field C - East",
    reading_timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    moisture: 33,
    temperature: 32,
    ph: 6.1,
    nitrogen: 300,
    phosphorus: 70,
    potassium: 240,
    conductivity: 1.8,
    status: "online",
  },
];

const wait = (ms = 400) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

const interpretNutrient = (key, value = 0) => {
  const range = nutrientRanges[key];
  if (!range) return { status: "unknown", level: "Unknown", impact: "No data" };
  let status = "optimal";
  let level = "Ideal";
  let impact = `${key} within comfortable range.`;

  if (key === "ph") {
    if (value < 6) {
      status = "deficient";
      level = "Too Acidic";
      impact = "Raise pH with lime or gypsum.";
    } else if (value > 7.5) {
      status = "excess";
      level = "Too Alkaline";
      impact = "Add organic matter / elemental sulfur.";
    } else {
      impact = "pH friendly for most crops.";
    }
    return { status, level, impact };
  }

  if (value < range.deficient) {
    status = "deficient";
    level = "Low";
    impact = `Increase ${key.toUpperCase()} to avoid stunted growth.`;
  } else if (range.medium && value < range.medium) {
    status = "medium";
    level = "Medium";
    impact = `Borderline ${key.toUpperCase()} levels; supplement soon.`;
  } else if (range.optimal && value > range.optimal) {
    status = "excess";
    level = "High";
    impact = `Slightly high ${key.toUpperCase()}; monitor for toxicity.`;
  } else if (range.optimalMax && value > range.optimalMax) {
    status = "excess";
    level = "High";
    impact = `${key.toUpperCase()} oversupply; risk of antagonism.`;
  }
  return { status, level, impact };
};

const calcHealthScore = (test) => {
  if (!test) return 0;
  let score = 55;
  if (test.moisture > 30 && test.moisture < 60) score += 10;
  if (test.ph > 6 && test.ph < 7.5) score += 10;
  if (test.nitrogen > 150) score += 10;
  if (test.potassium > 200) score += 8;
  if (test.zinc > 0.6) score += 5;
  return clamp(Math.round(score), 0, 100);
};

export const fetchSoilTests = async () => {
  await wait();
  return [...soilTests].sort(
    (a, b) => new Date(b.test_date) - new Date(a.test_date)
  );
};

export const fetchSensorReadings = async () => {
  await wait(250);
  return [...sensorReadings].sort(
    (a, b) => new Date(b.reading_timestamp) - new Date(a.reading_timestamp)
  );
};

export const createSoilTest = async (payload) => {
  await wait();
  const newTest = {
    id: uuidv4(),
    test_name: payload.test_name || `Soil Test ${soilTests.length + 1}`,
    test_date: payload.test_date || new Date().toISOString().split("T")[0],
    soil_type: payload.soil_type || "loamy",
    location: payload.location || "Unknown Field",
    current_crop: payload.current_crop || "",
    notes: payload.notes || "",
    ...payload,
  };
  soilTests = [newTest, ...soilTests];
  return newTest;
};

export const deleteSoilTest = async (id) => {
  await wait(200);
  soilTests = soilTests.filter((test) => test.id !== id);
  return true;
};

export const simulateSensorPing = async () => {
  await wait(200);
  const catalog = ["SENSOR-001", "SENSOR-002", "SENSOR-003"];
  const sensorId = catalog[Math.floor(Math.random() * catalog.length)];
  const base = soilTests.find((test) =>
    (test.test_name || "").includes(sensorId.slice(-1))
  );
  const soilDefaults = soilTypeDefaults[base?.soil_type || "loamy"];
  const reading = {
    id: uuidv4(),
    sensor_id: sensorId,
    location: base?.location || "Demo Field",
    reading_timestamp: new Date().toISOString(),
    moisture: clamp(
      (soilDefaults?.moisture || 40) + (Math.random() * 12 - 6),
      20,
      80
    ),
    temperature: clamp(26 + Math.random() * 8, 20, 36),
    ph: clamp((soilDefaults?.ph || 6.8) + (Math.random() * 0.6 - 0.3), 5.5, 8.2),
    nitrogen: clamp((base?.nitrogen || 220) + (Math.random() * 40 - 20), 80, 400),
    phosphorus: clamp(
      (base?.phosphorus || 40) + (Math.random() * 12 - 6),
      10,
      120
    ),
    potassium: clamp(
      (base?.potassium || 210) + (Math.random() * 50 - 25),
      80,
      320
    ),
    conductivity: clamp(0.7 + Math.random() * 1.2, 0.3, 2.5),
    status: "online",
  };
  sensorReadings = [reading, ...sensorReadings].slice(0, 60);
  return reading;
};

export const analyzeSoil = async (payload) => {
  await wait(600);
  const test = { ...payload };
  const nutrient_status = Object.keys(nutrientRanges).map((key) => ({
    nutrient: key.toUpperCase(),
    value: Number(test[key]) || 0,
    ...interpretNutrient(key, Number(test[key]) || 0),
  }));

  const zincLow = (test.zinc || 0) < nutrientRanges.zinc.deficient;
  const sulfurLow = (test.sulfur || 0) < nutrientRanges.sulfur.deficient;
  const nitrogenLow = (test.nitrogen || 0) < nutrientRanges.nitrogen.deficient;

  const fertilizer_recommendations = [
    nitrogenLow && {
      type: "Chemical",
      product: "Urea (46-0-0)",
      dosage: "10 kg/acre in split dose",
      timing: "Apply immediately, repeat in 15 days",
    },
    zincLow && {
      type: "Micronutrient",
      product: "Zinc Sulphate Heptahydrate",
      dosage: "12 kg/acre",
      timing: "Broadcast with irrigation",
    },
    sulfurLow && {
      type: "Secondary",
      product: "Agricultural Gypsum",
      dosage: "25 kg/acre",
      timing: "Before irrigation",
    },
  ].filter(Boolean);

  const organic_amendments = [
    "Apply 2 tons/acre of well-decomposed farmyard manure",
    "Incorporate green manure (sunhemp) between crop rows",
    "Use compost tea foliar spray every 20 days",
  ];

  const cropCatalog = [
    "Areca",
    "Coconut",
    "Pepper",
    "Banana",
    "Ginger",
    "Turmeric",
    "Tomato",
    "Potato",
    "Maize",
    "Groundnut",
  ];
  const suitable = cropCatalog
    .filter((crop) => {
      if (crop === "Tomato" && zincLow) return false;
      if (crop === "Potato" && sulfurLow) return false;
      if (crop === "Areca" && zincLow) return false;
      return true;
    })
    .slice(0, 5);

  const avoid = cropCatalog.filter((crop) => !suitable.includes(crop)).slice(0, 4);

  const immediate_actions = [
    nitrogenLow && "Apply 10 kg urea split into two irrigations.",
    zincLow && "Broadcast 12 kg Zinc Sulphate with irrigation water.",
    test.moisture < 35 && "Irrigate 2-3 liters per palm to raise moisture to 45%.",
  ].filter(Boolean);

  const long_term_plan = [
    "Adopt monthly farmyard manure applications to build organic carbon.",
    "Practice multi-tier cropping with legumes for natural nitrogen gain.",
    "Schedule annual gypsum to keep calcium balanced.",
    "Install mulch + drip for moisture retention.",
  ];

  return {
    overall_health: zincLow
      ? "Watch Zinc & Sulfur"
      : nitrogenLow
        ? "Nitrogen Hungry Soil"
        : "Balanced Soil Profile",
    health_score: calcHealthScore(test),
    nutrient_status,
    fertilizer_recommendations,
    organic_amendments,
    suitable_crops: suitable,
    avoid_crops: avoid,
    current_crop_advice: test.current_crop
      ? `Maintain ${test.current_crop} with 45-55% moisture, shade 40%, and monthly micronutrient spray.`
      : "",
    immediate_actions,
    long_term_plan,
    warnings: [
      zincLow && "Zinc levels critically low; correct within a week.",
      sulfurLow && "Sulfur deficiency may limit oil synthesis.",
    ].filter(Boolean),
  };
};

export const predictYield = async ({ test, crop, rainfall, temperature }) => {
  await wait(500);
  if (!test) {
    throw new Error("Select a soil test to run the model.");
  }
  const baseYield = 6;
  const moistureFactor = clamp((test.moisture - 25) / 50, 0.6, 1.1);
  const nitrogenFactor = clamp(test.nitrogen / 320, 0.5, 1.15);
  const rainFactor = clamp(rainfall / 1200, 0.6, 1.1);
  const tempFactor = clamp(1 - Math.abs(temperature - 28) / 40, 0.7, 1.05);

  const predicted = +(baseYield * moistureFactor * nitrogenFactor * rainFactor * tempFactor).toFixed(2);
  const limiting = [];
  if (test.nitrogen < 250) limiting.push({ factor: "Nitrogen", severity: "High", impact: "Trim roots yield by 18% unless corrected." });
  if (test.moisture < 35) limiting.push({ factor: "Moisture", severity: "Medium", impact: "Irrigation needed to stabilize yield." });
  if (rainfall < 900) limiting.push({ factor: "Rainfall Forecast", severity: "Medium", impact: "Plan supplemental irrigation." });

  return {
    predictedYield: predicted,
    confidence: clamp(78 + Math.random() * 12, 60, 95).toFixed(0),
    limitingFactors: limiting,
    strategies: [
      "Apply 12 kg SSP + 8 kg MOP per acre in split doses.",
      "Maintain mulch thickness of 5 cm to conserve moisture.",
      "Introduce drip fertigation for uniform feeding.",
    ],
    optimalTargets: {
      nitrogen: "280-420 mg/kg",
      phosphorus: "40-70 mg/kg",
      potassium: "220-320 mg/kg",
    },
    risks: [
      "Watch for bud rot during prolonged humidity.",
      "Monitor sucking pests if potassium dips below 200.",
    ],
  };
};

export const detectDisease = async ({ description, imageMeta }) => {
  await wait(700);
  if (!description) {
    throw new Error("Provide visual notes or symptoms.");
  }
  const suspectBLB = /spot|yellow|patch/i.test(description);
  const datasetHit =
    diseaseDataset.find((entry) =>
      entry.visual_signatures.some((token) =>
        description.toLowerCase().includes(token) ||
        imageMeta?.fileName?.toLowerCase().includes(token) ||
        imageMeta?.crop?.toLowerCase().includes(entry.crop.toLowerCase())
      )
    ) || diseaseDataset[0];
  return {
    disease_detected: suspectBLB,
    dataset_id: datasetHit.id,
    disease_name: suspectBLB ? datasetHit.disease_name : "Nutritional Stress",
    cause_type: suspectBLB ? datasetHit.cause_type : "Physiological",
    infection_stage: suspectBLB ? "Early-Moderate" : "Early",
    severity: suspectBLB ? "Medium" : "Low",
    visual_features_observed: [
      "Dark brown concentric lesions",
      "Yellowing halos around spots",
      "Irregular blotches spreading along veins",
    ],
    symptoms: [
      "Wilting on leaf margins",
      "Uneven color distribution",
      "Isolated drying patches",
    ],
    nutrient_deficiencies: ["Possible Zinc imbalance", "Magnesium marginally low"],
    pest_indicators: ["Check for thrips/mites under the leaves"],
    treatment_plan: [
      { action: "Spray 0.5% Copper Oxychloride", timing: "Immediate", dosage: "2.5 g/liter" },
      { action: "Follow-up with 0.3% Mancozeb", timing: "After 7 days", dosage: "3 g/liter" },
      { action: "Add 5 kg neem cake per acre", timing: "Soil drench", dosage: "Single dose" },
    ],
    preventive_measures: [
      "Ensure 40-50% shade to reduce scorch",
      "Avoid overhead irrigation at night",
      "Sterilize pruning tools",
    ],
    recovery_time: suspectBLB ? "10-14 days with treatment" : "5-7 days",
    spread_risk: suspectBLB ? "Moderate" : "Low",
    additional_notes: "Integrate biocontrol agents like Trichoderma for sustained protection.",
    accuracy: datasetHit.accuracy,
    confidenceNarrative: `Ensemble (EfficientNet-B4 + ViT-Lite) retrained on 25k real-world ${datasetHit.crop} leaf scans reports ${(datasetHit.accuracy * 100).toFixed(1)}% precision for this class.`,
    image_processing_steps: [
      "Step 1: Normalize image & remove background noise",
      "Step 2: Apply leaf-mask segmentation + Grad-CAM heatmap",
      "Step 3: Compare lesion vectors with curated dataset embeddings",
      "Step 4: Classify cause (fungal/bacterial/nutrient) via ensemble CNN + LightGBM",
    ],
    nutrient_deficiency_prediction: datasetHit.nutrient_flags,
  };
};

export const generateFertilizerPlan = async ({ test, crop, area }) => {
  await wait(500);
  if (!test) throw new Error("Select a soil test first.");
  const requirementFactor = (area || 1);
  const nitrogenGap = Math.max(0, 320 - (test.nitrogen || 0));
  const phosphorusGap = Math.max(0, 45 - (test.phosphorus || 0));
  const potassiumGap = Math.max(0, 240 - (test.potassium || 0));

  return {
    requirements: {
      nitrogen: +(nitrogenGap * 0.8 * requirementFactor).toFixed(1),
      phosphorus: +(phosphorusGap * 1.2 * requirementFactor).toFixed(1),
      potassium: +(potassiumGap * 0.9 * requirementFactor).toFixed(1),
    },
    chemical: [
      { product: "Urea", ratio: "46-0-0", amount: `${(nitrogenGap * 0.5 * requirementFactor).toFixed(1)} kg` },
      { product: "SSP", ratio: "0-16-0", amount: `${(phosphorusGap * 2.2 * requirementFactor).toFixed(1)} kg` },
      { product: "MOP", ratio: "0-0-60", amount: `${(potassiumGap * 1.4 * requirementFactor).toFixed(1)} kg` },
    ],
    organic: [
      { product: "Compost", amount: `${(1.8 * requirementFactor).toFixed(1)} tons` },
      { product: "Vermi-wash foliar", amount: "7-10 ml/liter" },
    ],
    schedule: [
      { phase: "Week 1", detail: "Apply 50% basal dose with irrigation" },
      { phase: "Week 3", detail: "Apply remaining urea + micronutrient mix" },
      { phase: "Week 5", detail: "Foliar spray of 19:19:19 @ 5 g/liter" },
    ],
    costEstimate: `₹${(requirementFactor * 5200).toLocaleString("en-IN")}`,
  };
};

export const generateIrrigationPlan = async ({ moisture, soilType, crop }) => {
  await wait(400);
  const baseMoisture = moisture || 38;
  const days = Array.from({ length: 7 }).map((_, idx) => {
    const forecast = clamp(baseMoisture - idx * 2 + Math.sin(idx) * 3, 25, 70);
    return {
      day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][idx],
      predicted: forecast,
      irrigate: forecast < 40,
      amount: forecast < 35 ? "2.5 L/plant" : forecast < 45 ? "1.5 L/plant" : "Monitor",
      bestTime: forecast < 40 ? "06:00 - 08:00" : "Evening only",
    };
  });
  return {
    crop: crop || "Generic Crop",
    soilType: soilType || "Loamy",
    days,
    critical: days.filter((d) => d.predicted < 35).map((d) => `${d.day}: Raise moisture to 45%`),
    tips: [
      "Mulch with dry leaves to reduce evaporation by 20%",
      "Use tensiometers to trigger irrigation precisely",
      "Avoid afternoon irrigation to reduce stress",
    ],
  };
};

export const forecastNutrients = async ({ test }) => {
  await wait(400);
  if (!test) throw new Error("Select a soil test for forecasting.");
  const horizon = [0, 15, 30, 60, 90];
  return horizon.map((day) => ({
    day,
    nitrogen: clamp((test.nitrogen || 250) - day * 1.8, 60, 320),
    phosphorus: clamp((test.phosphorus || 40) - day * 0.6, 5, 80),
    potassium: clamp((test.potassium || 210) - day * 1.2, 50, 300),
  }));
};

export const planRotation = async ({ test }) => {
  await wait(450);
  if (!test) throw new Error("Select a soil test to build rotation.");
  return [
    {
      season: "Year 1 - Kharif",
      crop: "Cowpea + Green Gram mix",
      reason: "Legumes fix nitrogen and improve soil tilth.",
      nutrient_impact: "Adds ~25 kg/acre nitrogen naturally.",
      expected_yield: "1.5 t/acre",
    },
    {
      season: "Year 2 - Rabi",
      crop: "Turmeric",
      reason: "High-value crop thriving in medium N & K soils.",
      nutrient_impact: "Deep rhizomes open up soil structure.",
      expected_yield: "3.8 t/acre",
    },
    {
      season: "Year 3 - Summer",
      crop: "Maize + Fodder intercropping",
      reason: "Balances nutrient demand; market steady.",
      nutrient_impact: "Utilizes residual phosphorus efficiently.",
      expected_yield: "5.1 t/acre (green biomass)",
    },
  ];
};

export const askExpert = async ({ question, test, sensor, provider = "OpenAI" }) => {
  await wait(600);
  if (!question) throw new Error("Ask a question to the expert assistant.");
  const contextLines = [
    test && `Latest soil test (${test.test_name}) shows N=${test.nitrogen} mg/kg, Zn=${test.zinc} mg/kg.`,
    sensor && `Live sensor ${sensor.sensor_id} moisture ${sensor.moisture}%.`,
  ]
    .filter(Boolean)
    .join(" ");
  return `🤖 Model: ${provider}\n${contextLines}\n`
    + `• ${question.trim()}\n`
    + "• Maintain moisture between 45-55% and apply micronutrient foliar spray (ZnSO₄ 0.5%) next cloudy morning.\n"
    + "• Split nitrogen into 3 equal doses with irrigation to avoid leaching.\n"
    + "• Introduce legume cover crops post-harvest for organic carbon build-up.";
};

export const generateSmartInsights = async ({ tests = [], sensors = [] }) => {
  await wait(500);
  const latestTest = tests[0];
  if (!latestTest) {
    return {
      insights: [],
      chartData: [],
      featureImportance: [],
      explainability: "",
    };
  }
  const chartData = tests.slice(0, 5).reverse().map((test) => ({
    date: test.test_date,
    health: calcHealthScore(test),
    moisture: test.moisture,
    nitrogen: test.nitrogen,
  }));
  const featureImportance = [
    { feature: "Moisture", weight: 0.31 },
    { feature: "pH", weight: 0.22 },
    { feature: "Nitrogen", weight: 0.19 },
    { feature: "Zinc", weight: 0.16 },
    { feature: "Sensor variability", weight: 0.12 },
  ];
  const explainability =
    "Grad-CAM overlays show stress concentrated on lower leaves; SHAP plot ranks moisture and zinc as top drivers of yield risk.";
  const insights = [
    `Health score projected to ${calcHealthScore(latestTest) + 4} in 7 days with planned interventions.`,
    `Moisture trend indicates a downward drift of 4% in the next 48 hours.`,
    `Sensor set ${sensors[0]?.sensor_id || "N/A"} flagged conductivity spike → flush irrigation recommended.`,
  ];
  return {
    insights,
    chartData,
    featureImportance,
    explainability,
  };
};

export const fetchWeatherForecast = async ({
  latitude = defaultFarmLocation.latitude,
  longitude = defaultFarmLocation.longitude,
} = {}) => {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max&timezone=auto`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Weather API unavailable. Try again soon.");
  }
  const data = await response.json();
  const daily = data.daily?.time?.map((date, idx) => ({
    date,
    tempMax: data.daily.temperature_2m_max[idx],
    tempMin: data.daily.temperature_2m_min[idx],
    rain: data.daily.precipitation_sum[idx],
    rainProb: data.daily.precipitation_probability_max?.[idx],
  })) || [];
  return {
    location: defaultFarmLocation.name,
    current: data.current_weather,
    daily,
  };
};

export const documentationText = `
═══════════════════════════════════════════════════════════════════════════════
 SoIL NUTRIENT INTELLIGENCE PLATFORM
 Fully offline demo replicating the Base44 feature set.
═══════════════════════════════════════════════════════════════════════════════
`;

