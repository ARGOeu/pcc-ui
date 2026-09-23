import { useNavigate } from 'react-router-dom'
import PageHeader from '@/components/PageHeader'
import Button from '@/components/Button'

const Prefixes = () => {
  const navigate = useNavigate()

  return (
    <div className="page-container">
      <PageHeader
        title="Prefixes"
        subtitle="Browse the prefixes registered in the catalogue"
        className="mb-4"
      >
        <Button
          variant="primary"
          onClick={() => void navigate('/prefixes/add')}
        >
          Create prefix
        </Button>
      </PageHeader>
    </div>
  )
}

export default Prefixes
