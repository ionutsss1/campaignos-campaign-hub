import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react'
import { useMagnetic } from '../lib/hooks'
import type { Rarity } from '../data'

export function Icon({ name, className = '', style }: { name: string; className?: string; style?: CSSProperties }) {
  return (
    <span className={`icon ${className}`} style={style} aria-hidden="true">
      {name}
    </span>
  )
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'solid' | 'glass' | 'ghost' | 'accent'
  size?: 'l' | 'm'
  icon?: string
  iconStart?: string
  magnetic?: boolean
  children: ReactNode
}

export function Button({ variant = 'solid', size = 'l', icon, iconStart, magnetic = true, className = '', children, ...rest }: ButtonProps) {
  const ref = useMagnetic<HTMLButtonElement>(magnetic ? 0.22 : 0)
  return (
    <button ref={ref} className={`btn btn--${variant} btn--${size} ${className}`} {...rest}>
      {iconStart && <Icon name={iconStart} className="icon--start" />}
      <span className="btn__label">{children}</span>
      {icon && <Icon name={icon} className="icon--end" />}
    </button>
  )
}

const rarityLabel: Record<Rarity, string> = { legendary: 'Legendary', epic: 'Epic', rare: 'Rare', common: 'Common' }

export function RarityBadge({ rarity, onImage = false }: { rarity: Rarity; onImage?: boolean }) {
  return <span className={`badge badge--${rarity} ${onImage ? 'badge--on-image' : ''}`}>{rarityLabel[rarity]}</span>
}

export function Badge({ icon, children, tone = 'glass' }: { icon?: string; children: ReactNode; tone?: 'glass' | 'live' | 'accent' }) {
  return (
    <span className={`badge badge--${tone}`}>
      {tone === 'live' && <span className="live-dot" />}
      {icon && <Icon name={icon} />}
      {children}
    </span>
  )
}

export function SectionTitle({ lead, italic, className = '' }: { lead: string; italic: string; className?: string }) {
  return (
    <h2 className={`display section-title ${className}`}>
      {lead}
      <br />
      <em>{italic}</em>
    </h2>
  )
}
