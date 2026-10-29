import Button from '@/components/Button'
import Card from '@/components/Card'
import type { PrefixRequestReviewResult } from '@/types/prefixRequests'

interface ReviewCardProps {
  onReview: (result: PrefixRequestReviewResult) => void
}

const ReviewCard = ({ onReview }: ReviewCardProps) => {
  return (
    <Card className="lg:sticky lg:top-4">
      <div className="flex flex-col gap-4 px-5 py-4">
        <div>
          <h2 className="section-title">Review request</h2>
          <p className="section-description">
            Accept the request and choose the provider that creates the prefix,
            or reject it.
          </p>
        </div>

        <div className="flex flex-wrap justify-between gap-2">
          <Button
            type="button"
            variant="outline-secondary"
            onClick={() => onReview('REJECTED')}
          >
            Reject
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={() => onReview('ACCEPTED')}
          >
            Accept
          </Button>
        </div>
      </div>
    </Card>
  )
}

export default ReviewCard
