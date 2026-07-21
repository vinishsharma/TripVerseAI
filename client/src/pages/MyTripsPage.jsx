import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api.js'

function getErrorMessage(error) {
  return error.response?.data?.message ?? error.message ?? 'We could not load your saved trips. Please try again.'
}

function formatDate(date) {
  return new Intl.DateTimeFormat(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${date}T12:00:00Z`))
}

function formatSavedAt(date) {
  return new Intl.DateTimeFormat(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date))
}

function MyTripsPage() {
  const [trips, setTrips] = useState([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    async function loadTrips() {
      try {
        const response = await api.get('/trips')
        setTrips(response.data.data.trips)
      } catch (requestError) {
        setError(getErrorMessage(requestError))
      } finally {
        setIsLoading(false)
      }
    }

    loadTrips()
  }, [])

  async function handleDelete(trip) {
    if (!window.confirm(`Delete “${trip.itinerary.title}”? This cannot be undone.`)) {
      return
    }

    setError('')
    setDeletingId(trip.id)

    try {
      await api.delete(`/trips/${trip.id}`)
      setTrips((currentTrips) => currentTrips.filter((currentTrip) => currentTrip.id !== trip.id))
    } catch (requestError) {
      setError(getErrorMessage(requestError))
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <section className="relative min-h-[72vh] overflow-hidden px-5 py-14 sm:px-8 lg:px-10">
      <div className="absolute inset-x-0 top-0 -z-10 h-90 bg-[radial-gradient(circle_at_18%_5%,rgba(220,240,224,0.9),transparent_27rem)]" />
      <div className="mx-auto max-w-5xl">
        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-xs font-bold tracking-[0.16em] text-[#d86532] uppercase">Your saved journeys</motion.p>
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mt-3 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <h1 className="max-w-2xl text-4xl font-black tracking-[-0.045em] text-[#123c2b] sm:text-5xl">My trips</h1>
            <p className="mt-3 max-w-2xl leading-7 text-[#668070]">Your saved AI itineraries stay private to your account and are ready whenever you return.</p>
          </div>
          <Link className="inline-flex w-fit rounded-xl bg-[#123c2b] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#0c2e20]" to="/planner">Plan another trip</Link>
        </motion.div>

        {error && <p className="mt-7 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700" role="alert">{error}</p>}

        {isLoading && <div className="mt-9 space-y-4">{[1, 2].map((item) => <div className="h-48 animate-pulse rounded-3xl bg-white" key={item} />)}</div>}

        {!isLoading && trips.length === 0 && (
          <div className="mt-9 rounded-3xl border border-white bg-white p-8 text-center shadow-xl shadow-emerald-950/8">
            <p className="text-3xl" aria-hidden="true">✦</p>
            <h2 className="mt-3 text-2xl font-black text-[#123c2b]">No saved trips yet.</h2>
            <p className="mx-auto mt-3 max-w-md leading-7 text-[#668070]">Generate an itinerary you love, then use the Save this trip button to keep it here.</p>
            <Link className="mt-6 inline-flex rounded-xl bg-[#d86532] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#be5528]" to="/planner">Create an itinerary</Link>
          </div>
        )}

        <div className="mt-9 space-y-5">
          {trips.map((trip) => {
            const firstForecast = trip.weather?.daily?.[0]

            return (
              <motion.article initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-white bg-white p-5 shadow-xl shadow-emerald-950/8 sm:p-7" key={trip.id}>
                <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
                  <div>
                    <p className="text-xs font-bold tracking-[0.14em] text-[#d86532] uppercase">{trip.request.from} → {trip.request.to}</p>
                    <h2 className="mt-2 text-2xl font-black tracking-[-0.035em] text-[#123c2b]">{trip.itinerary.title}</h2>
                    <p className="mt-2 max-w-2xl leading-7 text-[#668070]">{trip.itinerary.overview}</p>
                  </div>
                  <button className="w-fit rounded-xl px-3 py-2 text-sm font-bold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-65" type="button" onClick={() => handleDelete(trip)} disabled={deletingId === trip.id}>{deletingId === trip.id ? 'Deleting…' : 'Delete'}</button>
                </div>

                <div className="mt-5 flex flex-wrap gap-2 text-sm font-semibold text-[#466456]">
                  <span className="rounded-full bg-[#edf5ee] px-3 py-1.5">{formatDate(trip.request.startDate)} – {formatDate(trip.request.endDate)}</span>
                  <span className="rounded-full bg-[#fff6ea] px-3 py-1.5">{trip.request.dayCount} days · {trip.request.travelers} traveler{trip.request.travelers === 1 ? '' : 's'}</span>
                  {firstForecast && <span className="rounded-full bg-[#edf5ee] px-3 py-1.5">{firstForecast.icon} {firstForecast.condition}</span>}
                  <span className="rounded-full bg-[#f5f9f5] px-3 py-1.5">Saved {formatSavedAt(trip.createdAt)}</span>
                </div>

                <details className="mt-6 rounded-2xl border border-emerald-950/8 p-4">
                  <summary className="cursor-pointer text-sm font-bold text-[#264c3b]">View day-by-day itinerary</summary>
                  <div className="mt-5 space-y-4">
                    {trip.itinerary.dailyItinerary.map((day) => <section className="border-t border-emerald-950/8 pt-4 first:border-t-0 first:pt-0" key={day.day}><p className="text-xs font-black tracking-[0.13em] text-[#d86532] uppercase">Day {day.day} · {day.area}</p><h3 className="mt-1 font-black text-[#123c2b]">{day.theme}</h3><ul className="mt-3 space-y-2 text-sm leading-6 text-[#668070]">{day.activities.map((activity) => <li key={`${activity.timeOfDay}-${activity.title}`}><span className="font-bold text-[#264c3b]">{activity.timeOfDay}: </span>{activity.title}</li>)}</ul></section>)}
                  </div>
                </details>
              </motion.article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default MyTripsPage
