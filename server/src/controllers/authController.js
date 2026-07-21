import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function normalizeEmail(email) {
  return typeof email === 'string' ? email.trim().toLowerCase() : ''
}

function safeUser(user) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  }
}

function createToken(userId) {
  return jwt.sign({ sub: userId.toString() }, process.env.JWT_SECRET, {
    algorithm: 'HS256',
    expiresIn: '7d',
  })
}

export async function register(request, response, next) {
  try {
    const { name, email, password } = request.body ?? {}
    const normalizedName = typeof name === 'string' ? name.trim() : ''
    const normalizedEmail = normalizeEmail(email)

    if (!normalizedName || !emailPattern.test(normalizedEmail) || typeof password !== 'string') {
      return response.status(400).json({
        success: false,
        message: 'Provide a name, a valid email address, and a password.',
      })
    }

    if (password.length < 8) {
      return response.status(400).json({
        success: false,
        message: 'Password must contain at least 8 characters.',
      })
    }

    const existingUser = await User.findOne({ email: normalizedEmail })

    if (existingUser) {
      return response.status(409).json({
        success: false,
        message: 'An account with that email already exists.',
      })
    }

    const user = await User.create({
      name: normalizedName,
      email: normalizedEmail,
      password,
    })

    return response.status(201).json({
      success: true,
      message: 'Account created successfully.',
      data: {
        token: createToken(user._id),
        user: safeUser(user),
      },
    })
  } catch (error) {
    return next(error)
  }
}

export async function login(request, response, next) {
  try {
    const { email, password } = request.body ?? {}
    const normalizedEmail = normalizeEmail(email)

    if (!normalizedEmail || typeof password !== 'string') {
      return response.status(400).json({
        success: false,
        message: 'Email and password are required.',
      })
    }

    const user = await User.findOne({ email: normalizedEmail }).select('+password')
    const passwordMatches = user ? await user.comparePassword(password) : false

    if (!passwordMatches) {
      return response.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      })
    }

    return response.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      data: {
        token: createToken(user._id),
        user: safeUser(user),
      },
    })
  } catch (error) {
    return next(error)
  }
}

export async function getCurrentUser(request, response) {
  return response.status(200).json({
    success: true,
    data: {
      user: safeUser(request.user),
    },
  })
}
