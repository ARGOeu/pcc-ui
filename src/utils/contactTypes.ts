import capitalizeWord from '@/utils/capitalizeWord'

export const getContactTypeLabel = (type: string): string =>
  capitalizeWord(type)
