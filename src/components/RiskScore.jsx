import './RiskScore.css'

function getRiskLevel(score) {
  if (score <= 3) return { label: 'Low Risk', color: 'green', description: 'Looks standard, safe to sign after reviewing flagged items.' }
  if (score <= 6) return { label: 'Moderate Risk', color: 'amber', description: 'Negotiate the recommended actions before signing.' }
  if (score <= 8) return { label: 'High Risk', color: 'orange', description: 'Several aggressive clauses, use recommended actions to push back.' }
  return { label: 'Critical Risk', color: 'red', description: 'Do not sign as-is, consider legal advice.' }
}

export default function RiskScore({ score }) {
  const clamped = Math.min(10, Math.max(0, score))
  const { label, color, description } = getRiskLevel(clamped)
  const pct = (clamped / 10) * 100

  return (
    <div className={`risk-card risk-card--${color}`}>
      <div className="risk-left">
        <div className={`risk-score-display risk-score-display--${color}`}>
          <span className="risk-number">{Number.isInteger(clamped) ? clamped : clamped.toFixed(1)}</span>
          <span className="risk-denom">/10</span>
        </div>
        <div className="risk-text">
          <div className={`risk-label risk-label--${color}`}>{label}</div>
          <p className="risk-desc">{description}</p>
        </div>
      </div>

      <div className="risk-right">
        <div className="risk-bar-label">
          <span>Risk Level</span>
          <span className={`risk-bar-pct risk-bar-pct--${color}`}>{Math.round(pct)}%</span>
        </div>
        <div className="risk-bar-track">
          <div
            className={`risk-bar-fill risk-bar-fill--${color}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="risk-scale">
          <span>Low</span>
          <span>Moderate</span>
          <span>High</span>
        </div>

        <div className="risk-zones">
          <div className="risk-zone risk-zone--green">
            <span className="zone-dot" />1–3
          </div>
          <div className="risk-zone risk-zone--amber">
            <span className="zone-dot" />4–6
          </div>
          <div className="risk-zone risk-zone--orange">
            <span className="zone-dot" />7–8
          </div>
          <div className="risk-zone risk-zone--red">
            <span className="zone-dot" />9–10
          </div>
        </div>
      </div>
    </div>
  )
}
