interface Props {
  size?: 'sm' | 'md' | 'lg'
}

const sizes = { sm: 'h-4 w-4', md: 'h-8 w-8', lg: 'h-12 w-12' }

export function Spinner({ size = 'md' }: Props) {
  return (
    <span
      className={`inline-block animate-spin rounded-full border-2 border-gray-600 border-t-emerald-500 ${sizes[size]}`}
      role="status"
      aria-label="Cargando"
    />
  )
}
