import { useEffect, useRef, useState } from 'react'
import { Button, Icon } from '../components/ui'
import { images, leaders, winners } from '../data'
import { gsap, MOTION_OK, SplitText, useGSAP } from '../lib/gsap'
import { pad2, useCountdown } from '../lib/hooks'
import { usePlayer } from '../lib/player'
import './mystery.css'

function Digit({ value, unit }: { value: string; unit: string }) {
  return (
    <div className="unit glass">
      <span className="num unit__value" key={value}>
        {value}
      </span>
      <span className="unit__label">{unit}</span>
    </div>
  )
}

export function MysteryDrop() {
  const root = useRef<HTMLElement>(null)
  const { reminded, toggleReminder } = usePlayer()
  const [dropAt] = useState(() => Date.now() + ((2 * 24 + 14) * 3600 + 9 * 60 + 33) * 1000)
  const t = useCountdown(dropAt)
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const id = window.setInterval(() => setOffset((o) => (o + 1) % winners.length), 3800)
    return () => window.clearInterval(id)
  }, [])

  const visible = [0, 1, 2].map((i) => winners[(offset + i) % winners.length])

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        const split = SplitText.create('.mystery__title', { type: 'lines', mask: 'lines', linesClass: 'split-line' })
        const tl = gsap.timeline({ scrollTrigger: { trigger: '.mystery', start: 'top 65%', once: true } })
        tl.from(split.lines, { yPercent: 115, duration: 1.4, stagger: 0.12 })
          .from('.mystery__desc', { y: 20, autoAlpha: 0, stagger: 0.1 }, 0.1)
          .from('.unit', { y: 40, autoAlpha: 0, stagger: 0.08, duration: 1.2 }, 0.35)
          .from('.mystery__actions > *', { y: 20, autoAlpha: 0, stagger: 0.08 }, 0.6)
          .from('.hof', { y: 40, autoAlpha: 0, duration: 1.3 }, 0.7)
        gsap.fromTo(
          '.mystery__art img',
          { yPercent: -8, scale: 1.12 },
          { yPercent: 8, scale: 1, ease: 'none', scrollTrigger: { trigger: '.mystery', start: 'top bottom', end: 'bottom top', scrub: true } },
        )
        return () => split.revert()
      })
    },
    { scope: root },
  )

  return (
    <section id="mystery" className="mystery" ref={root}>
      <div className="mystery__art" aria-hidden="true">
        <img src={images.gift} alt="" loading="lazy" />
        <div className="mystery__beam" />
      </div>

      <div className="mystery__content">
        <h2 className="display mystery__title">
          Something new,
          <br />
          <em>in 3 days.</em>
        </h2>
        <p className="mystery__desc">A limited drop unlocks on 20 September. Only Tier 3 players and above get early access to the prize reveal.</p>

        <div className="countdown" aria-label="Time until the drop">
          <Digit value={pad2(t.days)} unit="days" />
          <Digit value={pad2(t.hours)} unit="hours" />
          <Digit value={pad2(t.minutes)} unit="min" />
          <Digit value={pad2(t.seconds)} unit="sec" />
        </div>

        <div className="mystery__actions">
          <Button icon={reminded ? 'notifications_active' : 'notifications'} onClick={toggleReminder}>
            {reminded ? 'Reminder set' : 'Remind me'}
          </Button>
          <Button variant="ghost" icon="arrow_forward">
            Past drops
          </Button>
          <span className="mystery__early">
            <Icon name="workspace_premium" />
            You qualify for early access (Tier 3)
          </span>
        </div>
      </div>

      <div className="hof glass">
        <div className="hof__col hof__col--grow">
          <p className="eyebrow hof__head">
            <Icon name="emoji_events" style={{ color: 'var(--legendary)' }} />
            Latest winners
          </p>
          <ul className="hof__list">
            {visible.map((w) => (
              <li key={w.name} className="winner">
                <span className="winner__avatar">{w.initials}</span>
                <span>
                  <strong>{w.name}</strong>
                  <span className="muted">
                    {w.prize} · {w.ago}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="hof__divider" />
        <div className="hof__col">
          <p className="eyebrow hof__head">
            <Icon name="leaderboard" style={{ color: 'var(--accent)' }} />
            Top this week
          </p>
          <ol className="hof__list">
            {leaders.map((l) => (
              <li key={l.rank} className="leader">
                <span className={`display leader__rank ${l.rank === 1 ? 'is-first' : ''}`}>{l.rank}</span>
                <span>
                  <strong>{l.name}</strong>
                  <span className="num muted">{l.xp}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
