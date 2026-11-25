import Card from '@/components/Card'
import formatDate from '@/utils/formatDate'
import DetailField from './DetailField'
import type { EpicStats } from '@/types/prefixes'

const formatTime = (value: string | null): string | undefined =>
  value ? formatDate({ value, includeTime: true }) : undefined

interface EpicCardProps {
  stats: EpicStats
}

const EpicCard = ({ stats }: EpicCardProps) => (
  <Card className="p-4 border-l-4 border-l-brand">
    <h2 className="section-title mb-2">EPIC statistics</h2>
    <DetailField label="Count" value={stats.stats} />
    <DetailField
      label="Handle updated"
      value={formatTime(stats.handle_timestamp)}
    />
    <DetailField
      label="Last checked"
      value={formatTime(stats.last_checked_at)}
    />
  </Card>
)

export default EpicCard
