interface Props {
  percentage: number
  size?:      number
  label?:     string
}

export function ProgressRing({ percentage, size = 120, label }: Props) {
  const radius       = (size - 12) / 2
  const circumference = 2 * Math.PI * radius
  const offset       = circumference - (percentage / 100) * circumference

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke="#1f2937" strokeWidth={10}
          />
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none"
            stroke={percentage === 100 ? '#f59e0b' : '#10b981'}
            strokeWidth={10}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-500"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-white">{percentage}%</span>
        </div>
      </div>
      {label && <span className="text-sm text-gray-400">{label}</span>}
    </div>
  )
}
