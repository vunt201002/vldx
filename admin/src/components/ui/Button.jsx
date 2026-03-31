import React from 'react'

export default function Button({
  variant = 'primary',
  size = 'md',
  icon: Icon,
  children,
  className = '',
  ...rest
}) {
  return (
    <button
      className={`btn btn-${variant} ${size === 'sm' ? 'btn-sm' : ''} ${className}`.trim()}
      {...rest}
    >
      {Icon && <Icon size={size === 'sm' ? 14 : 16} strokeWidth={1.75} />}
      {children}
    </button>
  )
}
