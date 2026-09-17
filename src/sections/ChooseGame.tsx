import { useRef, useState } from 'react'
import { Badge, Button, Icon, SectionTitle } from '../components/ui'
import { games } from '../data'
import { gsap, MOTION_OK, revealTitle, useGSAP } from '../lib/gsap'
import './choose.css'

export function ChooseGame() {
  const root = useRef<HTMLElement>(null)
  const [active, setActive] = useState(1)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        const split = revealTitle('.choose .section-title')
        gsap.from('.choose .section-aside, .choose .section-header .btn', {
          y: 24,
          autoAlpha: 0,
          stagger: 0.1,
          scrollTrigger: { trigger: '.choose .section-header', start: 'top 80%', once: true },
        })
        gsap.from('.poster', {
          clipPath: 'inset(100% 0% 0% 0%)',
          duration: 1.6,
          stagger: 0.09,
          ease: 'expo.inOut',
          scrollTrigger: { trigger: '.posters', start: 'top 85%', once: true },
        })
        gsap.from('.poster__img', {
          scale: 1.35,
          duration: 2.2,
          stagger: 0.09,
          ease: 'expo.out',
          scrollTrigger: { trigger: '.posters', start: 'top 85%', once: true },
        })
        return () => split.revert()
      })
    },
    { scope: root },
  )

  return (
    <section id="games" className="section choose" ref={root}>
      <div className="section-header">
        <div className="section-header__lead">
          <SectionTitle lead="Five ways to play," italic="one season." />
        </div>
        <div className="choose__aside">
          <p className="section-aside">Every campaign is a different way in. Pick the one that fits your minute, your mood or your shopping list.</p>
          <Button variant="ghost" size="m" icon="arrow_forward">
            All 7 campaigns
          </Button>
        </div>
      </div>

      <div className="posters" role="list">
        {games.map((g, i) => (
          <article
            key={g.id}
            role="listitem"
            className={`poster ${active === i ? 'is-active' : ''}`}
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            tabIndex={0}
          >
            <img className="poster__img" src={g.image} alt="" loading="lazy" />
            <div className="poster__scrim" />
            <div className="poster__top">
              <span className="num poster__num">{g.num}</span>
              <Badge icon="bolt">{g.xp}</Badge>
            </div>
            <div className="poster__body">
              <span className="poster__mech">{g.mechanic}</span>
              <h3 className="display poster__title">
                {g.title} {g.italic && <em>{g.italic}</em>}
              </h3>
              <div className="poster__more">
                <div className="poster__more-inner">
                  <p className="poster__desc">{g.description}</p>
                  <ul className="poster__facts">
                    {g.facts.map(([, text]) => (
                      <li key={text}>{text}</li>
                    ))}
                  </ul>
                  <div className="poster__ctas">
                    <Button size="m" icon="arrow_forward" tabIndex={active === i ? 0 : -1}>
                      {g.cta}
                    </Button>
                    <Button size="m" variant="glass" tabIndex={active === i ? 0 : -1}>
                      Learn more
                    </Button>
                  </div>
                </div>
              </div>
              <span className="poster__go">
                {g.cta}
                <Icon name="arrow_forward" />
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
