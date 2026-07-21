import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext.jsx'
import TripPlanner from '../components/planner/TripPlanner.jsx'

function PlannerPage() {
  const { user } = useAuth()

  return (
    <section className="relative min-h-[72vh] overflow-hidden px-5 py-14 sm:px-8 lg:px-10">
      <div className="absolute inset-x-0 top-0 -z-10 h-90 bg-[radial-gradient(circle_at_76%_12%,rgba(220,240,224,0.85),transparent_25rem)]" />
      <div className="mx-auto max-w-7xl">
        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-xs font-bold tracking-[0.16em] text-[#d86532] uppercase">Your private planning space</motion.p>
        <motion.h1 initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }} className="mt-3 max-w-2xl text-4xl font-black tracking-tighter text-[#123c2b] sm:text-5xl">Welcome, {user.name.split(' ')[0]}. Where would you like to go?</motion.h1>
        <TripPlanner />
      </div>
    </section>
  )
}

export default PlannerPage
