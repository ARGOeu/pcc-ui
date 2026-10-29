export type PrefixRequestStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED'

export type PrefixRequestReviewResult = 'ACCEPTED' | 'REJECTED'

export type ExpectedHandles =
  | 'UP_TO_1000'
  | 'FROM_1000_TO_10000'
  | 'FROM_10000_TO_500000'
  | 'FROM_500000_TO_1000000'
  | 'OVER_1000000'

export interface PrefixRequest {
  id: number
  contact_person_name: string
  contact_person_surname: string
  contact_person_email: string
  contact_person_phone?: string
  country: string
  organization_name: string
  project_name: string
  project_url: string
  project_description?: string
  expected_handles: ExpectedHandles
  status: PrefixRequestStatus
  status_reason?: string
  provider_id?: number
  provider_name?: string
  created_at: string
  updated_at?: string
}

export interface PrefixRequestPayload {
  contact_person_name: string
  contact_person_surname: string
  contact_person_email: string
  contact_person_phone?: string
  country: string
  organization_name: string
  project_name: string
  project_url: string
  project_description?: string
  expected_handles: ExpectedHandles
}

export interface PrefixRequestReviewPayload {
  status: PrefixRequestReviewResult
  status_reason: string
}

export interface RequestFormData {
  contactPersonName: string
  contactPersonSurname: string
  contactPersonEmail: string
  contactPersonPhone: string
  country: string
  organizationName: string
  projectName: string
  projectUrl: string
  projectDescription: string
  expectedHandles: string
}
