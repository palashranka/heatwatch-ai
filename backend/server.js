const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Configuration
const ML_SERVICE_URL = "http://localhost:5000";
const WEATHER_API_URL = "https://api.open-meteo.com/v1";

// Load Pune data
const puneData = require("./data/pune_data.json");

// Helper function
function getRiskColor(riskLevel) {
  const colors = {
    0: "#4ade80",
    1: "#fbbf24",
    2: "#fb923c",
    3: "#ef4444",
  };
  return colors[riskLevel] || "#gray";
}

// Routes
app.get("/", (req, res) => {
  res.json({
    message: "Heatwave Risk Prediction API",
    version: "1.0",
    endpoints: [
      "GET /api/risk-map",
      "GET /api/risk-forecast",
      "GET /api/pincode/:pincode",
      "GET /api/statistics",
      "GET /api/high-risk-areas",
    ],
  });
});

// Get current risk map
app.get("/api/risk-map", async (req, res) => {
  try {
    console.log("🔍 Fetching localized weather data for all pincodes...");

    const riskMap = [];

    // Loop through every pincode in Pune data
    for (const p of puneData.pincodes) {
      // Get localized weather for this pincode
      const weather = await axios.get(
        `${WEATHER_API_URL}/forecast?latitude=${p.latitude}&longitude=${p.longitude}&daily=temperature_2m_max,relative_humidity_2m_max&timezone=Asia/Kolkata&forecast_days=1`
      );

      const temp = weather.data.daily?.temperature_2m_max?.[0];
      const humidity = weather.data.daily?.relative_humidity_2m_max?.[0];

      // Safety check
      if (temp === undefined || humidity === undefined) {
        console.warn(`⚠️  Weather missing for ${p.pincode}`);
        continue;
      }

      // Predict heatwave risk for this area
      const prediction = await axios.post(`${ML_SERVICE_URL}/predict`, {
        temperature: temp,
        humidity: humidity,
        population: p.population,
        elderly_percent: p.elderly_percent,
        literacy_rate: p.literacy_rate,
      });

      // Combine data
      riskMap.push({
        pincode: p.pincode,
        latitude: p.latitude,
        longitude: p.longitude,
        temperature: temp,
        humidity: humidity,
        risk_level: prediction.data.risk_level,
        risk_label: prediction.data.risk_label,
        color: prediction.data.color,
        population: p.population,
        elderly_percent: p.elderly_percent,
      });
    }

    res.json({
      date: new Date().toISOString().split("T")[0],
      total_areas: riskMap.length,
      risk_map: riskMap,
    });
  } catch (error) {
    console.error("❌ Error in /api/risk-map:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// Get risk forecast
app.get("/api/risk-forecast", async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 5;

    // Get weather forecast
    const weather = await axios.get(
      `${WEATHER_API_URL}/forecast?latitude=18.52&longitude=73.86&daily=temperature_2m_max,relative_humidity_2m_max&timezone=Asia/Kolkata&forecast_days=${days}`
    );

    const forecastData = [];

    // For each day
    for (let i = 0; i < days; i++) {
      const temp = weather.data.daily.temperature_2m_max[i];
      const humidity = weather.data.daily.relative_humidity_2m_max[i];
      const date = weather.data.daily.time[i];

      // Prepare predictions for all pincodes
      const predictions = puneData.pincodes.map((p) => ({
        temperature: temp,
        humidity: humidity,
        population: p.population,
        elderly_percent: p.elderly_percent,
        literacy_rate: p.literacy_rate,
      }));

      // Get ML predictions
      const mlResponse = await axios.post(`${ML_SERVICE_URL}/predict-bulk`, {
        predictions,
      });

      // Add to forecast
      puneData.pincodes.forEach((pincode, index) => {
        forecastData.push({
          date: date,
          pincode: pincode.pincode,
          latitude: pincode.latitude,
          longitude: pincode.longitude,
          temperature: temp,
          humidity: humidity,
          risk_level: mlResponse.data.predictions[index].risk_level,
          risk_label: mlResponse.data.predictions[index].risk_label,
          color: mlResponse.data.predictions[index].color,
        });
      });
    }

    res.json({
      forecast_days: days,
      total_predictions: forecastData.length,
      forecast: forecastData,
    });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// Get pincode details
app.get("/api/pincode/:pincode", async (req, res) => {
  try {
    const pincode = parseInt(req.params.pincode);
    const pincodeData = puneData.pincodes.find((p) => p.pincode === pincode);

    if (!pincodeData) {
      return res.status(404).json({ error: "Pincode not found" });
    }

    // Get current weather
    const weather = await axios.get(
      `${WEATHER_API_URL}/forecast?latitude=${pincodeData.latitude}&longitude=${pincodeData.longitude}&daily=temperature_2m_max,relative_humidity_2m_max&timezone=Asia/Kolkata&forecast_days=7`
    );

    // Get predictions for each day
    const forecast = [];
    for (let i = 0; i < 7; i++) {
      const temp = weather.data.daily.temperature_2m_max[i];
      const humidity = weather.data.daily.relative_humidity_2m_max[i];

      const prediction = await axios.post(`${ML_SERVICE_URL}/predict`, {
        temperature: temp,
        humidity: humidity,
        population: pincodeData.population,
        elderly_percent: pincodeData.elderly_percent,
        literacy_rate: pincodeData.literacy_rate,
      });

      forecast.push({
        date: weather.data.daily.time[i],
        temperature: temp,
        humidity: humidity,
        risk_level: prediction.data.risk_level,
        risk_label: prediction.data.risk_label,
      });
    }

    res.json({
      pincode: pincode,
      location: {
        latitude: pincodeData.latitude,
        longitude: pincodeData.longitude,
      },
      demographics: {
        population: pincodeData.population,
        elderly_percent: pincodeData.elderly_percent,
        literacy_rate: pincodeData.literacy_rate,
      },
      current_risk: forecast[0],
      forecast: forecast,
    });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// Get statistics
app.get("/api/statistics", async (req, res) => {
  try {
    // Get current risk map data
    const riskMapResponse = await axios.get(
      `http://localhost:${PORT}/api/risk-map`
    );
    const riskMap = riskMapResponse.data.risk_map;

    // Calculate statistics
    const riskDistribution = {};
    let totalPopulation = 0;
    let highRiskPopulation = 0;

    riskMap.forEach((area) => {
      const label = area.risk_label;
      riskDistribution[label] = (riskDistribution[label] || 0) + 1;
      totalPopulation += area.population;
      if (area.risk_level >= 2) {
        highRiskPopulation += area.population;
      }
    });

    const avgTemp =
      riskMap.reduce((sum, a) => sum + a.temperature, 0) / riskMap.length;
    const avgHumidity =
      riskMap.reduce((sum, a) => sum + a.humidity, 0) / riskMap.length;

    res.json({
      date: riskMapResponse.data.date,
      total_areas: riskMap.length,
      risk_distribution: riskDistribution,
      average_temperature: avgTemp.toFixed(1),
      average_humidity: avgHumidity.toFixed(1),
      high_risk_areas: riskMap.filter((a) => a.risk_level >= 2).length,
      affected_population: highRiskPopulation,
    });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// Get high-risk areas
app.get("/api/high-risk-areas", async (req, res) => {
  try {
    const threshold = parseInt(req.query.threshold) || 2;

    const riskMapResponse = await axios.get(
      `http://localhost:${PORT}/api/risk-map`
    );
    const riskMap = riskMapResponse.data.risk_map;

    const highRiskAreas = riskMap
      .filter((area) => area.risk_level >= threshold)
      .map((area) => ({
        ...area,
        vulnerable_population: Math.round(
          (area.population * area.elderly_percent) / 100
        ),
      }))
      .sort(
        (a, b) =>
          b.risk_level - a.risk_level ||
          b.vulnerable_population - a.vulnerable_population
      );

    res.json({
      total_high_risk_areas: highRiskAreas.length,
      threshold: threshold,
      areas: highRiskAreas,
    });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 API Docs: http://localhost:${PORT}/`);
});
