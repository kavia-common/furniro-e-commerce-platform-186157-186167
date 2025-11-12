"use client";
import React from "react";

/**
 * PUBLIC_INTERFACE
 * Select - styled select
 */
export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  function XSelect(props, ref) {
    return <select ref={ref} className={`input ${props.className || ""}`} {...props} />;
  }
);
