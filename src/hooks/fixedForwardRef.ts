import React from "react";

export function fixedForwardRef<T, P = {}>(
  render: (props: P, ref: React.Ref<T>) => React.ReactNode
): (props: P & React.RefAttributes<T>) => React.ReactNode {
  return React.forwardRef(
    render as unknown as React.ForwardRefRenderFunction<T, {}>
  ) as React.ForwardRefExoticComponent<React.RefAttributes<T>>;
}
