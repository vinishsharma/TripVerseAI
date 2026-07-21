import { motion } from 'framer-motion'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'

function getErrorMessage(error) {
  return error.response?.data?.message ?? error.message ?? 'Unable to log in. Please try again.'
}

function LoginPage() {
  const { login } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const destination = location.state?.from?.pathname ?? '/planner'

  function handleChange(event) {
    setForm((currentForm) => ({ ...currentForm, [event.target.name]: event.target.value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      await login(form)
      navigate(destination, { replace: true })
    } catch (requestError) {
      setError(getErrorMessage(requestError))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="relative flex min-h-[72vh] items-center justify-center overflow-hidden px-5 py-14 sm:px-8">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_12%,rgba(226,244,229,0.9),transparent_23rem),radial-gradient(circle_at_90%_90%,rgba(247,219,184,0.55),transparent_24rem)]" />
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md rounded-3xl border border-white bg-white p-6 shadow-xl shadow-emerald-950/8 sm:p-8">
        <p className="text-xs font-bold tracking-[0.16em] text-[#d86532] uppercase">Welcome back</p>
        <h1 className="mt-3 text-3xl font-black tracking-[-0.04em] text-[#123c2b]">Continue planning your next adventure.</h1>
        <p className="mt-3 text-sm leading-6 text-[#668070]">Log in to access your saved travel plans.</p>

        <form className="mt-7 space-y-4" onSubmit={handleSubmit}>
          <label className="block text-sm font-bold text-[#264c3b]">Email address
            <input className="mt-1.5 w-full rounded-xl border border-emerald-950/12 bg-[#fbfdfb] px-3.5 py-3 text-[#123c2b] outline-none transition placeholder:text-[#8ba294] focus:border-[#32634c] focus:ring-3 focus:ring-emerald-900/10" type="email" name="email" autoComplete="email" value={form.email} onChange={handleChange} required />
          </label>
          <label className="block text-sm font-bold text-[#264c3b]">Password
            <input className="mt-1.5 w-full rounded-xl border border-emerald-950/12 bg-[#fbfdfb] px-3.5 py-3 text-[#123c2b] outline-none transition placeholder:text-[#8ba294] focus:border-[#32634c] focus:ring-3 focus:ring-emerald-900/10" type="password" name="password" autoComplete="current-password" value={form.password} onChange={handleChange} required />
          </label>
          {error && <p className="rounded-xl bg-red-50 px-3.5 py-3 text-sm font-medium text-red-700" role="alert">{error}</p>}
          <button className="w-full rounded-xl bg-[#123c2b] px-4 py-3.5 text-sm font-bold text-white transition hover:bg-[#0c2e20] disabled:cursor-not-allowed disabled:opacity-65" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Logging in…' : 'Log in'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-[#668070]">New to TripVerse AI? <Link className="font-bold text-[#32634c] hover:underline" to="/register">Create an account</Link></p>
      </motion.div>
    </section>
  )
}

export default LoginPage
