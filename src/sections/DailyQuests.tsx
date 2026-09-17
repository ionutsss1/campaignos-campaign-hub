import { useRef, useState } from 'react'
import { Button, Icon, SectionTitle } from '../components/ui'
import { days, missions } from '../data'
import { gsap, MOTION_OK, revealTitle, useGSAP } from '../lib/gsap'
import { pad2, useCountdown } from '../lib/hooks'
import { usePlayer } from '../lib/player'
import './daily.css'

const TODAY = 3 // zero-based: day 4

export function DailyQuests() {
  const root = useRef<HTMLElement>(null)
  const { claimedToday, claimDay } = usePlayer()
  const [nextAt] = useState(() => Date.now() + (23 * 3600 + 35 * 60 + 16) * 1000)
  const next = useCountdown(nextAt)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        const split = revealTitle('.daily .section-title')
        gsap.from('.day', {
          y: 50,
          autoAlpha: 0,
          stagger: 0.07,
          duration: 1.3,
          clearProps: 'transform',
          scrollTrigger: { trigger: '.days', start: 'top 85%', once: true },
        })
        gsap.from('.mission', {
          y: 32,
          clearProps: 'transform',
          autoAlpha: 0,
          stagger: 0.08,
          duration: 1.2,
          scrollTrigger: { trigger: '.missions', start: 'top 85%', once: true },
        })
        gsap.from('.mission .track__bar', {
          scaleX: 0,
          stagger: 0.08,
          duration: 1.6,
          delay: 0.3,
          ease: 'power3.inOut',
          scrollTrigger: { trigger: '.missions', start: 'top 80%', once: true },
        })
        gsap.from('.stepper > *', {
          scale: 0.4,
          autoAlpha: 0,
          stagger: 0.06,
          ease: 'back.out(2)',
          scrollTrigger: { trigger: '.stepper', start: 'top 90%', once: true },
        })
        return () => split.revert()
      })
    },
    { scope: root },
  )

  const onClaim = () => {
    if (claimedToday) return
    const tile = root.current?.querySelector('.day--today')
    if (tile && window.matchMedia(MOTION_OK).matches) {
      gsap
        .timeline()
        .to(tile, { rotationY: 90, duration: 0.35, ease: 'power2.in' })
        .call(() => claimDay())
        .fromTo(tile, { rotationY: -90 }, { rotationY: 0, duration: 0.8, ease: 'back.out(1.8)' })
    } else {
      claimDay()
    }
  }

  return (
    <section id="quests" className="section daily" ref={root}>
      <div className="section-header">
        <div className="section-header__lead">
          <SectionTitle lead="Come back tomorrow," italic="it pays." />
        </div>
        <div className="daily__claim">
          <div className="daily__next">
            <p className="eyebrow">{claimedToday ? 'Next reward in' : 'Today’s reward'}</p>
            <p className="num daily__timer">
              {claimedToday ? `${pad2(next.hours)}:${pad2(next.minutes)}:${pad2(next.seconds)}` : '+25 XP'}
            </p>
          </div>
          <Button icon={claimedToday ? 'check' : 'bolt'} onClick={onClaim} disabled={claimedToday}>
            {claimedToday ? 'Claimed' : 'Claim day 4'}
          </Button>
        </div>
      </div>

      <ol className="days">
        {days.map((reward, i) => {
          const state = i < TODAY || (i === TODAY && claimedToday) ? 'claimed' : i === TODAY ? 'today' : 'locked'
          return (
            <li key={i} className={`day day--${state} ${i === TODAY ? 'day--today' : ''}`}>
              <span className="day__label">Day {i + 1}</span>
              <Icon
                name={state === 'claimed' ? 'check' : state === 'today' ? 'bolt' : i === days.length - 1 ? 'redeem' : 'lock'}
                className="day__icon"
              />
              <span className="num day__reward">{reward}</span>
            </li>
          )
        })}
      </ol>

      <div className="quests">
        <div className="quests__intro">
          <h3 className="display quests__title">Quest board</h3>
          <p className="muted">Five days of small missions. Finish a day to unlock its reward, finish all five for the season badge.</p>
          <div className="stepper" aria-label="Quest day 2 of 5">
            {[1, 2, 3, 4, 5].map((n) => (
              <span key={n} className={`step ${n < 2 ? 'is-done' : n === 2 ? 'is-current' : ''}`}>
                {n < 2 ? <Icon name="check" /> : <span className="num">{n}</span>}
              </span>
            ))}
          </div>
          <div className="quests__reward glass">
            <div className="quests__reward-top">
              <span className="quests__reward-icon">
                <Icon name="workspace_premium" />
              </span>
              <span className="badge badge--glass">Day 2 reward</span>
            </div>
            <div className="quests__reward-body">
              <h4 className="display quests__reward-title">
                Double XP <em>weekend</em>
              </h4>
              <p className="muted">Finish today’s missions to earn double XP on everything from Friday to Sunday.</p>
            </div>
            <div className="quests__reward-progress">
              <div className="track">
                <div className="track__bar" style={{ width: '50%' }} />
              </div>
              <span className="num muted">2 / 4 missions</span>
            </div>
          </div>
        </div>

        <ul className="missions">
          {missions.map((m) => {
            const done = m.done >= m.total
            return (
              <li key={m.title} className={`mission ${done ? 'is-done' : ''}`}>
                <div className="mission__head">
                  <span className="mission__icon">
                    <Icon name={done ? 'task_alt' : m.icon} />
                  </span>
                  <span className="num mission__xp">
                    <Icon name="bolt" />+{m.xp} XP
                  </span>
                </div>
                <p className="mission__title">{m.title}</p>
                <div className="mission__foot">
                  <div className="mission__progress">
                    <div className="track">
                      <div className="track__bar" style={{ width: `${Math.max(3, (m.done / m.total) * 100)}%` }} />
                    </div>
                    <span className="num muted">
                      {m.done} / {m.total}
                    </span>
                  </div>
                  <button className={`icon-btn mission__go ${done ? '' : 'glass'}`} aria-label={done ? 'Completed' : `Go to ${m.title}`}>
                    <Icon name={done ? 'check' : 'arrow_forward'} />
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
