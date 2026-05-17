import RiskScore from './RiskScore'
import './Results.css'

function Section({ title, icon, children, className = '' }) {
  return (
    <div className={`section-card ${className}`}>
      <div className="section-header">
        <span className="section-icon">{icon}</span>
        <h3 className="section-title">{title}</h3>
      </div>
      <div className="section-body">{children}</div>
    </div>
  )
}

function ConfidencePill({ score }) {
  const pct = Math.round((score ?? 0) * 100)
  const color = pct >= 80 ? 'red' : pct >= 60 ? 'amber' : 'neutral'
  return (
    <span className={`confidence-pill confidence-pill--${color}`}>
      {pct}% confidence
    </span>
  )
}

export default function Results({ data, fileName, onReset }) {
  const {
    risk_score,
    high_risk_clauses,
    missing_protections,
    plain_english_summary,
    top_3_actions,
    disclaimer,
  } = data

  // Handles "9/10" string, plain 0-10, or 0-100 percentage
  const rawScore = (() => {
    if (typeof risk_score === 'string' && risk_score.includes('/')) {
      const [n, d] = risk_score.split('/').map(Number)
      return d ? (n / d) * 10 : n
    }
    const n = Number(risk_score) || 0
    return n > 10 ? n / 10 : n
  })()
  const top_actions = top_3_actions

  return (
    <div className="results-page">
      <div className="results-header">
        <div className="results-meta">
          <div className="results-file">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="1" width="9" height="14" rx="2" stroke="#6b7280" strokeWidth="1.3" />
              <path d="M5 5h6M5 8h6M5 11h4" stroke="#6b7280" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            <span>{fileName || 'Contract'}</span>
          </div>
          <span className="results-tag">Analysis complete</span>
        </div>
        <h1 className="results-title">Contract Review Results</h1>
      </div>

      <div className="results-grid">
        {/* Risk Score — full width hero card */}
        <div className="grid-full">
          <RiskScore score={rawScore} />
        </div>

        {/* High Risk Options Callout */}
        {rawScore >= 7 && (
          <div className="grid-full">
            <div className="highrisk-callout">
              <div className="highrisk-callout-header">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 2L18 16H2L10 2Z" stroke="#f97316" strokeWidth="1.6" strokeLinejoin="round" />
                  <path d="M10 8v4M10 13.5v.5" stroke="#f97316" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
                <h3 className="highrisk-callout-title">High Risk Contract — Your Options Without an Attorney</h3>
              </div>
              <div className="highrisk-options">
                <div className="highrisk-option">
                  <div className="highrisk-option-label">
                    <span className="highrisk-option-num">1</span>
                    <span className="highrisk-option-name">Negotiate Yourself</span>
                  </div>
                  <p className="highrisk-option-text">Use the recommended actions below as your negotiation script. Email the other party and ask them to remove these specific clauses. Most people will agree to reasonable changes.</p>
                </div>
                <div className="highrisk-option">
                  <div className="highrisk-option-label">
                    <span className="highrisk-option-num">2</span>
                    <span className="highrisk-option-name">Free Legal Help</span>
                  </div>
                  <p className="highrisk-option-text">Your state bar association offers free 30-minute consultations. Visit lawhelp.org to find free legal resources in your state.</p>
                </div>
                <div className="highrisk-option">
                  <div className="highrisk-option-label">
                    <span className="highrisk-option-num">3</span>
                    <span className="highrisk-option-name">Walk Away Informed</span>
                  </div>
                  <p className="highrisk-option-text">Knowing this contract is high risk before signing is valuable. A dispute could cost you far more than this contract is worth.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Summary */}
        {plain_english_summary && (
          <div className="grid-full">
            <Section
              title="Plain English Summary"
              icon={
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <rect x="2" y="2" width="14" height="14" rx="3" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M5 6.5h8M5 9h8M5 11.5h5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                </svg>
              }
            >
              <p className="summary-text">{plain_english_summary}</p>
            </Section>
          </div>
        )}

        {/* High Risk Clauses */}
        {high_risk_clauses && high_risk_clauses.length > 0 && (
          <div className="grid-left">
            <Section
              title={`High Risk Clauses (${high_risk_clauses.length})`}
              icon={
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M9 2L16 14H2L9 2Z" stroke="#ef4444" strokeWidth="1.5" strokeLinejoin="round" />
                  <path d="M9 7v4M9 12.5v.5" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              }
              className="section-card--risk"
            >
              <div className="clauses-list">
                {high_risk_clauses.map((clause, i) => (
                  <div key={i} className="clause-item">
                    <div className="clause-top">
                      <span className="clause-index">{i + 1}</span>
                      <p className="clause-title">{clause.clause_name || clause.title || clause.clause || `Risk Clause ${i + 1}`}</p>
                      {(clause.confidence_score ?? clause.confidence) != null && (
                        <ConfidencePill score={clause.confidence_score ?? clause.confidence} />
                      )}
                    </div>
                    {(clause.exact_quote || clause.quote) && (
                      <blockquote className="clause-quote">
                        "{clause.exact_quote || clause.quote}"
                      </blockquote>
                    )}
                    {(clause.risk_explanation || clause.explanation) && (
                      <p className="clause-explanation">{clause.risk_explanation || clause.explanation}</p>
                    )}
                  </div>
                ))}
              </div>
            </Section>
          </div>
        )}

        {/* Missing Protections */}
        {missing_protections && missing_protections.length > 0 && (
          <div className="grid-right">
            <Section
              title="Missing Protections"
              icon={
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M9 2L15 5v5c0 3.5-3 6-6 6S3 13.5 3 10V5l6-3Z" stroke="#f59e0b" strokeWidth="1.5" strokeLinejoin="round" />
                  <path d="M9 7v3M9 11.5v.5" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              }
              className="section-card--warning"
            >
              <ul className="missing-list">
                {missing_protections.map((item, i) => (
                  <li key={i} className="missing-item">
                    <span className="missing-icon">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <circle cx="7" cy="7" r="6" stroke="#f59e0b" strokeWidth="1.3" />
                        <path d="M5 7h4M7 5v4" stroke="#f59e0b" strokeWidth="1.3" strokeLinecap="round" />
                      </svg>
                    </span>
                    <span>{typeof item === 'string' ? item : item.protection || item.description || JSON.stringify(item)}</span>
                  </li>
                ))}
              </ul>
            </Section>
          </div>
        )}

        {/* Top Actions */}
        {top_actions && top_actions.length > 0 && (
          <div className="grid-full">
            <Section
              title="Recommended Actions"
              icon={
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M9 2v14M9 2L5 6M9 2l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              }
            >
              <div className="actions-list">
                {top_actions.slice(0, 3).map((action, i) => (
                  <div key={i} className="action-item">
                    <div className="action-number">{i + 1}</div>
                    <p className="action-text">
                      {typeof action === 'string' ? action : action.action || action.description || JSON.stringify(action)}
                    </p>
                  </div>
                ))}
              </div>
            </Section>
          </div>
        )}
      </div>

      {/* Disclaimer — only for critical risk (9-10) */}
      {rawScore >= 9 && (
        <div className="disclaimer">
          <svg className="disclaimer-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.3" />
            <path d="M8 7v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="8" cy="5" r="0.75" fill="currentColor" />
          </svg>
          <p>
            {disclaimer || 'This analysis is generated by AI and is for informational purposes only. It does not constitute legal advice. Always consult a qualified attorney before signing any contract.'}
          </p>
        </div>
      )}

      <div className="results-footer">
        <button className="btn-primary" onClick={onReset}>
          Review Another Contract
        </button>
      </div>
    </div>
  )
}
