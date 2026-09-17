import { useEffect, useState } from 'react'
import { Icon } from '../components/ui'
import { ScrollTrigger } from '../lib/gsap'
import { useTweenedNumber } from '../lib/hooks'
import { useScrollTo } from '../lib/lenis'
import { TIER_GOAL, usePlayer } from '../lib/player'
import './hud.css'

const tabs = [
  { id: 'lobby', label: 'Lobby' },
  { id: 'games', label: 'Games' },
  { id: 'journey', label: 'Journey' },
  { id: 'pass', label: 'Pass' },
  { id: 'quests', label: 'Quests' },
  { id: 'prizes', label: 'Prizes' },
]

const whole = (n: number) => Math.round(n).toString()

export function Hud() {
  const { xp, entries, streak } = usePlayer()
  const [active, setActive] = useState('lobby')
  const [scrolled, setScrolled] = useState(false)
  const scrollTo = useScrollTo()
  const xpRef = useTweenedNumber(xp, whole)
  const streakRef = useTweenedNumber(streak, whole)

  useEffect(() => {
    const triggers = tabs.map((t) =>
      ScrollTrigger.create({
        trigger: `#${t.id}`,
        start: 'top 45%',
        end: 'bottom 45%',
        onToggle: (self) => self.isActive && setActive(t.id),
      }),
    )
    const bar = ScrollTrigger.create({
      start: 60,
      end: 'max',
      onToggle: (self) => setScrolled(self.isActive),
    })
    return () => {
      triggers.forEach((t) => t.kill())
      bar.kill()
    }
  }, [])

  const ring = Math.min(1, xp / TIER_GOAL)

  return (
    <header className={`hud ${scrolled ? 'is-scrolled' : ''}`}>
      <a className="hud__logo" href="#lobby" onClick={(e) => (e.preventDefault(), scrollTo('#lobby'))}>
        <span className="hud__mark glass">
          <Icon name="local_laundry_service" />
        </span>
        <span className="hud__word">brandname</span>
      </a>

      <nav className="hud__tabs glass" aria-label="Hub sections">
        {tabs.map((t) => (
          <a
            key={t.id}
            href={`#${t.id}`}
            className={`hud__tab ${active === t.id ? 'is-active' : ''}`}
            aria-current={active === t.id ? 'true' : undefined}
            onClick={(e) => {
              e.preventDefault()
              scrollTo(`#${t.id}`)
            }}
          >
            {t.label}
          </a>
        ))}
      </nav>

      <div className="hud__player">
        <span className="counter glass" title="Experience points">
          <Icon name="bolt" className="counter__icon counter__icon--accent" />
          <span ref={xpRef} className="num counter__value" />
          <span className="counter__label">XP</span>
        </span>
        <span className="counter glass hide-sm" title="Draw entries">
          <Icon name="confirmation_number" className="counter__icon" />
          <span className="num counter__value">{entries}</span>
          <span className="counter__label">entries</span>
        </span>
        <span className="counter glass" title="Daily streak">
          <Icon name="local_fire_department" className="counter__icon counter__icon--gold" />
          <span ref={streakRef} className="num counter__value" />
          <span className="counter__label hide-sm">day streak</span>
        </span>
        <span className="hud__avatar" style={{ ['--ring' as string]: ring }} aria-label="Level 3 profile">
          AM
        </span>
      </div>
    </header>
  )
}
