import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const steps = [
  {
    number: '01',
    title: 'Tell us your travel style',
    text: 'Share your destination, dates, budget, interests, and pace in a short form.',
  },
  {
    number: '02',
    title: 'Let AI do the research',
    text: 'TripVerse AI turns your preferences into a practical, day-by-day route.',
  },
  {
    number: '03',
    title: 'Make the trip your own',
    text: 'Review the plan, check the weather and map, then save it for later.',
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

function HomePage() {
  return (
    <>
      <section className="relative isolate overflow-hidden px-5 pb-18 pt-16 sm:px-8 sm:pb-24 sm:pt-22 lg:px-10 lg:pb-30 lg:pt-28">
        <div className="absolute inset-x-0 top-0 -z-10 h-full bg-[radial-gradient(circle_at_84%_14%,rgba(214,239,221,0.9),transparent_24rem),radial-gradient(circle_at_15%_86%,rgba(244,222,181,0.45),transparent_22rem)]" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.03fr_0.97fr] lg:gap-16">
          <motion.div initial="hidden" animate="visible" transition={{ staggerChildren: 0.11 }}>
            <motion.p variants={fadeUp} className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-900/10 bg-white/70 px-3 py-1.5 text-xs font-bold tracking-[0.12em] text-[#32634c] uppercase">
              <span className="size-1.5 rounded-full bg-[#ec8c50]" />
              Your next chapter starts here
            </motion.p>
            <motion.h1 variants={fadeUp} className="max-w-3xl text-5xl leading-[0.98] font-black tracking-[-0.055em] text-[#123c2b] sm:text-6xl lg:text-7xl">
              Travel plans that feel like <span className="text-[#d86532]">you.</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="mt-6 max-w-xl text-base leading-7 text-[#577262] sm:text-lg">
              Turn a few ideas into a beautiful, personalized itinerary—with the right places, a sensible route, and the weather in mind.
            </motion.p>
            <motion.div variants={fadeUp} className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#123c2b] px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-950/15 transition hover:-translate-y-0.5 hover:bg-[#0c2e20]" to="/planner">
                Plan my trip <span aria-hidden="true">→</span>
              </Link>
              <a className="inline-flex items-center justify-center rounded-xl border border-[#123c2b]/12 bg-white/70 px-5 py-3.5 text-sm font-bold text-[#123c2b] transition hover:border-[#123c2b]/25 hover:bg-white" href="#how-it-works">
                See how it works
              </a>
            </motion.div>
            <motion.div variants={fadeUp} className="mt-10 flex items-center gap-4 text-sm text-[#5d7d6e]">
              <div className="flex -space-x-2" aria-hidden="true">
                {['#d77a4a', '#346c58', '#e2a85d', '#7f9bb7'].map((color) => (
                  <span key={color} className="grid size-8 place-items-center rounded-full border-2 border-[#f7faf8] text-[10px] font-bold text-white" style={{ backgroundColor: color }}>✦</span>
                ))}
              </div>
              <span>Designed for curious travelers</span>
            </motion.div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.96, y: 18 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.55 }} className="relative mx-auto w-full max-w-lg">
            <div className="absolute -right-5 -top-5 size-28 rounded-full bg-[#ec8c50]/15 blur-2xl" />
            <div className="relative rounded-[1.8rem] border border-white/80 bg-white p-4 shadow-2xl shadow-emerald-950/12 sm:p-5">
              <div className="overflow-hidden rounded-2xl bg-[#123c2b] p-5 text-white sm:p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-bold tracking-[0.16em] text-emerald-100/70 uppercase">Your trip preview</p>
                    <h2 className="mt-2 text-3xl font-extrabold tracking-tight">Barcelona</h2>
                    <p className="mt-1 text-sm text-emerald-100/80">4 days · Culture, food & slow mornings</p>
                  </div>
                  <span className="grid size-11 place-items-center rounded-2xl bg-white/12 text-xl" aria-label="Sunny weather">☀️</span>
                </div>
                <div className="mt-7 rounded-xl bg-white/10 p-3.5 backdrop-blur-sm">
                  <div className="flex justify-between text-xs font-bold text-emerald-50/70"><span>DAY 2</span><span>18°C · Clear</span></div>
                  <p className="mt-2 font-semibold">Gothic Quarter → El Born</p>
                  <p className="mt-1 text-xs leading-5 text-emerald-50/70">Markets, modernist architecture, tapas at sunset.</p>
                </div>
              </div>
              <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-4 px-2 py-5 text-sm">
                <span className="row-span-2 grid size-9 place-items-center rounded-xl bg-[#eff7f0] text-base" aria-hidden="true">⌖</span>
                <div><p className="font-bold text-[#173a2b]">A route that makes sense</p><p className="mt-0.5 text-xs leading-5 text-[#6a8677]">Nearby experiences grouped together.</p></div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#e4efe7]"><div className="h-full w-3/4 rounded-full bg-[#ec8c50]" /></div>
              </div>
            </div>
            {/* <div className="absolute -bottom-5 -left-5 -z-10 rounded-2xl border border-[#123c2b]/8 bg-[#e9f3e9] px-4 py-3 text-xs font-bold text-[#32634c] shadow-sm">✦ Personalised, not generic</div> */}
          </motion.div>
        </div>
      </section>

      <section id="how-it-works" className="bg-[#123c2b] px-5 py-18 text-white sm:px-8 sm:py-22 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-xl">
            <p className="text-xs font-bold tracking-[0.16em] text-[#f3c676] uppercase">Simple by design</p>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] sm:text-4xl">More excitement, less tab-switching.</h2>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {steps.map((step, index) => (
              <motion.article key={step.number} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ delay: index * 0.08 }} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <p className="text-sm font-black text-[#f3c676]">{step.number}</p>
                <h3 className="mt-8 text-xl font-bold">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-emerald-100/70">{step.text}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section id="explore" className="px-5 py-18 sm:px-8 sm:py-22 lg:px-10">
        <div className="mx-auto max-w-7xl rounded-3xl bg-[#eaf4eb] px-6 py-12 text-center sm:px-12 sm:py-16">
          <p className="text-xs font-bold tracking-[0.16em] text-[#5d7d6e] uppercase">A better way to begin</p>
          <h2 className="mx-auto mt-3 max-w-2xl text-3xl font-black tracking-[-0.045em] text-[#123c2b] sm:text-4xl">Your travel ideas deserve more than a generic checklist.</h2>
          <Link className="mt-7 inline-flex rounded-xl bg-[#d86532] px-5 py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#be5528]" to="/register">Create your free account</Link>
        </div>
      </section>
    </>
  )
}

export default HomePage
