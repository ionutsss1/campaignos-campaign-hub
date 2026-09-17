import { useMemo, useRef } from 'react'
import { Badge, Button, Icon, SectionTitle } from '../components/ui'
import { images, stops, type StopState } from '../data'
import { gsap, MOTION_OK, revealTitle, useGSAP } from '../lib/gsap'
import './journey.css'

const W = 1440
const H = 700
/** Stops are authored in the 860-high Figma frame; the stage drops the 160px header band. */
const OFFSET = 160
const pts = stops.map((s) => ({ x: s.x, y: s.y - OFFSET }))

/** Catmull-Rom spline through points, as a cubic Bézier SVG path. */
function smoothPath(points: { x: number; y: number }[]) {
  let d = `M ${points[0].x} ${points[0].y}`
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[i + 2] ?? p2
    const c1x = p1.x + (p2.x - p0.x) / 6
    const c1y = p1.y + (p2.y - p0.y) / 6
    const c2x = p2.x - (p3.x - p1.x) / 6
    const c2y = p2.y - (p3.y - p1.y) / 6
    d += ` C ${c1x} ${c1y} ${c2x} ${c2y} ${p2.x} ${p2.y}`
  }
  return d
}

const markerIcon: Record<StopState, string> = { cleared: 'check', live: 'play_arrow', locked: 'lock', mystery: 'question_mark' }

export function Journey() {
  const root = useRef<HTMLElement>(null)
  const liveIndex = stops.findIndex((s) => s.state === 'live')
  const paths = useMemo(
    () => ({ done: smoothPath(pts.slice(0, liveIndex + 1)), next: smoothPath(pts.slice(liveIndex)) }),
    [liveIndex],
  )
  const cleared = stops.filter((s) => s.state === 'cleared').length

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        const split = revealTitle('.journey .section-title')
        gsap.from('.journey__map img', {
          scale: 1.15,
          ease: 'none',
          scrollTrigger: { trigger: '.journey__stage', start: 'top bottom', end: 'bottom top', scrub: true },
        })
        gsap
          .timeline({ scrollTrigger: { trigger: '.journey__stage', start: 'top 65%', once: true } })
          // Reveal the cleared path left-to-right with a clip rect (resolution-independent, unlike dash offsets).
          .from('.journey__reveal', { attr: { width: 0 }, duration: 2.4, ease: 'power2.inOut' }, 0.2)
          .from('.journey__path--next', { autoAlpha: 0, duration: 1.2, ease: 'power1.out' }, 1.6)
        gsap.from('.stop', {
          autoAlpha: 0,
          scale: 0.6,
          y: 20,
          stagger: 0.12,
          duration: 1.1,
          ease: 'back.out(1.6)',
          scrollTrigger: { trigger: '.journey__stage', start: 'top 55%', once: true },
        })
        gsap.from('.journey__popover', {
          autoAlpha: 0,
          y: 16,
          scale: 0.96,
          duration: 1.2,
          delay: 0.9,
          scrollTrigger: { trigger: '.journey__stage', start: 'top 55%', once: true },
        })
        gsap.from('.journey__segments span', {
          scaleX: 0,
          transformOrigin: 'left center',
          stagger: 0.08,
          duration: 1,
          scrollTrigger: { trigger: '.journey__progress', start: 'top 85%', once: true },
        })
        return () => split.revert()
      })
    },
    { scope: root },
  )

  const live = stops[liveIndex]

  return (
    <section id="journey" className="journey" ref={root}>
      <div className="journey__map" aria-hidden="true">
        <img src={images.map} alt="" loading="lazy" />
      </div>

      <div className="section journey__head">
        <div className="section-header">
          <div className="section-header__lead">
            <SectionTitle lead="Autumn Fresh," italic="stop by stop." />
          </div>
          <div className="journey__progress">
            <p className="journey__count">
              <span className="display">{cleared}</span> <span className="muted">of {stops.length} stops cleared</span>
            </p>
            <div className="journey__segments">
              {stops.map((s, i) => (
                <span key={s.title} className={`seg seg--${i < cleared ? 'done' : s.state === 'live' ? 'live' : 'todo'}`} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="journey__stage">
        <svg className="journey__svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <clipPath id="journey-reveal">
              <rect className="journey__reveal" x="0" y="-100" width={W} height={H + 200} />
            </clipPath>
          </defs>
          <path className="journey__path journey__path--next" d={paths.next} />
          <path className="journey__path journey__path--done" d={paths.done} clipPath="url(#journey-reveal)" />
        </svg>

        {stops.map((s) => (
          <button
            key={s.title}
            className={`stop stop--${s.state}`}
            style={{ left: `${(s.x / W) * 100}%`, top: `${((s.y - OFFSET) / H) * 100}%` }}
            aria-label={`${s.title}: ${s.meta}`}
          >
            <span className="stop__marker">
              <Icon name={markerIcon[s.state]} />
            </span>
            <span className="stop__text">
              <span className="display stop__title">{s.title}</span>
              <span className="stop__meta">{s.meta}</span>
            </span>
          </button>
        ))}

        <div className="journey__popover" style={{ left: `${(live.x / W) * 100}%`, top: `${((live.y - OFFSET) / H) * 100}%` }}>
          <div className="journey__popover-card glass">
          <img src={images.lobby} alt="" />
          <div className="journey__popover-body">
            <div className="journey__popover-badges">
              <Badge tone="live">Live</Badge>
              <Badge icon="schedule">18d left</Badge>
            </div>
            <p>Buy &amp; Win · 1 VIP trip</p>
            <Button size="m" icon="arrow_forward">
              Participate
            </Button>
          </div>
          </div>
        </div>

        <div className="journey__legend glass">
          {[
            ['check', 'Cleared', 'var(--ok)'],
            ['play_arrow', 'Live', 'var(--text)'],
            ['lock', 'Upcoming', 'var(--muted)'],
            ['question_mark', 'Mystery', 'var(--legendary)'],
          ].map(([icon, label, color]) => (
            <span key={label}>
              <Icon name={icon} style={{ color }} />
              {label}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
