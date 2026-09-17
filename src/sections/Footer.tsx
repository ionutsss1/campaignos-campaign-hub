import { useEffect, useState } from 'react'
import campaignosLogo from '../assets/campaignos-logo.svg'
import { Icon } from '../components/ui'
import { usePlayer } from '../lib/player'
import './footer.css'

export function Footer() {
  const [brand, setBrand] = useState<'a' | 'b'>('a')
  const { notify } = usePlayer()

  useEffect(() => {
    document.documentElement.dataset.brand = brand
  }, [brand])

  const swap = (next: 'a' | 'b') => {
    if (next === brand) return
    setBrand(next)
    notify('palette', next === 'a' ? 'Brand Kit: Demo A' : 'Brand Kit: Demo B')
  }

  return (
    <footer className="footer">
      <div className="footer__row">
        <a className="footer__logo" href="#lobby">
          <span className="hud__mark glass">
            <Icon name="local_laundry_service" />
          </span>
          <span className="hud__word">brandname</span>
        </a>
        <nav className="footer__links" aria-label="Legal">
          {['Terms & Conditions', 'Campaign rules', 'Privacy', 'Cookies', 'Contact'].map((l) => (
            <a key={l} href="#lobby">
              {l}
            </a>
          ))}
        </nav>
        <div className="brandkit glass" role="group" aria-label="Preview Brand Kit theme">
          <span className="brandkit__label">
            <Icon name="palette" />
            Brand Kit
          </span>
          {(['a', 'b'] as const).map((b) => (
            <button key={b} className={`brandkit__opt ${brand === b ? 'is-active' : ''}`} onClick={() => swap(b)} aria-pressed={brand === b}>
              <span className={`brandkit__swatch brandkit__swatch--${b}`} />
              Demo {b.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
      <div className="footer__row footer__row--bottom">
        <span className="muted">© 2026 brandname. Prototype for CampaignOS · Variant B.</span>
        <span className="footer__powered">
          <span>Powered by</span>
          <img src={campaignosLogo} alt="CampaignOS" height={18} />
        </span>
      </div>
    </footer>
  )
}
