import { useEffect, useState } from 'react'

const FALLBACKS = {
  tour: '/images/fallbacks/tour-fallback.svg',
  hotel: '/images/fallbacks/hotel-fallback.svg',
  article: '/images/fallbacks/article-fallback.svg',
  gallery: '/images/fallbacks/gallery-fallback.svg',
}

export default function SafeImage({
  src,
  alt = '',
  type = 'gallery',
  className = '',
  loading = 'lazy',
  ...props
}) {
  const fallback = FALLBACKS[type] || FALLBACKS.gallery
  const [failed, setFailed] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setFailed(false)
    setLoaded(false)
  }, [src])

  if (!src || failed) {
    return (
      <img
        src={fallback}
        alt={alt}
        className={className}
        loading={loading}
        decoding="async"
        {...props}
      />
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`${className} transition-opacity duration-300 ${
        loaded ? 'opacity-100' : 'opacity-0'
      }`}
      loading={loading}
      decoding="async"
      onLoad={() => setLoaded(true)}
      onError={() => setFailed(true)}
      {...props}
    />
  )
}
