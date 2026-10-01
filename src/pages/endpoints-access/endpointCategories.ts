interface EndpointCategory {
  label: string
  match: (path: string) => boolean
}

export const OTHER_CATEGORY = 'Other'

const startsWithSegment = (path: string, segment: string): boolean =>
  path === segment || path.startsWith(`${segment}/`)

// Registry paths may or may not include the /api/v1 base path.
const normalizePath = (path: string): string => {
  const withLeadingSlash = path.startsWith('/') ? path : `/${path}`
  return withLeadingSlash.replace(/^(\/api)?\/v1(?=\/|$)/, '') || '/'
}

export const ENDPOINT_CATEGORIES: EndpointCategory[] = [
  { label: 'Codelist', match: (p) => startsWithSegment(p, '/codelist') },
  { label: 'Domain', match: (p) => startsWithSegment(p, '/domains') },
  {
    label: 'Handle',
    match: (p) => /^\/prefixes\/[^/]+\/handles(\/|$)/.test(p),
  },
  { label: 'Prefix', match: (p) => startsWithSegment(p, '/prefixes') },
  { label: 'Provider', match: (p) => startsWithSegment(p, '/providers') },
  {
    label: 'Quarkus Auth',
    match: (p) =>
      [
        '/api-resources',
        '/members',
        '/roles',
        '/secured-endpoints',
        '/users/profile',
      ].some((segment) => startsWithSegment(p, segment)),
  },
  {
    label: 'Reverse LookUp',
    match: (p) => startsWithSegment(p, '/reverse-lookup'),
  },
  { label: 'Service', match: (p) => startsWithSegment(p, '/services') },
  { label: 'default', match: (p) => p === '/' },
  { label: 'User Endpoint', match: (p) => startsWithSegment(p, '/users') },
]

export const CATEGORY_ORDER = [
  ...ENDPOINT_CATEGORIES.map((category) => category.label),
  OTHER_CATEGORY,
]

export const getEndpointCategory = (path: string): string => {
  const normalized = normalizePath(path)
  return (
    ENDPOINT_CATEGORIES.find((category) => category.match(normalized))?.label ??
    OTHER_CATEGORY
  )
}
