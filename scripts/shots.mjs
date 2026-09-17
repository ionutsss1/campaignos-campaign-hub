// QA helper: screenshots each section at a given viewport using the local Edge install.
// Usage: node scripts/shots.mjs [width] [height] [outDir]
import puppeteer from 'puppeteer-core'
import { mkdirSync } from 'node:fs'

const [w = '1440', h = '900', out = 'shots'] = process.argv.slice(2)
const url = process.env.URL ?? 'http://localhost:5190/'
mkdirSync(out, { recursive: true })

const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  headless: true,
  args: ['--hide-scrollbars'],
})
const page = await browser.newPage()
await page.setViewport({ width: Number(w), height: Number(h), deviceScaleFactor: 1, isMobile: Number(w) < 700, hasTouch: Number(w) < 700 })
const logs = []
page.on('console', (m) => (m.type() === 'error' || m.type() === 'warning') && logs.push(`${m.type()}: ${m.text()}`))
page.on('pageerror', (e) => logs.push(`pageerror: ${e.message}`))
await page.goto(url, { waitUntil: 'networkidle0' })
await new Promise((r) => setTimeout(r, 3500))
await page.screenshot({ path: `${out}/00-lobby.png` })

const ids = ['games', 'journey', 'pass', 'quests', 'prizes', 'mystery']
for (const [i, id] of ids.entries()) {
  await page.evaluate((sel) => {
    const el = document.querySelector(sel)
    window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY)
  }, `#${id}`)
  await new Promise((r) => setTimeout(r, 2600))
  await page.screenshot({ path: `${out}/${String(i + 1).padStart(2, '0')}-${id}.png` })
}
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
await new Promise((r) => setTimeout(r, 1500))
await page.screenshot({ path: `${out}/07-footer.png` })
console.log(logs.length ? logs.join('\n') : 'no console errors')
await browser.close()
