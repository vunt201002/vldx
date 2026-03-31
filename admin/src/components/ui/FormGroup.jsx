import React from 'react'

export default function FormGroup({ label, htmlFor, help, children }) {
  return (
    <div className="form-group">
      {label && (
        <label className="form-label" htmlFor={htmlFor}>
          {label}
        </label>
      )}
      {children}
      {help && <p className="form-help">{help}</p>}
    </div>
  )
}
