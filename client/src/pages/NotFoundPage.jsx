import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <section className="mx-auto flex min-h-[65vh] max-w-3xl items-center px-5 py-16 sm:px-8">
      <div>
        <p className="text-xs font-bold tracking-[0.16em] text-[#d86532] uppercase">404 · Wrong turn</p>
        <h1 className="mt-3 text-4xl font-black tracking-[-0.045em] text-[#123c2b] sm:text-5xl">This destination does not exist.</h1>
        <Link className="mt-8 inline-flex rounded-xl bg-[#123c2b] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#0c2e20]" to="/">Return home</Link>
      </div>
    </section>
  )
}

export default NotFoundPage
