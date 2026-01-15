"use client"

import { create } from "zustand"

interface ContactFormStore {
  isOpen: boolean
  openContactForm: () => void
  closeContactForm: () => void
}

export const useContactForm = create<ContactFormStore>((set) => ({
  isOpen: false,
  openContactForm: () => {
    // Отправляем событие в Яндекс.Метрику при клике на кнопку консультации
    if (typeof window !== 'undefined' && (window as any).ym) {
      try {
        (window as any).ym(105967457, 'reachGoal', 'consult_click')
        console.log('[ContactForm] Яндекс.Метрика: событие consult_click отправлено')
      } catch (error) {
        console.error('[ContactForm] Ошибка отправки события в Яндекс.Метрику:', error)
      }
    }
    set({ isOpen: true })
  },
  closeContactForm: () => set({ isOpen: false }),
}))
