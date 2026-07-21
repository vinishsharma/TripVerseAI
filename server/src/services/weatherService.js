const FORECAST_ENDPOINT = 'https://api.open-meteo.com/v1/forecast'

const weatherConditions = {
  0: { label: 'Clear sky', icon: '☀️' },
  1: { label: 'Mainly clear', icon: '🌤️' },
  2: { label: 'Partly cloudy', icon: '⛅' },
  3: { label: 'Overcast', icon: '☁️' },
  45: { label: 'Foggy', icon: '🌫️' },
  48: { label: 'Rime fog', icon: '🌫️' },
  51: { label: 'Light drizzle', icon: '🌦️' },
  53: { label: 'Drizzle', icon: '🌦️' },
  55: { label: 'Heavy drizzle', icon: '🌧️' },
  56: { label: 'Freezing drizzle', icon: '🌧️' },
  57: { label: 'Heavy freezing drizzle', icon: '🌧️' },
  61: { label: 'Slight rain', icon: '🌦️' },
  63: { label: 'Rain', icon: '🌧️' },
  65: { label: 'Heavy rain', icon: '🌧️' },
  66: { label: 'Freezing rain', icon: '🌧️' },
  67: { label: 'Heavy freezing rain', icon: '🌧️' },
  71: { label: 'Light snow', icon: '🌨️' },
  73: { label: 'Snow', icon: '🌨️' },
  75: { label: 'Heavy snow', icon: '🌨️' },
  77: { label: 'Snow grains', icon: '🌨️' },
  80: { label: 'Rain showers', icon: '🌦️' },
  81: { label: 'Rain showers', icon: '🌧️' },
  82: { label: 'Heavy rain showers', icon: '🌧️' },
  85: { label: 'Snow showers', icon: '🌨️' },
  86: { label: 'Heavy snow showers', icon: '🌨️' },
  95: { label: 'Thunderstorm', icon: '⛈️' },
  96: { label: 'Thunderstorm with hail', icon: '⛈️' },
  99: { label: 'Severe thunderstorm with hail', icon: '⛈️' },
}

function getCondition(weatherCode) {
  return weatherConditions[weatherCode] ?? { label: 'Conditions unavailable', icon: '🌡️' }
}

function toOneDecimal(value) {
  return typeof value === 'number' && Number.isFinite(value) ? Number(value.toFixed(1)) : null
}

function createForecastUrl({ latitude, longitude, startDate, endDate }) {
  const parameters = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max',
    timezone: 'auto',
    start_date: startDate,
    end_date: endDate,
  })

  return `${FORECAST_ENDPOINT}?${parameters.toString()}`
}

function parseDailyForecast(payload) {
  const daily = payload?.daily

  if (!daily || !Array.isArray(daily.time)) {
    throw new Error('Weather data was returned in an unexpected format.')
  }

  const forecast = daily.time.map((date, index) => {
    const weatherCode = daily.weather_code?.[index]
    const condition = getCondition(weatherCode)

    return {
      date,
      condition: condition.label,
      icon: condition.icon,
      highCelsius: toOneDecimal(daily.temperature_2m_max?.[index]),
      lowCelsius: toOneDecimal(daily.temperature_2m_min?.[index]),
      precipitationProbability: toOneDecimal(daily.precipitation_probability_max?.[index]),
    }
  })

  if (forecast.length === 0) {
    throw new Error('No weather forecast is available for these dates.')
  }

  return forecast
}

export async function getDestinationWeather({ destination, startDate, endDate }) {
  if (!Number.isFinite(destination?.latitude) || !Number.isFinite(destination?.longitude)) {
    throw new Error('Destination coordinates are unavailable for weather lookup.')
  }

  const response = await fetch(
    createForecastUrl({
      latitude: destination.latitude,
      longitude: destination.longitude,
      startDate,
      endDate,
    }),
    {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(10_000),
    },
  )

  if (!response.ok) {
    throw new Error(`Weather data request failed with status ${response.status}.`)
  }

  const payload = await response.json()

  return {
    source: 'Open-Meteo',
    attribution: 'Weather data by Open-Meteo.com',
    timezone: payload.timezone ?? 'local time',
    daily: parseDailyForecast(payload),
  }
}
