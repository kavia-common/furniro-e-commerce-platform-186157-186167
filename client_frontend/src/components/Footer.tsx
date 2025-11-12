import React from "react";
import Container from "./ui/Container";

/**
 * PUBLIC_INTERFACE
 * Footer
 */
export default function Footer() {
  return (
    <footer className="footer">
      <Container>
        <div className="py-6 text-sm text-gray-600 flex flex-col md:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} Furniro. All rights reserved.</p>
          <p className="text-gray-400">Built with Next.js · Ocean Professional Theme</p>
        </div>
      </Container>
    </footer>
  );
}
