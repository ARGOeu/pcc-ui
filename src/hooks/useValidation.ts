import { useMutation } from '@tanstack/react-query'
import { useAuth } from '@/auth/useAuth'
import { validateUrl } from '@/api/validation'
import type { ValidateUrlResponse } from '@/types/validation'

export const useValidateUrlMutation = () => {
  const { token } = useAuth()

  return useMutation<ValidateUrlResponse, Error, { url: string }>({
    mutationFn: ({ url }: { url: string }) => {
      if (!token) {
        throw new Error('No authentication token available')
      }
      if (!url) {
        throw new Error('URL is required')
      }
      return validateUrl(url, token)
    },
    onError: (error) => {
      console.error('URL validation error:', error)
    },
  })
}
