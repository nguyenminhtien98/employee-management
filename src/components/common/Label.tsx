import type { LabelHTMLAttributes, PropsWithChildren } from "react";

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  requiredMark?: boolean;
}

export default function Label({
  requiredMark,
  children,
  className,
  ...rest
}: PropsWithChildren<LabelProps>) {
  return (
    <label className={`label ${className || ""}`} {...rest}>
      {children}
      {requiredMark ? <span className="label-required"> *</span> : null}
    </label>
  );
}
