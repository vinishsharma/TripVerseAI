import { createContext, useContext, useMemo, useState } from 'react'
import api, { TOKEN_STORAGE_KEY } from '../services/api.js'

const USER_STORAGE_KEY = 'tripverse_ai_user'
const AuthContext = createContext(null)

function loadStoredUser() {
  try {
    const storedUser = localStorage.getItem(USER_STORAGE_KEY)
    return storedUser ? JSON.parse(storedUser) : null
  } catch {
    localStorage.removeItem(USER_STORAGE_KEY)
    return null
  }
}

function extractSession(response) {
  const session = response.data?.data

  if (!session?.token || !session?.user) {
    throw new Error('The server returned an invalid authentication response.')
  }

  return session
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadStoredUser)
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_STORAGE_KEY))

  function saveSession(session) {
    localStorage.setItem(TOKEN_STORAGE_KEY, session.token)
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(session.user))
    setToken(session.token)
    setUser(session.user)
  }

  async function register(details) {
    const response = await api.post('/auth/register', details)
    const session = extractSession(response)
    saveSession(session)
    return session.user
  }

  async function login(credentials) {
    const response = await api.post('/auth/login', credentials)
    const session = extractSession(response)
    saveSession(session)
    return session.user
  }

  function logout() {
    localStorage.removeItem(TOKEN_STORAGE_KEY)
    localStorage.removeItem(USER_STORAGE_KEY)
    setToken(null)
    setUser(null)
  }

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user && token),
      register,
      login,
      logout,
    }),
    [token, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider.')
  }

  return context
}
