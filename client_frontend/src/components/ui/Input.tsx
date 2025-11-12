"use client";
import React from "react";

/**
 * PUBLIC_INTERFACE
 * Input - styled input with label support via external <label htmlFor>
 */
export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  function XInput(props, ref) {
    return <input ref={ref} className={`input ${props.className || ""}`} {...props} />;
  }
);
