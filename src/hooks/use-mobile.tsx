import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile(MOBILE = MOBILE_BREAKPOINT,disabled = false) {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    if(disabled) return;
    const mql = window.matchMedia(`(max-width: ${MOBILE - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE)
    return () => mql.removeEventListener("change", onChange)
  }, [MOBILE, disabled])

  return !!isMobile
}
