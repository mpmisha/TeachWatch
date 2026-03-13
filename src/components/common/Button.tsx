import type { ReactNode } from 'react'
import './Button.css'

export interface ButtonProps {
  children: ReactNode
  onClick: () => void
  variant?: 'primary' | 'secondary' | 'answer'
  disabled?: boolean
  className?: string
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  className,
}: ButtonProps): ReactNode {
  const classes = ['tw-button', `tw-button--${variant}`, className]
    .filter(Boolean)
    .join(' ')

  return (
    <button type="button" className={classes} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  )
}

export default Button