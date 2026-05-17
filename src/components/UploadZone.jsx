import { useState, useRef } from 'react'
import './UploadZone.css'

const ACCEPT = '.pdf,application/pdf'

export default function UploadZone({ onFile }) {
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef(null)

  const handleFile = (file) => {
    if (!file) return
    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file.')
      return
    }
    onFile(file)
  }

  const onDragOver = (e) => {
    e.preventDefault()
    setDragging(true)
  }

  const onDragLeave = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragging(false)
    }
  }

  const onDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    handleFile(file)
  }

  const onInputChange = (e) => {
    handleFile(e.target.files[0])
  }

  return (
    <div
      className={`upload-zone ${dragging ? 'dragging' : ''}`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={() => inputRef.current?.click()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
      aria-label="Upload PDF contract"
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        onChange={onInputChange}
        className="upload-input"
        aria-hidden="true"
        tabIndex={-1}
      />

      <div className="upload-icon-wrap">
        <svg className="upload-icon" width="40" height="40" viewBox="0 0 40 40" fill="none">
          <rect width="40" height="40" rx="10" fill="rgba(99,102,241,0.12)" />
          <path
            d="M20 26V14M20 14L15 19M20 14L25 19"
            stroke="#818cf8"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 28h16"
            stroke="#818cf8"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.4"
          />
        </svg>
      </div>

      <div className="upload-text">
        <p className="upload-title">
          {dragging ? 'Drop your contract here' : 'Upload your contract'}
        </p>
        <p className="upload-sub">
          Drag & drop or <span className="upload-link">browse files</span> · PDF only
        </p>
      </div>

      <div className="upload-formats">
        <span className="format-tag">Employment</span>
        <span className="format-tag">Freelance</span>
        <span className="format-tag">NDA</span>
        <span className="format-tag">SaaS</span>
        <span className="format-tag">Real estate</span>
      </div>
    </div>
  )
}
