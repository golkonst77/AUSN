"use client"

import { Hero } from "@/components/hero"
import { FAQ } from "@/components/faq"
import { Calculator } from "@/components/calculator"
import { Reviews } from "@/components/reviews"
import { News } from "@/components/news"
import { Contacts } from "@/components/contacts"
import { Technologies } from "@/components/technologies"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useEffect } from "react"
import { SupportSection } from "@/components/support-section"

export default function HomePage() {
  useEffect(() => {
    if (typeof window === "undefined") return
    if (!window.location.hash) return
    
    let attempts = 0
    function tryScroll() {
      const el = document.getElementById(window.location.hash.substring(1))
      if (el) {
        el.scrollIntoView({ behavior: "smooth" })
      } else if (attempts < 5) {
        attempts++
        setTimeout(tryScroll, 200)
      }
    }
    tryScroll()
  }, [typeof window !== "undefined" ? window.location.hash : null])

  return (
    <main id="home-page" className="min-h-screen">
      <Hero />
      <Calculator />
      <Technologies />
      <Reviews />
      <News />

      {/* Полноценный блок поддержки на главной */}
      <SupportSection />

      <FAQ />
      <Contacts />
    </main>
  )
}
