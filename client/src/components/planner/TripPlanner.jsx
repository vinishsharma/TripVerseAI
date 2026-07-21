import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";
import DestinationPlacesMap from "../map/DestinationPlacesMap.jsx";
import WeatherForecast from "../weather/WeatherForecast.jsx";
import api from "../../services/api.js";

const interests = [
  "Food",
  "History",
  "Nature",
  "Art",
  "Shopping",
  "Nightlife",
  "Wellness",
  "Adventure",
];
const inputClass =
  "mt-1.5 w-full rounded-xl border border-emerald-950/12 bg-[#fbfdfb] px-3.5 py-3 text-sm text-[#123c2b] outline-none transition placeholder:text-[#8ba294] focus:border-[#32634c] focus:ring-3 focus:ring-emerald-900/10";
const itineraryRequestTimeout = 60_000;

const initialForm = {
  from: "",
  to: "",
  startDate: "",
  endDate: "",
  travelers: 1,
  budget: "moderate",
  interests: [],
  pace: "balanced",
  notes: "",
};

function getErrorMessage(error) {
  if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
    return "Creating this itinerary took longer than one minute. Please try again in a moment.";
  }

  return (
    error.response?.data?.message ??
    error.message ??
    "We could not create your itinerary. Please try again."
  );
}

function FieldLabel({ children }) {
  return (
    <span className="block text-sm font-bold text-[#264c3b]">{children}</span>
  );
}

function TripPlanner() {
  const [form, setForm] = useState(initialForm);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [savedTripId, setSavedTripId] = useState(null);

  function handleChange(event) {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  }

  function toggleInterest(interest) {
    setForm((current) => ({
      ...current,
      interests: current.interests.includes(interest)
        ? current.interests.filter((item) => item !== interest)
        : [...current.interests, interest],
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSaveError("");
    setSavedTripId(null);
    setResult(null);
    setIsSubmitting(true);

    try {
      const response = await api.post(
        "/trips/generate",
        {
          ...form,
          travelers: Number(form.travelers),
          interests: form.interests.map((interest) => interest.toLowerCase()),
        },
        { timeout: itineraryRequestTimeout },
      );
      setResult(response.data.data);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSaveTrip() {
    if (!result || isSaving || savedTripId) {
      return;
    }

    setSaveError("");
    setIsSaving(true);

    try {
      const response = await api.post("/trips", result);
      setSavedTripId(response.data.data.trip.id);
    } catch (requestError) {
      setSaveError(getErrorMessage(requestError));
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.12 }}
      className="mt-9 grid items-start gap-7 xl:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)]"
    >
      <form
        className="rounded-3xl border border-white bg-white p-5 shadow-xl shadow-emerald-950/8 sm:p-7"
        onSubmit={handleSubmit}
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold tracking-[0.14em] text-[#d86532] uppercase">
              Trip details
            </p>
            <h2 className="mt-1 text-2xl font-black tracking-[-0.035em] text-[#123c2b]">
              Build your route
            </h2>
          </div>
          <span
            className="grid size-10 place-items-center rounded-2xl bg-[#eaf4eb] text-lg"
            aria-hidden="true"
          >
            ✦
          </span>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label>
            <FieldLabel>From</FieldLabel>
            <input
              className={inputClass}
              name="from"
              placeholder="Mumbai, India"
              value={form.from}
              onChange={handleChange}
              minLength="2"
              maxLength="120"
              required
            />
          </label>
          <label>
            <FieldLabel>To</FieldLabel>
            <input
              className={inputClass}
              name="to"
              placeholder="Jaipur, India"
              value={form.to}
              onChange={handleChange}
              minLength="2"
              maxLength="120"
              required
            />
          </label>
          <label>
            <FieldLabel>Start date</FieldLabel>
            <input
              className={inputClass}
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            <FieldLabel>End date</FieldLabel>
            <input
              className={inputClass}
              type="date"
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            <FieldLabel>Travelers</FieldLabel>
            <input
              className={inputClass}
              type="number"
              name="travelers"
              min="1"
              max="12"
              value={form.travelers}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            <FieldLabel>Budget</FieldLabel>
            <select
              className={inputClass}
              name="budget"
              value={form.budget}
              onChange={handleChange}
            >
              <option value="budget-friendly">Budget-friendly</option>
              <option value="moderate">Moderate</option>
              <option value="comfortable">Comfortable</option>
              <option value="luxury">Luxury</option>
            </select>
          </label>
        </div>

        <fieldset className="mt-6">
          <legend className="text-sm font-bold text-[#264c3b]">
            What interests you?
          </legend>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {interests.map((interest) => {
              const selected = form.interests.includes(interest);
              return (
                <button
                  className={`rounded-full px-3 py-2 text-xs font-bold transition ${selected ? "bg-[#123c2b] text-white" : "bg-[#edf5ee] text-[#466456] hover:bg-[#dfeee2]"}`}
                  type="button"
                  key={interest}
                  aria-pressed={selected}
                  onClick={() => toggleInterest(interest)}
                >
                  {selected ? "✓ " : ""}
                  {interest}
                </button>
              );
            })}
          </div>
        </fieldset>

        <fieldset className="mt-6">
          <legend className="text-sm font-bold text-[#264c3b]">
            Travel pace
          </legend>
          <div className="mt-2.5 grid grid-cols-3 gap-2">
            {["slow", "balanced", "fast"].map((pace) => (
              <label
                key={pace}
                className={`cursor-pointer rounded-xl border px-3 py-2.5 text-center text-xs font-bold capitalize transition ${form.pace === pace ? "border-[#32634c] bg-[#eaf4eb] text-[#123c2b]" : "border-emerald-950/10 text-[#668070] hover:bg-[#f5f9f5]"}`}
              >
                <input
                  className="sr-only"
                  type="radio"
                  name="pace"
                  value={pace}
                  checked={form.pace === pace}
                  onChange={handleChange}
                />
                {pace}
              </label>
            ))}
          </div>
        </fieldset>

        <label className="mt-6 block">
          <FieldLabel>
            Anything else?{" "}
            <span className="font-medium text-[#84988b]">Optional</span>
          </FieldLabel>
          <textarea
            className={`${inputClass} min-h-24 resize-y`}
            name="notes"
            placeholder="For example: vegetarian food, relaxed mornings, wheelchair access..."
            value={form.notes}
            onChange={handleChange}
            maxLength="600"
          />
        </label>
        {error && (
          <p
            className="mt-5 rounded-xl bg-red-50 px-3.5 py-3 text-sm font-medium text-red-700"
            role="alert"
          >
            {error}
          </p>
        )}
        <button
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#d86532] px-4 py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#be5528] disabled:cursor-not-allowed disabled:opacity-65"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />{" "}
              Designing your trip…
            </>
          ) : (
            <>
              Generate my itinerary <span aria-hidden="true">→</span>
            </>
          )}
        </button>
      </form>

      <div aria-live="polite">
        {isSubmitting && (
          <div className="rounded-3xl border border-white bg-white/80 p-7 shadow-sm">
            <p className="text-xs font-bold tracking-[0.16em] text-[#d86532] uppercase">
              TripVerse AI is thinking
            </p>
            <h2 className="mt-3 text-2xl font-black tracking-[-0.035em] text-[#123c2b]">
              Building a route around what matters to you.
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#668070]">
              This can take up to a minute while we create your itinerary and
              check live map places.
            </p>
            <div className="mt-7 space-y-3">
              {[1, 2, 3].map((item) => (
                <div
                  className="h-14 animate-pulse rounded-2xl bg-[#edf5ee]"
                  key={item}
                />
              ))}
            </div>
          </div>
        )}
        {!isSubmitting && !result && (
          <div className="rounded-3xl bg-[#123c2b] p-7 text-white shadow-xl shadow-emerald-950/12">
            <p className="text-xs font-bold tracking-[0.14em] text-[#f3c676] uppercase">
              Ready when you are
            </p>
            <h2 className="mt-3 text-2xl font-black tracking-[-0.035em]">
              A plan that connects the dots.
            </h2>
            <p className="mt-4 text-sm leading-6 text-emerald-100/70">
              We’ll organize each day by area, match activities to your pace,
              and leave you with practical tips—not a generic checklist.
            </p>
            <div className="mt-8 space-y-3 border-t border-white/10 pt-6 text-sm text-emerald-50/80">
              <p>✦ Day-by-day route</p>
              <p>⌖ Neighbourhood-aware plans</p>
              <p>☼ Practical packing reminders</p>
            </div>
          </div>
        )}
        {result && (
          <ItineraryResult
            result={result}
            onSave={handleSaveTrip}
            isSaving={isSaving}
            savedTripId={savedTripId}
            saveError={saveError}
          />
        )}
      </div>
    </motion.div>
  );
}

function ItineraryResult({ result, onSave, isSaving, savedTripId, saveError }) {
  const { itinerary, request } = result;

  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-white bg-white p-5 shadow-xl shadow-emerald-950/8 sm:p-7"
    >
      <p className="text-xs font-bold tracking-[0.15em] text-[#d86532] uppercase">
        {request.from} → {request.to}
      </p>
      <h2 className="mt-2 text-3xl font-black tracking-[-0.045em] text-[#123c2b]">
        {itinerary.title}
      </h2>
      <p className="mt-3 leading-7 text-[#668070]">{itinerary.overview}</p>
      <div className="mt-6 rounded-2xl bg-[#eaf4eb] p-4 text-sm text-[#355846]">
        <span className="font-bold">Route note: </span>
        {itinerary.routeSummary}
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        {savedTripId ? (
          <>
            <span className="rounded-xl bg-[#eaf4eb] px-4 py-3 text-sm font-bold text-[#264c3b]">✓ Saved to My trips</span>
            <Link className="rounded-xl border border-emerald-950/12 px-4 py-3 text-sm font-bold text-[#264c3b] transition hover:bg-[#f5f9f5]" to="/trips">View My trips</Link>
          </>
        ) : (
          <button className="rounded-xl bg-[#123c2b] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#0c2e20] disabled:cursor-not-allowed disabled:opacity-65" type="button" onClick={onSave} disabled={isSaving}>{isSaving ? 'Saving your trip…' : 'Save this trip'}</button>
        )}
      </div>
      {saveError && <p className="mt-4 rounded-xl bg-red-50 px-3.5 py-3 text-sm font-medium text-red-700" role="alert">{saveError}</p>}
      <WeatherForecast weather={result.weather} destination={request.to} />
      <DestinationPlacesMap places={result.places} />

      <div className="mt-6 space-y-4">
        {itinerary.dailyItinerary.map((day) => (
          <section
            className="rounded-2xl border border-emerald-950/8 p-4 sm:p-5"
            key={day.day}
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="text-xs font-black tracking-[0.13em] text-[#d86532] uppercase">
                  Day {day.day}
                </p>
                <h3 className="mt-1 text-lg font-black text-[#123c2b]">
                  {day.theme}
                </h3>
              </div>
              <span className="rounded-full bg-[#edf5ee] px-2.5 py-1 text-xs font-bold text-[#466456]">
                {day.area}
              </span>
            </div>
            <ol className="mt-4 space-y-3">
              {day.activities.map((activity) => (
                <li
                  className="grid grid-cols-[4.8rem_1fr] gap-3"
                  key={`${activity.timeOfDay}-${activity.title}`}
                >
                  <span className="pt-0.5 text-xs font-bold text-[#d86532]">
                    {activity.timeOfDay}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-[#264c3b]">
                      {activity.title}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-[#668070]">
                      {activity.description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-4 grid gap-2 border-t border-emerald-950/8 pt-4 text-sm leading-6 text-[#577262]">
              <p>
                <span className="font-bold text-[#264c3b]">
                  Food direction:{" "}
                </span>
                {day.foodSuggestion}
              </p>
              <p>
                <span className="font-bold text-[#264c3b]">
                  Getting around:{" "}
                </span>
                {day.transportTip}
              </p>
            </div>
          </section>
        ))}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <section className="rounded-2xl bg-[#fff6ea] p-4">
          <h3 className="font-black text-[#713a1e]">Pack thoughtfully</h3>
          <ul className="mt-2 space-y-1.5 text-sm leading-6 text-[#865138]">
            {itinerary.packingTips.map((tip) => (
              <li key={tip}>• {tip}</li>
            ))}
          </ul>
        </section>
        <section className="rounded-2xl bg-[#edf5ee] p-4">
          <h3 className="font-black text-[#264c3b]">Local pointers</h3>
          <ul className="mt-2 space-y-1.5 text-sm leading-6 text-[#466456]">
            {itinerary.localTips.map((tip) => (
              <li key={tip}>• {tip}</li>
            ))}
          </ul>
        </section>
      </div>
      <p className="mt-5 text-xs leading-5 text-[#7a9080]">
        {itinerary.verificationReminder}
      </p>
    </motion.article>
  );
}

export default TripPlanner;
