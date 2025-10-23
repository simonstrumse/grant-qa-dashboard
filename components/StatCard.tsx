import Link from 'next/link'

interface StatCardProps {
  title: string
  value: number | string
  description?: string
  href?: string
  icon?: string
  trend?: 'up' | 'down' | 'neutral'
  variant?: 'default' | 'warning' | 'error' | 'success'
}

const variantStyles = {
  default: 'border-blue-200 bg-blue-50/50',
  warning: 'border-yellow-200 bg-yellow-50/50',
  error: 'border-red-200 bg-red-50/50',
  success: 'border-green-200 bg-green-50/50',
}

const valueColors = {
  default: 'text-blue-900',
  warning: 'text-yellow-900',
  error: 'text-red-900',
  success: 'text-green-900',
}

export function StatCard({
  title,
  value,
  description,
  href,
  icon,
  variant = 'default',
  trend,
}: StatCardProps) {
  const content = (
    <div
      className={`group relative bg-white rounded-xl border-2 p-6 transition-all duration-200 ${
        variantStyles[variant]
      } ${href ? 'hover:shadow-lg hover:border-blue-400 cursor-pointer' : ''}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className={`text-4xl font-bold ${valueColors[variant]}`}>
            {icon && <span className="mr-2">{icon}</span>}
            {value}
          </p>
        </div>
        {trend && (
          <div
            className={`px-2 py-1 rounded-full text-xs font-semibold ${
              trend === 'up'
                ? 'bg-green-100 text-green-700'
                : trend === 'down'
                ? 'bg-red-100 text-red-700'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
          </div>
        )}
      </div>
      {description && <p className="text-sm text-gray-500">{description}</p>}
      {href && (
        <div className="mt-3 text-blue-600 text-sm font-medium group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
          View details →
        </div>
      )}
    </div>
  )

  if (href) {
    return <Link href={href}>{content}</Link>
  }

  return content
}
