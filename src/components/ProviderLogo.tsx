import { useState } from 'react'

type ProviderLogoSize = 'xs' | 'md' | 'lg'

const sizeClasses: Record<ProviderLogoSize, { box: string; image: string }> = {
  xs: { box: 'size-5 rounded text-xs', image: 'p-0.5' },
  md: { box: 'size-11 rounded-lg text-base', image: 'p-1' },
  lg: { box: 'size-12 rounded-lg text-lg', image: 'p-1' },
}

interface ProviderLogoProps {
  name: string
  logo?: string
  size?: ProviderLogoSize
}

const ProviderLogo = ({ name, logo, size = 'lg' }: ProviderLogoProps) => {
  const [failedLogo, setFailedLogo] = useState('')
  const [loadedLogo, setLoadedLogo] = useState('')
  const { box, image } = sizeClasses[size]

  return (
    <div
      aria-hidden="true"
      className={`relative flex shrink-0 select-none items-center justify-center bg-slate-500 font-bold leading-none text-white ${box}`}
    >
      {name.charAt(0).toUpperCase()}
      {logo && failedLogo !== logo && (
        <img
          src={logo}
          alt=""
          onLoad={() => setLoadedLogo(logo)}
          onError={() => setFailedLogo(logo)}
          className={`absolute inset-0 size-full rounded-[inherit] border border-line bg-white object-contain transition-opacity duration-200 ${image} ${loadedLogo === logo ? 'opacity-100' : 'opacity-0'}`}
        />
      )}
    </div>
  )
}

export default ProviderLogo
