const randomFromRange = (min, max) =>
  Number((Math.random() * (max - min) + min).toFixed(1));

const fetchWeatherSnapshot = async (location = "Weilburg, Germany") => {
  const baseTemperature = 22;
  const jitter = randomFromRange(-3, 3);
  const temperature = Math.round(baseTemperature + jitter);

  // Simulasi request asinkron
  await new Promise((resolve) => setTimeout(resolve, 750));

  return {
    location,
    temperature,
    condition:
      jitter > 1.5 ? "Sunny" : jitter < -1.5 ? "Cloudy" : "Partly Cloudy",
    humidity: randomFromRange(70, 90),
    windSpeed: randomFromRange(1.5, 4),
    uvIndex: randomFromRange(2, 5),
    tempRange: {
      high: temperature + randomFromRange(6, 12),
      low: temperature - randomFromRange(10, 15),
    },
  };
};

const buildHealthSummary = (sensorPayload = []) => {
  const baseScore = 90;
  const offsets = sensorPayload.map(({ signal = 0 }) => signal);
  const averageOffset =
    offsets.length > 0
      ? offsets.reduce((acc, value) => acc + value, 0) / offsets.length
      : 0;
  const score = Math.min(100, Math.round(baseScore + averageOffset));

  return {
    score,
    label: score > 92 ? "Baik" : "Stabil",
    message:
      score > 93
        ? "Tanamanmu lagi on fire, pertahankan pola nutrisi saat ini."
        : "Kondisi stabil, cek ulang ventilasi untuk jaga kelembapan.",
  };
};

export { fetchWeatherSnapshot, buildHealthSummary };
