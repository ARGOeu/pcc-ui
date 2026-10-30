import { Link } from 'react-router-dom'
import Card from '@/components/Card'
import ProviderLogo from '@/components/ProviderLogo'
import type { ProviderCount } from '@/types/dashboard'

const minBarPercent = 2
const nameClass = 'min-w-0 truncate text-gray-800'

interface BarProps {
  percent: number
}

const Bar = ({ percent }: BarProps) => (
  <div
    aria-hidden="true"
    className="h-2.5 shrink-0 rounded bg-brand"
    ref={(element) => {
      if (element) {
        element.style.flexBasis = `${percent}%`
      }
    }}
  />
)

interface ProviderBarListProps {
  title: string
  items: ProviderCount[]
  linked?: boolean
}

const ProviderBarList = ({ title, items, linked }: ProviderBarListProps) => {
  const maxCount = Math.max(0, ...items.map(({ count }) => count))

  return (
    <Card className="px-4 pt-3 pb-4">
      <h2 className="section-title mb-3">{title}</h2>
      <ul className="flex flex-col gap-3">
        {items.map(({ providerId, provider, logo, count }) => (
          <li key={provider} className="flex items-center gap-3 text-sm">
            <div className="flex w-28 shrink-0 items-center gap-2">
              <ProviderLogo name={provider} logo={logo} size="xs" />
              {linked ? (
                <Link
                  to={`/prefixes?provider=${providerId}`}
                  title={provider}
                  className={`${nameClass} hover:text-brand hover:underline`}
                >
                  {provider}
                </Link>
              ) : (
                <span title={provider} className={nameClass}>
                  {provider}
                </span>
              )}
            </div>
            <div className="flex min-w-0 flex-1 items-center gap-2 pr-9">
              {count > 0 && (
                <Bar
                  percent={Math.max(minBarPercent, (count / maxCount) * 100)}
                />
              )}
              <span
                className={
                  count > 0 ? 'font-medium text-foreground' : 'text-muted'
                }
              >
                {count}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  )
}

export default ProviderBarList
