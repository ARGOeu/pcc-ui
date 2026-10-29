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

// Matches /providers/{id}/prefixes/{prefix-id}/<resource> and everything below it.
const isPrefixResource = (path: string, resource: string): boolean =>
  new RegExp(`^/providers/[^/]+/prefixes/[^/]+/${resource}(/|$)`).test(path)

// Matches /prefix-requests and the admin endpoints that review a request.
const isPrefixRequest = (path: string): boolean =>
  startsWithSegment(path, '/prefix-requests') ||
  /^\/admin\/prefix-requests?(\/|$)/.test(path)

export const ENDPOINT_CATEGORIES: EndpointCategory[] = [
  {
    label: 'Admin',
    match: (p) => startsWithSegment(p, '/admin') && !isPrefixRequest(p),
  },
  { label: 'Codelist', match: (p) => startsWithSegment(p, '/codelist') },
  { label: 'Domain', match: (p) => startsWithSegment(p, '/domains') },
  {
    label: 'Invitation',
    match: (p) =>
      isPrefixResource(p, 'invitations') ||
      startsWithSegment(p, '/users/invitation'),
  },
  {
    label: 'Prefix Account',
    match: (p) => isPrefixResource(p, 'accounts'),
  },
  { label: 'Prefix Handle', match: (p) => isPrefixResource(p, 'handles') },
  { label: 'Prefix Request', match: isPrefixRequest },
  {
    label: 'Prefix',
    match: (p) => /^\/providers\/[^/]+\/prefixes(\/|$)/.test(p),
  },
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
  { label: 'User Endpoint', match: (p) => startsWithSegment(p, '/users') },
  {
    label: 'Validate URL',
    match: (p) => startsWithSegment(p, '/validate-url'),
  },
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
