import { useEffect } from 'react'
import { CircleMarker, MapContainer, Popup, TileLayer, Tooltip, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

const markerStyles = {
  origin: { color: '#32634c', label: 'From' },
  destination: { color: '#123c2b', label: 'To' },
  hotel: { color: '#d86532', label: 'Hotel' },
  restaurant: { color: '#bd5b40', label: 'Restaurant' },
}

function MapViewport({ destination }) {
  const map = useMap()

  useEffect(() => {
    map.setView([destination.latitude, destination.longitude], 12)
  }, [destination, map])

  return null
}

function PlaceMarker({ place, type }) {
  const style = markerStyles[type]

  return (
    <CircleMarker center={[place.latitude, place.longitude]} pathOptions={{ color: style.color, fillColor: style.color, fillOpacity: 0.82 }} radius={type === 'destination' ? 10 : 7}>
      <Tooltip>{place.name ?? place.label}</Tooltip>
      <Popup>
        <p className="m-0 font-bold">{place.name ?? place.label}</p>
        {place.address && <p className="mt-1 mb-0 text-sm">{place.address}</p>}
        {typeof place.distanceKm === 'number' && <p className="mt-1 mb-0 text-sm">{place.distanceKm} km from the destination centre</p>}
      </Popup>
    </CircleMarker>
  )
}

function PlaceList({ title, places, type }) {
  return (
    <section className="rounded-2xl border border-emerald-950/8 p-4">
      <h4 className="text-sm font-black text-[#264c3b]">{title}</h4>
      {places.length === 0 ? <p className="mt-2 text-sm leading-6 text-[#668070]">No named results were available nearby in OpenStreetMap.</p> : <ul className="mt-2 divide-y divide-emerald-950/8">{places.map((place) => <li className="py-3 first:pt-1" key={`${place.osmType}-${place.osmId}`}><a className="font-bold text-[#32634c] hover:underline" href={`https://www.openstreetmap.org/${place.osmType}/${place.osmId}`} target="_blank" rel="noreferrer">{place.name}</a><p className="mt-0.5 text-sm leading-5 text-[#668070]">{place.address}</p><p className="mt-1 text-xs font-bold text-[#d86532]">{place.distanceKm} km away</p></li>)}</ul>}
    </section>
  )
}

function DestinationPlacesMap({ places }) {
  if (!places) {
    return (
      <p className="mt-6 rounded-2xl bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
        This itinerary was created without live map places. Restart the backend, then generate a new itinerary to load nearby hotels and restaurants.
      </p>
    )
  }

  if (places.warning || !places.destination) {
    return <p className="mt-6 rounded-2xl bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">{places.warning ?? 'Live map places are not available for this itinerary.'}</p>
  }

  const allMarkers = [
    { ...places.origin, type: 'origin' },
    { ...places.destination, name: places.destination.label, type: 'destination' },
    ...places.hotels.map((place) => ({ ...place, type: 'hotel' })),
    ...places.restaurants.map((place) => ({ ...place, type: 'restaurant' })),
  ]

  return (
    <section className="mt-6 overflow-hidden rounded-2xl border border-emerald-950/8">
      <div className="flex flex-col justify-between gap-2 bg-[#123c2b] px-4 py-4 text-white sm:flex-row sm:items-center">
        <div><p className="text-xs font-bold tracking-[0.14em] text-[#f3c676] uppercase">Live map data</p><h3 className="mt-1 text-lg font-black">Hotels and restaurants near {places.destination.label}</h3></div>
        <span className="text-xs text-emerald-100/70">{places.attribution}</span>
      </div>
      <MapContainer className="h-85 w-full" center={[places.destination.latitude, places.destination.longitude]} zoom={12} scrollWheelZoom>
        <MapViewport destination={places.destination} />
        <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>' url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {allMarkers.map((marker) => <PlaceMarker key={`${marker.type}-${marker.osmType ?? marker.label}-${marker.osmId ?? marker.latitude}`} place={marker} type={marker.type} />)}
      </MapContainer>
      <div className="grid gap-4 bg-white p-4 sm:grid-cols-2">
        <PlaceList title="Nearby hotels" places={places.hotels} type="hotel" />
        <PlaceList title="Nearby restaurants" places={places.restaurants} type="restaurant" />
      </div>
    </section>
  )
}

export default DestinationPlacesMap
