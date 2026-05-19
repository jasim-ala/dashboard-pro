'use client'

import { useState, useRef, useTransition } from 'react'
import { Upload, FileText, CheckCircle2, AlertCircle, X, Loader2 } from 'lucide-react'
import Papa from 'papaparse'
import { bulkInsertSalesData } from '@/app/actions'

export default function BulkCSVUploader() {
  const [isDragging, setIsDragging] = useState(false)
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState([])
  const [result, setResult] = useState(null)
  const [isPending, startTransition] = useTransition()
  const inputRef = useRef()

  function handleFile(f) {
    if (!f || !f.name.endsWith('.csv')) {
      setResult({ error: 'Please upload a valid CSV file.' })
      return
    }
    setFile(f)
    setResult(null)

    Papa.parse(f, {
      header: true,
      skipEmptyLines: true,
      complete: (res) => {
        setPreview(res.data.slice(0, 5))
      },
    })
  }

  function handleDrop(e) {
    e.preventDefault()
    setIsDragging(false)
    handleFile(e.dataTransfer.files[0])
  }

  function handleUpload() {
    if (!file) return

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (res) => {
        startTransition(async () => {
          const result = await bulkInsertSalesData(res.data)
          setResult(result)
          if (result.success) {
            setFile(null)
            setPreview([])
          }
        })
      },
    })
  }

  return (
    <div className="admin-module-card">
      <div className="module-header">
        <div>
          <div className="module-tag" style={{ color: '#10b981' }}>BULK OPERATIONS</div>
          <h3 className="module-title">CSV Sales Data Upload</h3>
        </div>
      </div>

      <div className="csv-helper-text">
        Expected columns: <code>date</code>, <code>brand</code>, <code>product_category</code>, <code>units_sold</code>, <code>revenue</code>
      </div>

      {/* Drop Zone */}
      <div
        className={`csv-drop-zone ${isDragging ? 'dragging' : ''} ${file ? 'has-file' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current.click()}
      >
        <input ref={inputRef} type="file" accept=".csv" className="hidden" onChange={e => handleFile(e.target.files[0])} />
        {file ? (
          <div className="drop-file-info">
            <FileText size={28} className="drop-icon-success" />
            <span className="drop-filename">{file.name}</span>
            <button type="button" className="drop-clear" onClick={(e) => { e.stopPropagation(); setFile(null); setPreview([]); setResult(null) }}>
              <X size={14} /> Clear
            </button>
          </div>
        ) : (
          <>
            <Upload size={28} className="drop-icon" />
            <p className="drop-title">Drag & drop your CSV here</p>
            <p className="drop-sub">or click to browse</p>
          </>
        )}
      </div>

      {/* Preview */}
      {preview.length > 0 && (
        <div className="csv-preview">
          <p className="csv-preview-label">Preview (first 5 rows)</p>
          <div className="module-table-wrap" style={{ maxHeight: '180px' }}>
            <table className="module-table">
              <thead>
                <tr>{Object.keys(preview[0]).map(k => <th key={k}>{k}</th>)}</tr>
              </thead>
              <tbody>
                {preview.map((row, i) => (
                  <tr key={i}>{Object.values(row).map((v, j) => <td key={j}>{v}</td>)}</tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className={`upload-result ${result.error ? 'result-error' : 'result-success'}`}>
          {result.error ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
          {result.error || `Successfully inserted ${result.inserted} records into sales_data.`}
        </div>
      )}

      {file && (
        <div className="form-footer">
          <button type="button" className="btn-primary btn-green" onClick={handleUpload} disabled={isPending}>
            {isPending ? <Loader2 size={14} className="spin" /> : <Upload size={14} />}
            {isPending ? 'Uploading...' : 'Upload to Database'}
          </button>
        </div>
      )}
    </div>
  )
}
