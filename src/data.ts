import gift from './assets/img/gift.webp'
import lobby from './assets/img/lobby.webp'
import map from './assets/img/map.webp'
import posterBuy from './assets/img/poster-buy.webp'
import posterDiscover from './assets/img/poster-discover.webp'
import posterPlay from './assets/img/poster-play.webp'
import posterTell from './assets/img/poster-tell.webp'
import posterTry from './assets/img/poster-try.webp'
import prizeBeauty from './assets/img/prize-beauty.webp'
import prizePersil from './assets/img/prize-persil.webp'
import prizePerwoll from './assets/img/prize-perwoll.webp'
import prizeTrip from './assets/img/prize-trip.webp'

export const images = { lobby, map, gift }

export type Rarity = 'legendary' | 'epic' | 'rare' | 'common'

export const featured = {
  season: 'Season 03',
  seasonName: 'Autumn Fresh',
  endsIn: '18d 09h left',
  titleLead: 'Fashion Week,',
  titleItalic: 'for two',
  description:
    'Buy any Perwoll product, upload your receipt and you could fly to Copenhagen Fashion Week. 1 VIP trip, 250 weekly prizes.',
}

export const games = [
  {
    id: 'play',
    num: '01',
    mechanic: 'Play',
    icon: 'sports_esports',
    title: 'Catch Your Glow',
    italic: '',
    description: 'A 60-second daily mini-game. Play every day, climb the board and enter the draw for 50 beauty kits.',
    xp: '+10 XP daily',
    cta: 'Play now',
    facts: [
      ['emoji_events', '50 beauty kits'],
      ['calendar_month', 'Until 12 Oct'],
    ],
    image: posterPlay,
  },
  {
    id: 'buy',
    num: '02',
    mechanic: 'Buy & Win',
    icon: 'receipt_long',
    title: 'Fashion Week,',
    italic: 'for two',
    description: 'Buy any Perwoll product and upload your receipt. Every receipt is one entry into the draw.',
    xp: '+150 XP',
    cta: 'Participate',
    facts: [
      ['emoji_events', '1 VIP trip · 250 weekly prizes'],
      ['calendar_month', '1 Sep – 31 Oct'],
    ],
    image: posterBuy,
  },
  {
    id: 'tell',
    num: '03',
    mechanic: 'Tell us',
    icon: 'forum',
    title: 'Your laundry',
    italic: 'routine',
    description: 'Three quick questions about how you wash. Takes a minute, pays in XP.',
    xp: '+50 XP',
    cta: 'Answer',
    facts: [
      ['schedule', '1 minute'],
      ['calendar_month', 'Until 30 Sep'],
    ],
    image: posterTell,
  },
  {
    id: 'try',
    num: '04',
    mechanic: 'Try',
    icon: 'redeem',
    title: 'Free Bref',
    italic: 'sample',
    description: 'Claim a free Bref Power Aktiv sample, delivered to your door while stocks last.',
    xp: '+30 XP',
    cta: 'Claim',
    facts: [
      ['inventory_2', '642 of 1,000 left'],
      ['local_shipping', 'Ships in 3 days'],
    ],
    image: posterTry,
  },
  {
    id: 'discover',
    num: '05',
    mechanic: 'Discover',
    icon: 'explore',
    title: 'Your Schwarzkopf',
    italic: 'routine',
    description: 'Answer three questions about your hair and get a routine picked for you.',
    xp: '+40 XP',
    cta: 'Explore',
    facts: [
      ['quiz', '3 questions'],
      ['schedule', '1 minute'],
    ],
    image: posterDiscover,
  },
] as const

export type StopState = 'cleared' | 'live' | 'locked' | 'mystery'

/** Positions are in the 1440 × 860 journey stage coordinate space. */
export const stops: { title: string; meta: string; state: StopState; x: number; y: number }[] = [
  { title: 'Summer Fresh', meta: 'Winners announced', state: 'cleared', x: 150, y: 600 },
  { title: 'Spring Clean Quiz', meta: 'Winners announced', state: 'cleared', x: 340, y: 500 },
  { title: 'Beach Days Samples', meta: '1,000 samples sent', state: 'cleared', x: 540, y: 610 },
  { title: 'Fashion Week for two', meta: 'Live now · until 31 Oct', state: 'live', x: 760, y: 470 },
  { title: 'Sparkle Wheel', meta: 'Starts in 5 days', state: 'locked', x: 990, y: 590 },
  { title: 'Winter Softness', meta: 'October', state: 'locked', x: 1180, y: 500 },
  { title: 'Something new', meta: 'Unlocks 20 Sep', state: 'mystery', x: 1330, y: 590 },
]

export const tiers: { reward: string; icon: string; chest?: boolean }[] = [
  { reward: '+1 entry', icon: 'confirmation_number' },
  { reward: '5 lei voucher', icon: 'sell' },
  { reward: 'Bref sample', icon: 'spa' },
  { reward: 'Perwoll mini', icon: 'dry_cleaning' },
  { reward: 'Mystery chest', icon: 'redeem', chest: true },
  { reward: '+2 entries', icon: 'confirmation_number' },
  { reward: 'Persil pods', icon: 'bubble_chart' },
  { reward: '10 lei voucher', icon: 'sell' },
  { reward: 'Beauty mini kit', icon: 'face_retouching_natural' },
  { reward: 'Mystery chest', icon: 'redeem', chest: true },
  { reward: '+3 entries', icon: 'confirmation_number' },
  { reward: 'Laundry bag', icon: 'shopping_bag' },
  { reward: 'Double XP day', icon: 'bolt' },
  { reward: '20 lei voucher', icon: 'sell' },
  { reward: 'Mystery chest', icon: 'redeem', chest: true },
  { reward: 'Hair care set', icon: 'spa' },
  { reward: '+5 entries', icon: 'confirmation_number' },
  { reward: 'Persil year pack', icon: 'inventory_2' },
  { reward: 'Season badge', icon: 'workspace_premium' },
  { reward: 'Legendary chest', icon: 'redeem', chest: true },
]

export const days = ['+10 XP', '+15 XP', '+1 entry', '+25 XP', '+30 XP', '+2 entries', 'Mystery chest']

export const missions = [
  { title: 'Answer 3 polls this month', done: 2, total: 3, xp: 100, icon: 'forum' },
  { title: 'Upload 2 receipts from different stores', done: 1, total: 2, xp: 150, icon: 'receipt_long' },
  { title: 'Play Catch Your Glow 3 days in a row', done: 0, total: 3, xp: 80, icon: 'sports_esports' },
  { title: 'Complete your profile', done: 1, total: 1, xp: 50, icon: 'task_alt' },
]

export const prizes: {
  id: string
  title: string
  italic?: string
  rarity: Rarity
  stock: string
  meta: [string, string][]
  image: string
  locked?: boolean
  featured?: boolean
}[] = [
  {
    id: 'trip',
    title: 'VIP trip to Copenhagen',
    italic: 'Fashion Week',
    rarity: 'legendary',
    stock: '1 left',
    meta: [
      ['event', 'Draw on 30 Oct'],
      ['receipt_long', 'From Fashion Week for two'],
    ],
    image: prizeTrip,
    featured: true,
  },
  { id: 'beauty', title: 'Beauty glow kit', rarity: 'epic', stock: '50 left', meta: [['event', 'Daily draw']], image: prizeBeauty },
  { id: 'persil', title: 'Persil care bundle', rarity: 'rare', stock: '250 left', meta: [['event', 'Every Friday']], image: prizePersil },
  { id: 'bref', title: 'Free Bref sample', rarity: 'common', stock: '642 left', meta: [['local_shipping', 'Ships in 3 days']], image: posterTry },
  {
    id: 'perwoll',
    title: 'Perwoll care kit',
    rarity: 'legendary',
    stock: 'Tier 4',
    meta: [['lock', 'Unlocks at Tier 4']],
    image: prizePerwoll,
    locked: true,
  },
]

export const winners = [
  { initials: 'AM', name: 'Andreea M.', prize: 'Beauty glow kit', ago: '2h ago' },
  { initials: 'RP', name: 'Radu P.', prize: 'Persil care bundle', ago: '5h ago' },
  { initials: 'IC', name: 'Ioana C.', prize: '200 lei voucher', ago: 'Yesterday' },
  { initials: 'VT', name: 'Vlad T.', prize: 'Bref sample', ago: 'Yesterday' },
  { initials: 'MS', name: 'Maria S.', prize: 'Beauty glow kit', ago: '2 days ago' },
]

export const leaders = [
  { rank: 1, name: 'Mihai P.', xp: '1,240 XP' },
  { rank: 2, name: 'Elena D.', xp: '1,105 XP' },
  { rank: 3, name: 'Andrei S.', xp: '980 XP' },
]

export const XP_PER_TIER = 500 / 3 // tier 3 ends at 500 XP in the demo economy
