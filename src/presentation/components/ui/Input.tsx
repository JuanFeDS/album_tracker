import type { InputHTMLAttributes } from 'react'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?:   string
  error?:   string
}

export function Input({ label, error, className = '', id, ...props }: Props) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-gray-300">
          {label}
        </label>
      )}
      <input
        id={id}
        {...props}
        className={`
          rounded-lg border bg-gray-800 px-3 py-2 text-sm text-white
          placeholder:text-gray-500 focus:outline-none focus:ring-2
          focus:ring-emerald-500 transition-colors
          ${error ? 'border-red-500' : 'border-gray-700'}
          ${className}
        `}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}
