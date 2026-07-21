import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export async function requireAuth(request, response, next) {
  const authorizationHeader = request.headers.authorization

  // console.log('Authorization Header:', authorizationHeader) // Debugging line

  if (!authorizationHeader?.startsWith('Bearer ')) {
    return response.status(401).json({
      success: false,
      message: 'Authentication is required.',
    })
  }

  const token = authorizationHeader.slice('Bearer '.length)

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ['HS256'],
    })
    const user = await User.findById(payload.sub)

    if (!user) {
      return response.status(401).json({
        success: false,
        message: 'The account for this token no longer exists.',
      })
    }

    request.user = user
    return next()
  } catch (error) {
    return response.status(401).json({
      success: false,
      message: 'Your session is invalid or has expired.',
    })
  }
}
