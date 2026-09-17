import { useLayoutEffect, useRef, useState } from 'react'
import { Button, Icon, PrizeBadge, SectionTitle } from '../components/ui'
import { prizes, type PrizeKind } from '../data'
import { Flip, gsap, MOTION_OK, revealTitle, ScrollTrigger, useGSAP } from '../lib/gsap'
import './vault.css'

type Filter = 'all' | PrizeKind
const filters: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All prizes' },
  { id: 'grand', label: 'Grand prize' },
  { id: 'draw', label: 'Daily & weekly' },
  { id: 'guaranteed', label: 'Guaranteed' },
  { id: 'pass', label: 'Pass rewards' },
]

export function PrizeVault() {
  const root = useRef<HTMLElement>(null)
  const grid = useRef<HTMLDivElement>(null)
  const [filter, setFilter] = useState<Filter>('all')
  const flipState = useRef<Flip.FlipState | null>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        const split = revealTitle('.vault .section-title')
        gsap.from('.vault__filters', { y: 20, autoAlpha: 0, scrollTrigger: { trigger: '.vault__filters', start: 'top 90%', once: true } })
        gsap.from('.prize', {
          y: 80,
          autoAlpha: 0,
          stagger: 0.1,
          duration: 1.5,
          clearProps: 'transform',
          scrollTrigger: { trigger: '.vault__grid', start: 'top 80%', once: true },
        })
        gsap.from('.prize__img', {
          scale: 1.3,
          stagger: 0.1,
          duration: 2.2,
          scrollTrigger: { trigger: '.vault__grid', start: 'top 80%', once: true },
        })
        return () => split.revert()
      })
    },
    { scope: root },
  )

  const prevHeight = useRef(0)

  const choose = (next: Filter) => {
    if (next === filter || !grid.current) return
    flipState.current = Flip.getState(grid.current.querySelectorAll('.prize'))
    prevHeight.current = grid.current.offsetHeight
    setFilter(next)
  }

  useLayoutEffect(() => {
    const state = flipState.current
    const el = grid.current
    if (!state || !el) return
    flipState.current = null
    // Tween the grid's height alongside the Flip and clip it meanwhile, so absolutely-positioned
    // cards never spill over the section below while the layout changes.
    const to = el.offsetHeight
    gsap.set(el, { height: prevHeight.current, overflow: 'hidden' })
    gsap
      .timeline({
        onComplete: () => {
          gsap.set(el, { clearProps: 'height,overflow' })
          ScrollTrigger.refresh()
        },
      })
      .to(el, { height: to, duration: 0.9, ease: 'expo.inOut' }, 0)
      .add(
        Flip.from(state, {
          duration: 0.9,
          ease: 'expo.inOut',
          scale: true,
          absolute: true,
          targets: el.querySelectorAll('.prize'),
          onEnter: (els) => gsap.fromTo(els, { autoAlpha: 0, scale: 0.94 }, { autoAlpha: 1, scale: 1, duration: 0.8, delay: 0.2 }),
          onLeave: (els) => gsap.to(els, { autoAlpha: 0, scale: 0.94, duration: 0.4 }),
        }),
        0,
      )
  }, [filter])

  return (
    <section id="prizes" className="section vault" ref={root}>
      <div className="section-header">
        <div className="section-header__lead">
          <SectionTitle lead="What you can" italic="actually win." />
        </div>
        <div className="vault__filters glass" role="tablist" aria-label="Filter prizes">
          {filters.map((f) => (
            <button
              key={f.id}
              role="tab"
              aria-selected={filter === f.id}
              className={`vault__filter ${filter === f.id ? 'is-active' : ''}`}
              onClick={() => choose(f.id)}
            >
              {f.id !== 'all' && <span className={`vault__dot vault__dot--${f.id}`} />}
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className={`vault__grid vault__grid--${filter}`} ref={grid}>
        {prizes.map((p) => {
          const hidden = filter !== 'all' && p.kind !== filter
          return (
            <article
              key={p.id}
              className={`prize prize--${p.kind} ${p.featured && filter === 'all' ? 'prize--featured' : ''} ${p.locked ? 'is-locked' : ''}`}
              style={{ display: hidden ? 'none' : undefined }}
              data-flip-id={p.id}
            >
              <img className="prize__img" src={p.image} alt="" loading="lazy" />
              <div className="prize__scrim" />
              <div className="prize__top">
                <PrizeBadge kind={p.kind} label={p.label} onImage />
                <span className="badge badge--glass badge--on-image">
                  <Icon name={p.locked ? 'lock' : 'inventory_2'} />
                  {p.stock}
                </span>
              </div>
              <div className="prize__body">
                <h3 className="display prize__title">
                  {p.title}
                  {p.italic && (
                    <>
                      <br />
                      <em>{p.italic}</em>
                    </>
                  )}
                </h3>
                <ul className="prize__meta">
                  {p.meta.map(([icon, text]) => (
                    <li key={text}>
                      <Icon name={icon} />
                      {text}
                    </li>
                  ))}
                </ul>
                {p.featured && filter === 'all' && (
                  <div className="prize__ctas">
                    <Button size="m" icon="arrow_forward">
                      Enter to win
                    </Button>
                    <Button size="m" variant="glass">
                      Prize details
                    </Button>
                  </div>
                )}
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
