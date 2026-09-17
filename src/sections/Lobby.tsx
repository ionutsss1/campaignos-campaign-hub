import { useRef, useState } from 'react'
import { Badge, Button, Icon } from '../components/ui'
import { featured, images } from '../data'
import { gsap, MOTION_OK, ScrollTrigger, SplitText, useGSAP } from '../lib/gsap'
import { pad2, useCountdown, useTweenedNumber } from '../lib/hooks'
import { useScrollTo } from '../lib/lenis'
import { TIER_GOAL, usePlayer } from '../lib/player'
import './lobby.css'

const whole = (n: number) => Math.round(n).toString()

export function Lobby() {
  const root = useRef<HTMLElement>(null)
  const { xp, claimedToday } = usePlayer()
  const scrollTo = useScrollTo()
  const [drawAt] = useState(() => Date.now() + (9 * 3600 + 41 * 60 + 12) * 1000)
  const draw = useCountdown(drawAt)
  const xpRef = useTweenedNumber(xp, whole)
  const progress = Math.min(1, xp / TIER_GOAL)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        const split = SplitText.create('.lobby__title', { type: 'lines', mask: 'lines', linesClass: 'split-line' })
        const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
        tl.from('.lobby__art', { autoAlpha: 0, duration: 1.6, ease: 'power2.out' }, 0)
          .from('.lobby__art img', { scale: 1.2, duration: 2.8, ease: 'power3.out' }, 0)
          .from('.lobby__eyebrow > *', { y: 14, autoAlpha: 0, stagger: 0.08, duration: 1 }, 0.5)
          .from(split.lines, { yPercent: 115, duration: 1.5, stagger: 0.12 }, 0.55)
          .from(['.lobby__desc', '.lobby__ctas'], { y: 24, autoAlpha: 0, stagger: 0.1, duration: 1.2 }, 0.95)
          .from('.lobby__widgets > *', { x: 48, autoAlpha: 0, stagger: 0.1, duration: 1.3 }, 1)
          .from('.lobby__scroll', { autoAlpha: 0, duration: 1 }, 1.5)

        gsap.to('.lobby__art img', {
          yPercent: 14,
          scale: 1.06,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
        })
        gsap.to('.lobby__content', {
          y: -80,
          autoAlpha: 0,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: '35% top', end: 'bottom top', scrub: true },
        })
        return () => split.revert()
      })
      ScrollTrigger.refresh()
    },
    { scope: root },
  )

  return (
    <section id="lobby" className="lobby" ref={root}>
      <div className="lobby__art" aria-hidden="true">
        <img src={images.lobby} alt="" fetchPriority="high" />
        <div className="lobby__scrim" />
      </div>

      <div className="lobby__content">
        <div className="lobby__main">
          <div className="lobby__eyebrow">
            <span className="season glass">
              <strong>{featured.season}</strong>
              <span className="season__dot" />
              <span className="muted">{featured.seasonName}</span>
            </span>
            <Badge icon="schedule">{featured.endsIn}</Badge>
            <Badge tone="live">Live</Badge>
          </div>

          <h1 className="display lobby__title">
            {featured.titleLead}
            <br />
            <em>{featured.titleItalic}</em>
          </h1>

          <p className="lobby__desc">{featured.description}</p>

          <div className="lobby__ctas">
            <Button icon="arrow_forward">Participate</Button>
            <Button variant="glass" icon="play_circle" onClick={() => scrollTo('#games')}>
              How it works
            </Button>
          </div>
        </div>

        <aside className="lobby__widgets" aria-label="Your season">
          <div className="widget glass">
            <div className="widget__row">
              <span className="display widget__tier">Tier 3</span>
              <span className="num muted widget__small">
                <span ref={xpRef} /> / {TIER_GOAL} XP
              </span>
            </div>
            <div className="track">
              <div className="track__bar" style={{ width: `${progress * 100}%` }} />
            </div>
            <span className="muted widget__small">{TIER_GOAL - xp} XP to Tier 4 · Bref sample kit</span>
          </div>

          <div className="widget widget--row glass">
            <div>
              <p className="eyebrow">Next draw</p>
              <p className="widget__label">Friday, 19:00</p>
            </div>
            <span className="num widget__countdown">
              {pad2(draw.hours)}:{pad2(draw.minutes)}:{pad2(draw.seconds)}
            </span>
          </div>

          <div className="quick">
            {[
              { icon: 'bolt', label: 'Daily', badge: claimedToday ? null : '1', to: '#quests' },
              { icon: 'flag', label: 'Quests', badge: '2', to: '#quests' },
              { icon: 'redeem', label: 'Prizes', badge: null, to: '#prizes' },
            ].map((q) => (
              <button key={q.label} className="quick__btn glass" onClick={() => scrollTo(q.to)}>
                <Icon name={q.icon} />
                <span>{q.label}</span>
                {q.badge && <span className="quick__dot num">{q.badge}</span>}
              </button>
            ))}
          </div>
        </aside>
      </div>

      <button className="lobby__scroll" onClick={() => scrollTo('#games')} aria-label="Scroll to games">
        <span className="lobby__scroll-line" />
      </button>
    </section>
  )
}
