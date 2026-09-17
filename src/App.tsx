import { Icon } from './components/ui'
import { LenisProvider } from './lib/lenis'
import { PlayerProvider, usePlayer } from './lib/player'
import { BrandPass } from './sections/BrandPass'
import { ChooseGame } from './sections/ChooseGame'
import { DailyQuests } from './sections/DailyQuests'
import { Footer } from './sections/Footer'
import { Hud } from './sections/Hud'
import { Journey } from './sections/Journey'
import { Lobby } from './sections/Lobby'
import { MysteryDrop } from './sections/MysteryDrop'
import { PrizeVault } from './sections/PrizeVault'

function Toasts() {
  const { toasts } = usePlayer()
  return (
    <div className="toasts" role="status" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className="toast glass">
          <Icon name={t.icon} />
          {t.text}
        </div>
      ))}
    </div>
  )
}

export default function App() {
  return (
    <LenisProvider>
      <PlayerProvider>
        <Hud />
        <main>
          <Lobby />
          <ChooseGame />
          <Journey />
          <BrandPass />
          <DailyQuests />
          <PrizeVault />
          <MysteryDrop />
        </main>
        <Footer />
        <Toasts />
      </PlayerProvider>
    </LenisProvider>
  )
}
