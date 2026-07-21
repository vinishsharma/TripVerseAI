import mongoose from 'mongoose'

async function connectDatabase() {
  const connectionString = `${process.env.MONGODB_URI}/${process.env.DB_NAME}`

  if (!connectionString) {
    throw new Error('MONGODB_URI is not set. Add it to server/.env before starting the API.')
  }

  await mongoose.connect(connectionString)

  console.log(`☑️  Connected to MongoDB database: ${mongoose.connection.name}`)
}

export default connectDatabase
