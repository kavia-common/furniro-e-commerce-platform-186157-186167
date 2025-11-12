import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { setTokenGetter } from "@/lib/api";

export const metadata: Metadata = {
  title: "Furniro",
  description: "Modern furniture e-commerce",
};

declare global {
  interface Window {
    __store?: { auth?: { token?: string | null } };
  }
}

function TokenBridge() {
  // Avoid server imports; access store via global getter at runtime
  if (typeof window !== "undefined") {
    const store = window.__store;
    if (store?.auth) {
      setTokenGetter(() => store.auth?.token ?? null);
    } else {
      // fallback using dynamic import without require rule violation
      import("@/store/auth").then((m) => {
        setTokenGetter(() => m.useAuthStore.getState().token);
      });
    }
  }
  return null;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <TokenBridge />
        <Navbar />
        <main className="py-6">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
