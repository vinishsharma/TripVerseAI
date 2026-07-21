const NOMINATIM_ENDPOINT = 'https://nominatim.openstreetmap.org/search'
const OVERPASS_ENDPOINT = 'https://overpass-api.de/api/interpreter'
const USER_AGENT = 'TripVerseAI/0.1 (educational travel planner)'
const NOMINATIM_MINIMUM_INTERVAL_MS = 1100

let lastNominatimRequestAt = 0

function wait(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds))
}

async function fetchJson(url, options = {}, timeoutMilliseconds = 15_000) {
  const response = await fetch(url, {
    ...options,
    headers: {
      Accept: 'application/json',
      'User-Agent': USER_AGENT,
      ...options.headers,
    },
    signal: AbortSignal.timeout(timeoutMilliseconds),
  })

  if (!response.ok) {
    throw new Error(`Map data request failed with status ${response.status}.`)
  }

  return response.json()
}

async function geocode(locationName) {
  const timeSinceLastRequest = Date.now() - lastNominatimRequestAt

  if (timeSinceLastRequest < NOMINATIM_MINIMUM_INTERVAL_MS) {
    await wait(NOMINATIM_MINIMUM_INTERVAL_MS - timeSinceLastRequest)
  }

  const searchParameters = new URLSearchParams({
    q: locationName,
    format: 'jsonv2',
    limit: '1',
  })

  lastNominatimRequestAt = Date.now()
  const matches = await fetchJson(`${NOMINATIM_ENDPOINT}?${searchParameters.toString()}`)
  const match = matches[0]

  if (!match) {
    throw new Error(`Could not find “${locationName}” on OpenStreetMap.`)
  }

  return {
    label: locationName,
    displayName: match.display_name,
    latitude: Number(match.lat),
    longitude: Number(match.lon),
  }
}

function distanceInKilometres(from, to) {
  const earthRadiusKm = 6371
  const latitudeDelta = ((to.latitude - from.latitude) * Math.PI) / 180
  const longitudeDelta = ((to.longitude - from.longitude) * Math.PI) / 180
  const a = Math.sin(latitudeDelta / 2) ** 2
    + Math.cos((from.latitude * Math.PI) / 180)
      * Math.cos((to.latitude * Math.PI) / 180)
      * Math.sin(longitudeDelta / 2) ** 2

  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function formatAddress(tags) {
  if (tags['addr:full']) {
    return tags['addr:full']
  }

  const street = [tags['addr:housenumber'], tags['addr:street']].filter(Boolean).join(' ')
  const locality = [tags['addr:suburb'], tags['addr:city'], tags['addr:postcode']].filter(Boolean).join(', ')
  return [street, locality].filter(Boolean).join(', ') || 'Address not available in OpenStreetMap'
}

function normalizePlace(element, destination) {
  const latitude = element.lat ?? element.center?.lat
  const longitude = element.lon ?? element.center?.lon
  const tags = element.tags ?? {}

  if (!tags.name || !Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return null
  }

  const place = {
    osmType: element.type,
    osmId: element.id,
    category: tags.tourism === 'hotel' ? 'hotel' : 'restaurant',
    name: tags.name,
    address: formatAddress(tags),
    latitude,
    longitude,
  }

  return {
    ...place,
    distanceKm: Number(distanceInKilometres(destination, place).toFixed(1)),
  }
}

async function findNearbyPlaces(destination) {
  const query = `[out:json][timeout:25];
(
  nwr["tourism"="hotel"](around:7000,${destination.latitude},${destination.longitude});
  nwr["amenity"="restaurant"](around:7000,${destination.latitude},${destination.longitude});
);
out center;`

  const body = new URLSearchParams({ data: query })
  const result = await fetchJson(
    OVERPASS_ENDPOINT,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
      body,
    },
    30_000,
  )

  const places = result.elements.map((element) => normalizePlace(element, destination)).filter(Boolean)
  const byDistance = (first, second) => first.distanceKm - second.distanceKm

  return {
    hotels: places.filter((place) => place.category === 'hotel').sort(byDistance).slice(0, 8),
    restaurants: places.filter((place) => place.category === 'restaurant').sort(byDistance).slice(0, 8),
  }
}

export async function findPlacesForTrip({ from, to }) {
  const origin = await geocode(from)
  const destination = await geocode(to)

  try {
    const nearbyPlaces = await findNearbyPlaces(destination)

    return {
      source: 'OpenStreetMap',
      attribution: '© OpenStreetMap contributors',
      origin,
      destination,
      ...nearbyPlaces,
    }
  } catch (error) {
    return {
      source: 'OpenStreetMap',
      attribution: '© OpenStreetMap contributors',
      warning: 'The itinerary is ready, but nearby hotels and restaurants could not be loaded right now.',
      origin,
      destination,
      hotels: [],
      restaurants: [],
    }
  }
}
