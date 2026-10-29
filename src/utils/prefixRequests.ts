import type {
  ExpectedHandles,
  PrefixRequest,
  PrefixRequestStatus,
  RequestFormData,
} from '@/types/prefixRequests'

export const emptyRequestForm: RequestFormData = {
  contactPersonName: '',
  contactPersonSurname: '',
  contactPersonEmail: '',
  contactPersonPhone: '',
  country: '',
  organizationName: '',
  projectName: '',
  projectUrl: '',
  projectDescription: '',
  expectedHandles: '',
}

export const expectedHandlesLabels: Record<ExpectedHandles, string> = {
  UP_TO_1000: '< 1000',
  FROM_1000_TO_10000: '1000 - 10000',
  FROM_10000_TO_500000: '10000 - 500000',
  FROM_500000_TO_1000000: '500000 - 1000000',
  OVER_1000000: '> 1000000',
}

export const expectedHandlesOptions = Object.entries(expectedHandlesLabels).map(
  ([value, label]) => ({ value, label }),
)

export const statusBadgeClass: Record<PrefixRequestStatus, string> = {
  PENDING: 'bg-amber-100 text-amber-700',
  ACCEPTED: 'bg-emerald-50 text-emerald-700',
  REJECTED: 'bg-red-50 text-red-600',
}

export const countPendingRequests = (requests?: PrefixRequest[]): number =>
  requests?.filter((request) => request.status === 'PENDING').length ?? 0
