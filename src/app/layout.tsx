import type React from "react"
import type { Metadata } from "next"
import { Inter, Roboto_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"


export const geistSans = Inter({ subsets: ["latin"], variable: "--geist-sans" });
export const geistMono = Roboto_Mono({ subsets: ["latin"], variable: "--geist-mono" });

export const metadata: Metadata = {
  title: "Бизнес Приложение",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
