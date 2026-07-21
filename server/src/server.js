import 'dotenv/config'
import app from './app.js'
import connectDatabase from './config/database.js'

const port = Number(process.env.PORT) || 5000

function validateEnvironment() {
  const requiredVariables = ['MONGODB_URI', 'JWT_SECRET', 'GEMINI_API_KEY']
  const missingVariable = requiredVariables.find((name) => !process.env[name])

  if (missingVariable) {
    throw new Error(`${missingVariable} is not set. Add it to server/.env before starting the API.`)
  }
}

async function startServer() {
  try {
    validateEnvironment()
    await connectDatabase()

    const server = app.listen(port)

    server.on('listening', () => {
      console.log(`☑️  TripVerse AI API is listening on http://localhost:${port}`)
    })

    server.on('error', (error) => {
      console.error(`Unable to start the TripVerse AI API: ${error.message}`)
      process.exitCode = 1
    })
  } catch (error) {
    console.error(`Unable to connect to MongoDB: ${error.message}`)
    process.exitCode = 1
  }
}

startServer()
