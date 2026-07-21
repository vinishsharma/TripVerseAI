import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'

function getErrorMessage(error) {
  return error.response?.data?.message ?? error.message ?? 'Unable to create your account. Please try again.'
}

function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleChange(event) {
    setForm((currentForm) => ({ ...currentForm, [event.target.name]: event.target.value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    if (form.password !== form.confirmPassword) {
      setError('Your passwords do not match.')
      return
    }

    setIsSubmitting(true)

    try {
      await register({ name: form.name, email: form.email, password: form.password })
      navigate('/planner', { replace: true })
    } catch (requestError) {
      setError(getErrorMessage(requestError))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="relative flex min-h-[72vh] items-center justify-center overflow-hidden px-5 py-14 sm:px-8">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_85%_12%,rgba(226,244,229,0.9),transparent_23rem),radial-gradient(circle_at_10%_88%,rgba(247,219,184,0.55),transparent_24rem)]" />
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md rounded-3xl border border-white bg-white p-6 shadow-xl shadow-emerald-950/8 sm:p-8">
        <p className="text-xs font-bold tracking-[0.16em] text-[#d86532] uppercase">Begin your journey</p>
        <h1 className="mt-3 text-3xl font-black tracking-[-0.04em] text-[#123c2b]">Create your TripVerse AI account.</h1>
        <p className="mt-3 text-sm leading-6 text-[#668070]">Save thoughtful itineraries and return to them whenever inspiration strikes.</p>

        <form className="mt-7 space-y-4" onSubmit={handleSubmit}>
          <label className="block text-sm font-bold text-[#264c3b]">Your name
            <input className="mt-1.5 w-full rounded-xl border border-emerald-950/12 bg-[#fbfdfb] px-3.5 py-3 text-[#123c2b] outline-none transition placeholder:text-[#8ba294] focus:border-[#32634c] focus:ring-3 focus:ring-emerald-900/10" type="text" name="name" autoComplete="name" minLength="2" maxLength="60" value={form.name} onChange={handleChange} required />
          </label>
          <label className="block text-sm font-bold text-[#264c3b]">Email address
            <input className="mt-1.5 w-full rounded-xl border border-emerald-950/12 bg-[#fbfdfb] px-3.5 py-3 text-[#123c2b] outline-none transition placeholder:text-[#8ba294] focus:border-[#32634c] focus:ring-3 focus:ring-emerald-900/10" type="email" name="email" autoComplete="email" value={form.email} onChange={handleChange} required />
          </label>
          <label className="block text-sm font-bold text-[#264c3b]">Password
            <input className="mt-1.5 w-full rounded-xl border border-emerald-950/12 bg-[#fbfdfb] px-3.5 py-3 text-[#123c2b] outline-none transition placeholder:text-[#8ba294] focus:border-[#32634c] focus:ring-3 focus:ring-emerald-900/10" type="password" name="password" autoComplete="new-password" minLength="8" value={form.password} onChange={handleChange} required />
          </label>
          <label className="block text-sm font-bold text-[#264c3b]">Confirm password
            <input className="mt-1.5 w-full rounded-xl border border-emerald-950/12 bg-[#fbfdfb] px-3.5 py-3 text-[#123c2b] outline-none transition placeholder:text-[#8ba294] focus:border-[#32634c] focus:ring-3 focus:ring-emerald-900/10" type="password" name="confirmPassword" autoComplete="new-password" minLength="8" value={form.confirmPassword} onChange={handleChange} required />
          </label>
          {error && <p className="rounded-xl bg-red-50 px-3.5 py-3 text-sm font-medium text-red-700" role="alert">{error}</p>}
          <button className="w-full rounded-xl bg-[#123c2b] px-4 py-3.5 text-sm font-bold text-white transition hover:bg-[#0c2e20] disabled:cursor-not-allowed disabled:opacity-65" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating account…' : 'Create account'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-[#668070]">Already have an account? <Link className="font-bold text-[#32634c] hover:underline" to="/login">Log in</Link></p>
      </motion.div>
    </section>
  )
}

export default RegisterPage
