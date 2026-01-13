import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ContactForm } from "@/components/contact-form"
import { Toaster } from "@/components/ui/toaster"
import { Toaster as SonnerToaster } from "sonner"
import { AusnBlobButton } from "@/components/AusnBlobButton"
import { CookieConsent } from "@/components/cookie-consent"
import Metrika from "@/components/Metrika"

const inter = Inter({ subsets: ["latin", "cyrillic"] })

export const metadata: Metadata = {
  title: "Просто Бюро - Портал АУСН | Калькулятор и консультации по переходу на АУСН",
  description:
    "Навигатор по АУСН: калькулятор сравнения налоговых режимов, инструкции по переходу, юридическая поддержка для ИП и ООО. Рассчитайте выгоду перехода на автоматизированную упрощённую систему налогообложения.",
  keywords: "АУСН, калькулятор АУСН, УСН, ОСНО, налоги, ИП, ООО, переход на АУСН, Калуга",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const ymId = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID || "105967457"
  
  return (
    <html lang="ru">
      <head>
        <Metrika />
      </head>
      <body className={inter.className}>
          <Header />
          <AusnBlobButton />
          <main className="pt-16 md:pt-20">
            {children}
          </main>
          <Footer />
          <ContactForm />
          <CookieConsent ymId={ymId} />
          <Toaster />
          <SonnerToaster position="top-right" />
      </body>
    </html>
  )
}
