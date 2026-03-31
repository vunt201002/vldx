import React from 'react'

export function Table({ children }) {
  return (
    <div className="table-wrapper">
      <table className="table">{children}</table>
    </div>
  )
}

export function Th({ children, align, ...rest }) {
  return (
    <th style={align ? { textAlign: align } : undefined} {...rest}>
      {children}
    </th>
  )
}

export function Td({ children, align, ...rest }) {
  return (
    <td style={align ? { textAlign: align } : undefined} {...rest}>
      {children}
    </td>
  )
}
