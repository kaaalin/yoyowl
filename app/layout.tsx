import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "YoYo Merchant Migration",
  description: "Worldline campaign workspace for personalized merchant outreach and Dutch AI calls.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
