import './AnalysisLoader.css'

export default function AnalysisLoader({ steps, stepIndex, fileName }) {
  return (
    <div className="loader-page">
      <div className="loader-card">
        <div className="loader-spinner-wrap">
          <div className="loader-ring" />
          <div className="loader-ring loader-ring--2" />
          <div className="loader-icon">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <rect width="28" height="28" rx="7" fill="#6366f1" />
              <path d="M8 14l4.5 4.5L20 9" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        <div className="loader-meta">
          <h2 className="loader-title">Analyzing contract</h2>
          {fileName && <p className="loader-filename">{fileName}</p>}
        </div>

        <div className="loader-steps">
          {steps.map((step, i) => (
            <div
              key={step}
              className={`loader-step ${
                i < stepIndex ? 'done' :
                i === stepIndex ? 'active' : 'pending'
              }`}
            >
              <span className="step-indicator">
                {i < stepIndex ? (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <circle cx="7" cy="7" r="7" fill="#22c55e" />
                    <path d="M4 7l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : i === stepIndex ? (
                  <span className="step-dot step-dot--active" />
                ) : (
                  <span className="step-dot step-dot--pending" />
                )}
              </span>
              <span className="step-label">{step}</span>
            </div>
          ))}
        </div>

        <p className="loader-note">
          This usually takes 10–30 seconds depending on document length.
        </p>
      </div>
    </div>
  )
}
