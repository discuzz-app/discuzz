import { useEffect } from 'react'

type IntersectionObserverArgs = {
  root?: any
  target: any
  onIntersect: () => void
  threshold?: number
  rootMargin?: number
  enabled?: boolean
}

export const useIntersectionObserver = ({
  root,
  target,
  onIntersect,
  threshold = 1.0,
  rootMargin = 0,
  enabled = true
}: IntersectionObserverArgs) => {
  useEffect(() => {
    if (!enabled) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            onIntersect()
          }
        }),
      {
        root: root && root.current,
        rootMargin: rootMargin + 'px',
        threshold
      }
    )

    const element = target && target.current

    if (!element) {
      return
    }

    observer.observe(element)

    return () => observer.unobserve(element)
  }, [target.current, enabled, onIntersect])
}
