import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react'

type Toast = { id: number; icon: string; text: string }

type PlayerState = {
  xp: number
  entries: number
  streak: number
  claimedToday: boolean
  reminded: boolean
  toasts: Toast[]
  claimDay: () => void
  toggleReminder: () => void
  notify: (icon: string, text: string) => void
}

const PlayerContext = createContext<PlayerState | null>(null)

/** Demo player: 320 XP, tier 3 (of 20), 4-day streak where day 4 is claimable. */
export function PlayerProvider({ children }: { children: ReactNode }) {
  const [xp, setXp] = useState(320)
  const [entries] = useState(2)
  const [streak, setStreak] = useState(3)
  const [claimedToday, setClaimed] = useState(false)
  const [reminded, setReminded] = useState(false)
  const [toasts, setToasts] = useState<Toast[]>([])
  const nextId = useRef(1)

  const notify = useCallback((icon: string, text: string) => {
    const id = nextId.current++
    setToasts((t) => [...t, { id, icon, text }])
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200)
  }, [])

  const claimDay = useCallback(() => {
    if (claimedToday) return
    setClaimed(true)
    setXp((v) => v + 25)
    setStreak(4)
    notify('bolt', 'Day 4 claimed · +25 XP')
  }, [claimedToday, notify])

  const toggleReminder = useCallback(() => {
    notify(reminded ? 'notifications_off' : 'notifications_active', reminded ? 'Reminder removed' : "We'll remind you on 20 September")
    setReminded(!reminded)
  }, [reminded, notify])

  const value = useMemo(
    () => ({ xp, entries, streak, claimedToday, reminded, toasts, claimDay, toggleReminder, notify }),
    [xp, entries, streak, claimedToday, reminded, toasts, claimDay, toggleReminder, notify],
  )
  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
}

export function usePlayer() {
  const ctx = useContext(PlayerContext)
  if (!ctx) throw new Error('usePlayer must be used inside PlayerProvider')
  return ctx
}

export const TIER_START = 0
export const TIER_GOAL = 500
export const CURRENT_TIER = 3
