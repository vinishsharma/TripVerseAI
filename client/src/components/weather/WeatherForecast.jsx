function formatDate(date) {
  return new Intl.DateTimeFormat(undefined, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
  }).format(new Date(`${date}T12:00:00Z`))
}

function Temperature({ value }) {
  return value === null ? '—' : `${Math.round(value)}°`
}

function WeatherForecast({ weather, destination }) {
  if (!weather) {
    return (
      <p className="mt-6 rounded-2xl bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
        This itinerary was created without a live forecast. Restart the backend, then generate a new itinerary to load weather data.
      </p>
    )
  }

  if (weather.warning || weather.daily.length === 0) {
    return <p className="mt-6 rounded-2xl bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">{weather.warning ?? 'A live forecast is not available for this itinerary.'}</p>
  }

  return (
    <section className="mt-6 rounded-2xl border border-emerald-950/8 bg-[#f5f9f5] p-4 sm:p-5">
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold tracking-[0.14em] text-[#d86532] uppercase">Live weather forecast</p>
          <h3 className="mt-1 text-lg font-black text-[#123c2b]">Weather in {destination}</h3>
        </div>
        <p className="text-xs text-[#668070]">{weather.timezone} · {weather.attribution}</p>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {weather.daily.map((day) => (
          <article className="rounded-xl bg-white p-3.5 shadow-sm" key={day.date}>
            <p className="text-xs font-bold text-[#577262]">{formatDate(day.date)}</p>
            <div className="mt-2 flex items-center gap-2"><span className="text-2xl" aria-hidden="true">{day.icon}</span><p className="text-sm font-bold text-[#264c3b]">{day.condition}</p></div>
            <p className="mt-3 text-lg font-black text-[#123c2b]"><Temperature value={day.highCelsius} /><span className="mx-1 text-sm font-medium text-[#8ba294]">/</span><span className="text-sm font-bold text-[#668070]"><Temperature value={day.lowCelsius} /></span></p>
            <p className="mt-1 text-xs text-[#668070]">Rain chance: {day.precipitationProbability === null ? '—' : `${Math.round(day.precipitationProbability)}%`}</p>
          </article>
        ))}
      </div>

      <p className="mt-4 text-xs leading-5 text-[#668070]">Forecasts can change. Check local conditions again shortly before you travel.</p>
    </section>
  )
}

export default WeatherForecast
