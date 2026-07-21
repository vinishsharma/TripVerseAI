import cors from 'cors'
import express from 'express'
import authRoutes from './routes/authRoutes.js'
import tripRoutes from './routes/tripRoutes.js'

const app = express()

// A browser may call this local API only from our React development server.
// In production, CLIENT_URL will be changed to the deployed frontend address.
app.use(
  cors({
    origin: process.env.CLIENT_URL ?? 'http://localhost:5173',
  }),
)

// This lets Express read JSON sent in request bodies, such as registration data.
app.use(express.json({ limit: '1mb' }))

app.get('/api/health', (request, response) => {
  response.status(200).json({
    success: true,
    message: 'TripVerse AI API is running.',
    timestamp: new Date().toISOString(),
  })
})

app.use('/api/auth', authRoutes)
app.use('/api/trips', tripRoutes)

// API routes that do not exist should return JSON, not an HTML error page.
app.use('/api', (request, response) => {
  response.status(404).json({
    success: false,
    message: 'API route not found.',
  })
})

app.use((error, request, response, _next) => {
  console.error('API error:', error.message)

  if (error.name === 'ValidationError') {
    return response.status(400).json({
      success: false,
      message: 'The submitted data is invalid.',
    })
  }

  if (error.code === 11000) {
    return response.status(409).json({
      success: false,
      message: 'An account with that email already exists.',
    })
  }

  return response.status(500).json({
    success: false,
    message: 'Something went wrong on the server.',
  })
})

export default app
