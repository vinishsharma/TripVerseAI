import mongoose from 'mongoose'

const coordinatesSchema = new mongoose.Schema(
  {
    label: { type: String, trim: true, maxlength: 160 },
    displayName: { type: String, trim: true, maxlength: 320 },
    latitude: { type: Number },
    longitude: { type: Number },
  },
  { _id: false },
)

const placeSchema = new mongoose.Schema(
  {
    osmType: { type: String, trim: true, maxlength: 20 },
    osmId: { type: Number },
    category: { type: String, trim: true, maxlength: 30 },
    name: { type: String, trim: true, maxlength: 180 },
    address: { type: String, trim: true, maxlength: 320 },
    latitude: { type: Number },
    longitude: { type: Number },
    distanceKm: { type: Number },
  },
  { _id: false },
)

const weatherDaySchema = new mongoose.Schema(
  {
    date: { type: String, required: true, maxlength: 10 },
    condition: { type: String, trim: true, maxlength: 100 },
    icon: { type: String, trim: true, maxlength: 12 },
    highCelsius: { type: Number },
    lowCelsius: { type: Number },
    precipitationProbability: { type: Number },
  },
  { _id: false },
)

const activitySchema = new mongoose.Schema(
  {
    timeOfDay: { type: String, required: true, trim: true, maxlength: 50 },
    title: { type: String, required: true, trim: true, maxlength: 180 },
    description: { type: String, required: true, trim: true, maxlength: 1000 },
  },
  { _id: false },
)

const itineraryDaySchema = new mongoose.Schema(
  {
    day: { type: Number, required: true, min: 1, max: 14 },
    theme: { type: String, required: true, trim: true, maxlength: 180 },
    area: { type: String, required: true, trim: true, maxlength: 180 },
    activities: { type: [activitySchema], required: true, validate: [(activities) => activities.length > 0 && activities.length <= 8, 'Each day needs between 1 and 8 activities.'] },
    foodSuggestion: { type: String, required: true, trim: true, maxlength: 600 },
    transportTip: { type: String, required: true, trim: true, maxlength: 600 },
  },
  { _id: false },
)

const tripSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    request: {
      from: { type: String, required: true, trim: true, maxlength: 120 },
      to: { type: String, required: true, trim: true, maxlength: 120 },
      startDate: { type: String, required: true, maxlength: 10 },
      endDate: { type: String, required: true, maxlength: 10 },
      dayCount: { type: Number, required: true, min: 1, max: 14 },
      travelers: { type: Number, required: true, min: 1, max: 12 },
      budget: { type: String, required: true, trim: true, maxlength: 80 },
      interests: { type: [String], default: [], validate: [(interests) => interests.length <= 8, 'A trip can have at most 8 interests.'] },
      pace: { type: String, required: true, enum: ['slow', 'balanced', 'fast'] },
      notes: { type: String, trim: true, maxlength: 600, default: '' },
    },
    itinerary: {
      title: { type: String, required: true, trim: true, maxlength: 180 },
      overview: { type: String, required: true, trim: true, maxlength: 1500 },
      routeSummary: { type: String, required: true, trim: true, maxlength: 1000 },
      dailyItinerary: { type: [itineraryDaySchema], required: true, validate: [(days) => days.length > 0 && days.length <= 14, 'A trip needs between 1 and 14 days.'] },
      budgetAdvice: { type: String, required: true, trim: true, maxlength: 1000 },
      packingTips: { type: [String], required: true, validate: [(tips) => tips.length <= 12, 'A trip can have at most 12 packing tips.'] },
      localTips: { type: [String], required: true, validate: [(tips) => tips.length <= 12, 'A trip can have at most 12 local tips.'] },
      verificationReminder: { type: String, required: true, trim: true, maxlength: 600 },
    },
    places: {
      source: { type: String, trim: true, maxlength: 50 },
      attribution: { type: String, trim: true, maxlength: 160 },
      warning: { type: String, trim: true, maxlength: 600 },
      origin: { type: coordinatesSchema },
      destination: { type: coordinatesSchema },
      hotels: { type: [placeSchema], default: [] },
      restaurants: { type: [placeSchema], default: [] },
    },
    weather: {
      source: { type: String, trim: true, maxlength: 50 },
      attribution: { type: String, trim: true, maxlength: 160 },
      timezone: { type: String, trim: true, maxlength: 100 },
      warning: { type: String, trim: true, maxlength: 600 },
      daily: { type: [weatherDaySchema], default: [] },
    },
  },
  {
    timestamps: true,
  },
)

const Trip = mongoose.model('Trip', tripSchema)

export default Trip
