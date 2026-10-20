import { Link } from 'react-router-dom'
import {
  Bars3Icon,
  PencilSquareIcon,
  TrashIcon,
} from '@heroicons/react/16/solid'
import { Copy } from 'lucide-react'
import { toast } from 'sonner'
import IconButton from '@/components/IconButton'
import { getHandleSuffix } from '@/utils/handleValues'
import type { ReactNode } from 'react'

const describeCount = (total: number, searchTerm: string): string => {
  const noun = total === 1 ? 'handle' : 'handles'
  if (!searchTerm) {
    return `${total} ${noun}`
  }
  return `${total} ${noun} ${total === 1 ? 'contains' : 'contain'} “${searchTerm}”`
}

interface ListHeaderProps {
  prefixName?: string
  children: ReactNode
}

const ListHeader = ({ prefixName, children }: ListHeaderProps) => (
  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 rounded-t-lg border-b border-line bg-surface-muted px-4 py-2.5">
    <h2 className="font-mono text-sm font-semibold text-foreground">
      {prefixName && (
        <>
          {prefixName}
          <span className="font-normal text-subtle">/</span>
        </>
      )}
    </h2>
    <span className="text-sm text-muted">{children}</span>
  </div>
)

interface MatchedTextProps {
  text: string
  term: string
}

const MatchedText = ({ text, term }: MatchedTextProps) => {
  const index = term ? text.toLowerCase().indexOf(term.toLowerCase()) : -1
  if (index === -1) {
    return text
  }
  const end = index + term.length
  return (
    <>
      {text.slice(0, index)}
      <mark className="rounded-xs bg-brand-muted px-px text-inherit">
        {text.slice(index, end)}
      </mark>
      {text.slice(end)}
    </>
  )
}

interface EmptyStateProps {
  searchTerm: string
}

const EmptyState = ({ searchTerm }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center gap-3 px-4 py-7 text-center">
      {searchTerm ? (
        <>
          <p className="text-sm text-body">
            No handle name contains{' '}
            <span className="font-mono">{searchTerm}</span>
          </p>
        </>
      ) : (
        <p className="text-sm text-body">This prefix has no handles yet</p>
      )}
    </div>
  )
}

interface HandlesListProps {
  handles: string[]
  prefixName?: string
  totalElements: number
  searchTerm: string
  handlesPath: string
  onDelete: (handle: string) => void
}

const HandlesList = ({
  handles,
  prefixName,
  totalElements,
  searchTerm,
  handlesPath,
  onDelete,
}: HandlesListProps) => {
  const handleCopy = (handle: string) => {
    void navigator.clipboard.writeText(handle).then(
      () => toast.success('Handle copied to the clipboard'),
      () => toast.error('Could not copy the handle'),
    )
  }

  return (
    <div className="rounded-lg border border-line bg-white shadow-sm">
      <ListHeader prefixName={prefixName}>
        {describeCount(totalElements, searchTerm)}
      </ListHeader>
      {handles.length === 0 ? (
        <EmptyState searchTerm={searchTerm} />
      ) : (
        <ul role="list" className="divide-y divide-line">
          {handles.map((handle) => {
            const suffix = getHandleSuffix(handle)
            const suffixPath = `${handlesPath}/${encodeURIComponent(suffix)}`

            return (
              <li
                key={handle}
                className="group flex min-h-10 items-center justify-between gap-2 pr-2 pl-4 transition-colors last:rounded-b-lg focus-within:bg-surface-muted hover:bg-surface-muted"
              >
                <Link
                  to={suffixPath}
                  className="min-w-0 flex-1 truncate py-2 font-mono text-sm text-foreground hover:text-brand hover:underline focus-visible:rounded-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                >
                  <MatchedText text={suffix} term={searchTerm} />
                </Link>
                <div className="flex items-center gap-1 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100 pointer-coarse:opacity-100">
                  <IconButton
                    icon={<Copy className="size-3.5 md:size-4.5" />}
                    label="Copy handle"
                    onClick={() => handleCopy(handle)}
                    className="text-muted hover:bg-surface-strong p-1!"
                  />
                  <IconButton
                    icon={<Bars3Icon className="size-4 md:size-5" />}
                    label="View handle"
                    href={suffixPath}
                    className="text-muted hover:bg-surface-strong p-1!"
                  />
                  <IconButton
                    icon={<PencilSquareIcon className="size-4 md:size-5" />}
                    label="Edit handle"
                    href={`${suffixPath}/edit`}
                    className="text-muted hover:bg-surface-strong p-1!"
                  />
                  <IconButton
                    icon={<TrashIcon className="size-4 md:size-5" />}
                    label="Delete handle"
                    onClick={() => onDelete(handle)}
                    className="text-red-600 hover:bg-red-50 p-1!"
                  />
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export default HandlesList
