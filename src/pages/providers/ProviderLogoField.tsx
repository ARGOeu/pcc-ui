import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { PhotoIcon, XMarkIcon } from '@heroicons/react/16/solid'
import { toast } from 'sonner'
import type { ChangeEvent, MouseEvent } from 'react'
import type { FileRejection } from 'react-dropzone'

const maxFileSize = 5 * 1024 * 1024
const logoUrlPattern = /^https?:\/\/.*\.(jpg|jpeg|png|gif)(\?.*)?$/i
const logoUrlMessage =
  'Enter an address that starts with http:// or https:// and ends with .png, .jpg, .jpeg or .gif'
const inputErrorClass =
  'border-red-500! focus:border-red-500! focus:ring-red-500/10!'

interface ProviderLogoFieldProps {
  value: string
  initialUrl?: string
  onChange: (logo: string) => void
}

const ProviderLogoField = ({
  value,
  initialUrl = '',
  onChange,
}: ProviderLogoFieldProps) => {
  const [urlInput, setUrlInput] = useState(initialUrl)
  const [urlError, setUrlError] = useState('')

  const onDropAccepted = useCallback(
    (acceptedFiles: File[]) => {
      const reader = new FileReader()
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setUrlInput('')
          setUrlError('')
          onChange(reader.result)
        }
      }
      reader.readAsDataURL(acceptedFiles[0])
    },
    [onChange],
  )

  const onDropRejected = useCallback((rejections: FileRejection[]) => {
    const tooLarge = rejections[0]?.errors.some(
      (error) => error.code === 'file-too-large',
    )
    toast.error(
      tooLarge
        ? 'Image size must be less than 5 MB'
        : 'Only PNG and JPEG images are supported',
    )
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDropAccepted,
    onDropRejected,
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
    },
    maxSize: maxFileSize,
    maxFiles: 1,
  })

  const handleUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value
    const trimmed = url.trim()
    const isValid = logoUrlPattern.test(trimmed)

    setUrlInput(url)
    setUrlError(trimmed && !isValid ? logoUrlMessage : '')
    onChange(isValid ? trimmed : '')
  }

  const handleRemoveClick = (e: MouseEvent) => {
    e.stopPropagation()
    setUrlInput('')
    setUrlError('')
    onChange('')
  }

  return (
    <div className="flex flex-col">
      <label className="mb-0.5 text-base font-medium text-body">Logo</label>
      <div
        {...getRootProps()}
        className={`relative flex min-h-20 cursor-pointer flex-col items-center justify-center gap-0.5 rounded-lg border-2 border-dashed p-2 text-center transition-all ${isDragActive ? 'border-brand bg-brand-subtle' : 'border-line-strong bg-white hover:bg-surface-muted'}`}
      >
        <input {...getInputProps()} aria-label="Upload a logo" />
        {value ? (
          <>
            <button
              type="button"
              onClick={handleRemoveClick}
              aria-label="Remove logo"
              className="absolute right-1 top-1 flex size-6 cursor-pointer items-center justify-center rounded-full bg-gray-600 text-white hover:bg-gray-700"
            >
              <XMarkIcon className="size-4" />
            </button>
            <img
              src={value}
              alt="Logo preview"
              className="size-12 rounded-lg border border-line bg-white object-contain p-1"
            />
          </>
        ) : (
          <PhotoIcon className="size-10 text-subtle" />
        )}
        <p className="m-0 text-sm text-muted">
          {isDragActive
            ? 'Drop the image here'
            : 'Drop an image here or click to upload'}
        </p>
        <p className="m-0 text-xs text-subtle">PNG or JPEG, up to 5 MB</p>
      </div>

      <div className="my-1 flex items-center">
        <div className="flex-1 border-b border-line" />
        <span className="px-4 text-xs font-medium text-subtle">or</span>
        <div className="flex-1 border-b border-line" />
      </div>

      <input
        type="text"
        value={urlInput}
        onChange={handleUrlChange}
        aria-label="Logo address"
        placeholder="Enter the address of an image"
        className={urlError ? inputErrorClass : ''}
      />
      {urlError && (
        <span className="mt-1 text-xs text-red-500">{urlError}</span>
      )}
    </div>
  )
}

export default ProviderLogoField
