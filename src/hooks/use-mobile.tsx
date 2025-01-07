import * as React from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile(
  BREAKPOINT = MOBILE_BREAKPOINT,
  disabled?: boolean
) {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
    undefined
  );

  React.useEffect(() => {
    if (disabled) return;

    const mql = window.matchMedia(`(max-width: ${BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, [BREAKPOINT, disabled]);

  return !!isMobile;
}
