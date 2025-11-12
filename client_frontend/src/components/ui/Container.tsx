import React from "react";

/**
 * PUBLIC_INTERFACE
 * Container - page width limiter wrapper
 */
export default function Container({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`app-container ${className}`}>{children}</div>;
}
