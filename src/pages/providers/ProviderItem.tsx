import { PencilSquareIcon, TrashIcon } from '@heroicons/react/16/solid'
import Badge from '@/components/Badge'
import Card from '@/components/Card'
import IconButton from '@/components/IconButton'
import { getContactTypeLabel } from '@/utils/contactTypes'
import type { Provider } from '@/types/providers'

interface ProviderItemProps {
  provider: Provider
  onDelete: (provider: Provider) => void
}

const ProviderItem = ({ provider, onDelete }: ProviderItemProps) => {
  const { contacts } = provider

  return (
    <li>
      <Card className="px-4 py-3">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-base font-semibold leading-6 text-foreground">
              {provider.name}
            </h2>
            {provider.description && (
              <p className="max-w-prose whitespace-pre-line text-sm text-body">
                {provider.description}
              </p>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <IconButton
              icon={<PencilSquareIcon className="size-4" />}
              label="Edit provider"
              href={`/providers/${provider.id}/edit`}
              className="tooltip-left text-muted hover:bg-surface-strong p-1!"
            />
            <IconButton
              icon={<TrashIcon className="size-4" />}
              label="Delete provider"
              onClick={() => onDelete(provider)}
              className="tooltip-left text-red-600 hover:bg-red-50 p-1!"
            />
          </div>
        </div>

        <div className="mt-1.5">
          <p className="text-sm font-medium text-body">Contacts:</p>
          {contacts.length === 0 ? (
            <p className="text-sm italic text-muted">No contacts yet</p>
          ) : (
            <ul className="mt-0.5 grid gap-x-8 gap-y-1 text-sm lg:grid-cols-2">
              {contacts.map((contact) => (
                <li
                  key={contact.id}
                  className="flex min-w-0 items-baseline gap-2"
                >
                  <span className="font-medium text-foreground">
                    {contact.name}
                  </span>
                  <a
                    href={`mailto:${contact.email}`}
                    className="min-w-0 break-all text-brand no-underline hover:underline"
                  >
                    {contact.email}
                  </a>
                  <Badge
                    size="xs"
                    className="shrink-0 bg-surface-strong text-muted"
                  >
                    {getContactTypeLabel(contact.type)}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Card>
    </li>
  )
}

export default ProviderItem
