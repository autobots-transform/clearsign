const KEY = 'clearsign_metrics'

export function parseScore(raw) {
  if (typeof raw === 'string' && raw.includes('/')) {
    const [n, d] = raw.split('/').map(Number)
    return d ? (n / d) * 10 : n
  }
  const n = Number(raw) || 0
  return n > 10 ? n / 10 : n
}

export function saveMetric({ fileName, riskScore, highRiskClauseCount }) {
  const all = loadMetrics()
  all.push({ timestamp: Date.now(), fileName, riskScore, highRiskClauseCount })
  try { localStorage.setItem(KEY, JSON.stringify(all)) } catch {}
}

export function getStats() {
  const all = loadMetrics()
  if (!all.length) return null
  const avg = all.reduce((s, m) => s + m.riskScore, 0) / all.length
  const highRisk = all.filter(m => m.riskScore >= 7).length
  return {
    total: all.length,
    avgScore: Math.round(avg * 10) / 10,
    highRiskPct: Math.round((highRisk / all.length) * 100),
  }
}

function loadMetrics() {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]') } catch { return [] }
}
