"use client";

import React from "react";

type Variant = "primary" | "secondary" | "ghost";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
};

/**
 * PUBLIC_INTERFACE
 * Button - styled button with variants
 */
export default function Button({ variant = "primary", className = "", ...rest }: Props) {
  const base = "btn focus:outline-none focus-visible:[box-shadow:var(--ring-focus)]";
  const styles: Record<Variant, string> = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    ghost:
      "bg-transparent text-[var(--color-primary)] hover:bg-blue-50 border border-blue-100",
  };
  return <button className={`${base} ${styles[variant]} ${className}`} {...rest} />;
}
