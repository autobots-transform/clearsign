import { useState, useRef, useCallback } from 'react'
import UploadZone from './components/UploadZone'
import AnalysisLoader from './components/AnalysisLoader'
import Results from './components/Results'
import './App.css'

const API_ENDPOINT = 'http://localhost:5565/webhook'
const API_KEY = import.meta.env.VITE_API_KEY

const STEPS = [
  'Uploading contract...',
  'Extracting text...',
  'Analyzing risks...',
]

function App() {
  const [phase, setPhase] = useState('upload') // 'upload' | 'loading' | 'results' | 'error'
  const [stepIndex, setStepIndex] = useState(0)
  const [results, setResults] = useState(null)
  const [fileName, setFileName] = useState('')
  const [error, setError] = useState('')
  const stepTimers = useRef([])

  const clearTimers = () => {
    stepTimers.current.forEach(clearTimeout)
    stepTimers.current = []
  }

  const analyzeContract = useCallback(async (file) => {
    setFileName(file.name)
    setPhase('loading')
    setStepIndex(0)
    setError('')

    const t1 = setTimeout(() => setStepIndex(1), 900)
    const t2 = setTimeout(() => setStepIndex(2), 2000)
    stepTimers.current = [t1, t2]

    try {
      const formData = new FormData()
      formData.append('file', file, file.name)

      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
        },
        body: formData,
      })

      if (!response.ok) {
        const text = await response.text()
        throw new Error(`Server error ${response.status}: ${text}`)
      }

      const raw = await response.json()

      // Response shape: { status, data: { objects: { file: { answers: [...] } } } }
      let answers = []
      if (raw?.data?.objects) {
        const firstObj = Object.values(raw.data.objects)[0]
        answers = firstObj?.answers ?? []
      } else if (Array.isArray(raw)) {
        const completed = raw.find(r => r.action === 'complete') ?? raw[raw.length - 1]
        answers = completed?.result?.answers ?? completed?.answers ?? []
      } else if (raw?.result?.answers) {
        answers = raw.result.answers
      } else if (raw?.answers) {
        answers = raw.answers
      }

      // Extract JSON from a string, handling markdown code fences and embedded objects
      const extractJson = (str) => {
        if (typeof str !== 'string') return null
        try { return JSON.parse(str) } catch {}
        const stripped = str.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '').trim()
        try { return JSON.parse(stripped) } catch {}
        const match = str.match(/\{[\s\S]*\}/)
        if (match) { try { return JSON.parse(match[0]) } catch {} }
        return null
      }

      // Search answers in reverse (JSON is typically last)
      let data = null
      for (const answer of [...answers].reverse()) {
        data = extractJson(answer)
        if (data && typeof data === 'object' && data.risk_score !== undefined) break
        data = null
      }

      if (!data) throw new Error('No structured analysis returned from pipeline.')

      clearTimers()
      setResults(data)
      setPhase('results')
    } catch (err) {
      clearTimers()
      setError(err.message || 'An unexpected error occurred.')
      setPhase('error')
    }
  }, [])

  const reset = () => {
    clearTimers()
    setPhase('upload')
    setResults(null)
    setFileName('')
    setError('')
    setStepIndex(0)
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <rect width="28" height="28" rx="7" fill="#6366f1" />
              <path d="M8 14l4.5 4.5L20 9" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="logo-text">ClearSign</span>
          </div>
          {phase !== 'upload' && (
            <button className="btn-ghost" onClick={reset}>
              ← New Review
            </button>
          )}
        </div>
      </header>

      <main className="main">
        {phase === 'upload' && (
          <div className="upload-page">
            <div className="hero-text">
              <div className="badge">AI-Powered Contract Review</div>
              <h1>Know what you're signing<br /><span className="gradient-text">before you sign it.</span></h1>
              <p className="hero-sub">Upload any contract and get an instant risk analysis, plain-English summary, and actionable recommendations — in seconds.</p>
            </div>
            <UploadZone onFile={analyzeContract} />
            <div className="trust-row">
              <span className="trust-item">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1L8.5 5H13L9.5 7.5L10.5 12L7 9.5L3.5 12L4.5 7.5L1 5H5.5L7 1Z" fill="#6366f1"/></svg>
                Instant analysis
              </span>
              <span className="trust-divider" />
              <span className="trust-item">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1.5C4 1.5 1.5 4 1.5 7S4 12.5 7 12.5 12.5 10 12.5 7 10 1.5 7 1.5ZM5.5 9.5L3 7L4 6L5.5 7.5L10 3L11 4L5.5 9.5Z" fill="#6366f1"/></svg>
                Risk scoring
              </span>
              <span className="trust-divider" />
              <span className="trust-item">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="2" y="2" width="10" height="10" rx="2" stroke="#6366f1" strokeWidth="1.5"/><path d="M4.5 7h5M4.5 5h5M4.5 9h3" stroke="#6366f1" strokeWidth="1.2" strokeLinecap="round"/></svg>
                Plain English summary
              </span>
            </div>
          </div>
        )}

        {phase === 'loading' && (
          <AnalysisLoader steps={STEPS} stepIndex={stepIndex} fileName={fileName} />
        )}

        {phase === 'results' && results && (
          <Results data={results} fileName={fileName} onReset={reset} />
        )}

        {phase === 'error' && (
          <div className="error-page">
            <div className="error-icon">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="22" stroke="#ef4444" strokeWidth="2" />
                <path d="M24 15v10M24 31v2" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
            <h2>Analysis Failed</h2>
            <p className="error-msg">{error}</p>
            <button className="btn-primary" onClick={reset}>Try Again</button>
          </div>
        )}
      </main>

      <footer className="footer">
        <p>© 2025 ClearSign · AI contract analysis · Not legal advice</p>
      </footer>
    </div>
  )
}

export default App
