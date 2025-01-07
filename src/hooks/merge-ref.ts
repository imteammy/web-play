import type { Ref, MutableRefObject } from "react";

export function mergeRef<T>(...refs: Ref<NoInfer<T>>[]) {
  return (element: T | null) => {
    for (const ref of refs) {
      if (typeof ref === "function") {
        ref(element);
      } else if (ref) {
        (ref as MutableRefObject<T | null>).current = element;
      }
    }
  };
}

export function mergeRefNew<T>(...refs: Ref<NoInfer<T>>[]) {
  return (element: T | null) => {
    for (const ref of refs) {
      if (typeof ref === "function") {
        ref(element);
      } else if (ref) {
        (ref as MutableRefObject<T | null>).current = element;
      }
    }
    return () => {
      for (const ref of refs) {
        if (typeof ref === "function") {
          ref(null);
        } else if (ref) {
          (ref as MutableRefObject<T | null>).current = null;
        }
      }
    };
  };
}
