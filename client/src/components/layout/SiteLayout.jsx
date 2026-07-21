import { motion } from 'framer-motion'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'

const navigationLinks = [
  { label: 'How it works', to: '/#how-it-works' },
  { label: 'Explore', to: '/#explore' },
]

function SiteLayout() {
  const { isAuthenticated, logout, user } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f7faf8]">
      <header className="sticky top-0 z-20 border-b border-emerald-950/8 bg-[#f7faf8]/90 backdrop-blur-md">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
          <Link className="flex items-center gap-2.5 text-lg font-extrabold tracking-tight text-[#123c2b]" to="/">
            <span className="grid size-9 place-items-center rounded-xl bg-[#123c2b] text-lg text-[#f7faf8]" aria-hidden="true">✦</span>
            TripVerse <span className="font-medium text-[#5d7d6e]">AI</span>
          </Link>

          <nav className="hidden items-center gap-7 text-sm font-medium text-[#466456] md:flex" aria-label="Main navigation">
            {navigationLinks.map((link) => (
              <a key={link.label} className="transition hover:text-[#123c2b]" href={link.to}>
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            {isAuthenticated ? (
              <>
                <NavLink className="hidden rounded-lg px-3 py-2 text-sm font-semibold text-[#264c3b] transition hover:bg-emerald-950/5 sm:inline-flex" to="/planner">
                  My planner
                </NavLink>
                <NavLink className="hidden rounded-lg px-3 py-2 text-sm font-semibold text-[#264c3b] transition hover:bg-emerald-950/5 md:inline-flex" to="/trips">
                  My trips
                </NavLink>
                <button className="rounded-lg bg-[#123c2b] px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#0c2e20] sm:px-4" type="button" onClick={handleLogout}>
                  <span className="hidden sm:inline">Log out, </span>{user.name.split(' ')[0]}
                </button>
              </>
            ) : (
              <>
                <NavLink className="hidden rounded-lg px-3 py-2 text-sm font-semibold text-[#264c3b] transition hover:bg-emerald-950/5 sm:inline-flex" to="/login">
                  Log in
                </NavLink>
                <NavLink className="rounded-lg bg-[#123c2b] px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#0c2e20] sm:px-4" to="/register">
                  Get started
                </NavLink>
              </>
            )}
          </div>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="border-t border-emerald-950/8 px-5 py-8 text-sm text-[#5d7d6e] sm:px-8 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} TripVerse AI. Travel with more intention.</p>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            Built one thoughtful journey at a time.
          </motion.p>
        </div>
      </footer>
    </div>
  )
}

export default SiteLayout
