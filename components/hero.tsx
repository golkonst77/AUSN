"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCruiseClick } from "@/hooks/use-cruise-click"
import { DollarSign, AlertTriangle, CheckCircle, MessageCircle, Shield, ArrowDown } from "lucide-react"
import AnimatedContent from './AnimatedContent'
import homepageConfig from "@/data/homepage.json"
import { PDFViewerModal } from "@/components/pdf-viewer-modal"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { RiskBlobButton } from "@/components/RiskBlobButton"

interface HeroConfig {
  badge: {
    text: string
    show: boolean
  }
  title: {
    text: string
    highlightText: string
  }
  description: string
  button: {
    text: string
    show: boolean
  }
  features: Array<{
    id: string
    title: string
    description: string
    icon: string
    color: string
    show: boolean
  }>
  background: {
    image: string
    overlay: number
  }
  layout: {
    alignment: string
    maxWidth: string
    marginLeft: number
    marginTop: number
    marginBottom: number
    paddingX: number
  }
}

const iconMap = {
  DollarSign,
  AlertTriangle,
  CheckCircle,
  MessageCircle,
  Shield,
}

type HeroVariant = "classic" | "simple"
const HERO_VARIANT: HeroVariant = "simple"

export function Hero() {
  const [config] = useState<HeroConfig>(() => homepageConfig as unknown as HeroConfig)
  const [basePath, setBasePath] = useState("")
  const { handleCruiseClick } = useCruiseClick()
  const [pdfModalOpen, setPdfModalOpen] = useState(false)
  const [currentPdfPath, setCurrentPdfPath] = useState("")
  const [modalTitle, setModalTitle] = useState("")
  const [docsModalOpen, setDocsModalOpen] = useState(false)
  const [documentTemplates, setDocumentTemplates] = useState<Array<{ label: string; file: string }>>([])

  useEffect(() => {
    if (typeof window === "undefined") return
    const pathname = window.location.pathname || ""
    // На проде AUSN развёрнут под /ausn.
    if (pathname.startsWith("/ausn")) {
      setBasePath("/ausn")
    }
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return

    const fallback: Array<{ label: string; file: string }> = [
      { label: "Бухгалтерское сопровождение", file: "Buhgalterskoe-soprovozhdenie-ProstoByuro.pdf" },
      { label: "Как избежать блокировки счета", file: "Kak-izbezhat-blokirovki-scheta.pdf" },
      { label: "Как выбрать бух. компанию", file: "Kak_vibrat_buh_kompany.pdf" },
      { label: "Сравнение ИП и ООО", file: "Sravnenie-IP-i-OOO-Chto-vybrat-dlya-vashego-biznesa.pdf" },
      { label: "Восстановление бухгалтерского учета", file: "Vosstanovlenie-buhgalterskogo-ucheta.pdf" },
    ]

    const base = (window.location.pathname || "").startsWith("/ausn") ? "/ausn" : ""

    const loadTemplates = async () => {
      try {
        const res = await fetch(`${base}/CHEK_LIST/templates.json?v=${Date.now()}`)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        if (!Array.isArray(data)) throw new Error("Invalid templates.json")

        const cleaned = data
          .filter((x) => x && typeof x === "object")
          .map((x: any) => ({
            label: typeof x.label === "string" ? x.label : "",
            file: typeof x.file === "string" ? x.file : "",
          }))
          .filter((x) => x.label && x.file)

        setDocumentTemplates(cleaned.length ? cleaned : fallback)
      } catch {
        setDocumentTemplates(fallback)
      }
    }

    loadTemplates()
  }, [])

  // Значения по умолчанию для безопасности
  const rawBackgroundImage = config.background?.image || ''
  const backgroundImage =
    rawBackgroundImage &&
    basePath &&
    rawBackgroundImage.startsWith("/") &&
    !rawBackgroundImage.startsWith(`${basePath}/`)
      ? `${basePath}${rawBackgroundImage}`
      : rawBackgroundImage
  const overlayOpacity = (config.background?.overlay || 10) / 100
  const badge = config.badge || { text: 'Защищаем ваш бизнес', show: true }
  const title = config.title || { text: 'Ваш личный', highlightText: 'щит' }
  const description = config.description || 'Профессиональные бухгалтерские услуги'
  const button = config.button || { text: 'Получить консультацию', show: true }
  const features = config.features || []
  const layout = config.layout || {
    alignment: 'left',
    maxWidth: 'max-w-2xl',
    marginLeft: 80,
    marginTop: 0,
    marginBottom: 0,
    paddingX: 20
  }

  const runtimeBasePath =
    typeof window !== "undefined" && (window.location.pathname || "").startsWith("/ausn")
      ? "/ausn"
      : basePath

  const handleFeatureClick = (id: string, title: string) => {
    if (typeof window === "undefined") return

    if (id === "checklist") {
      setCurrentPdfPath(`${runtimeBasePath}/CHEK_LIST/Chek-list-perehoda.pdf`)
      setModalTitle(title)
      setPdfModalOpen(true)
      return
    }

    if (id === "docs") {
      setDocsModalOpen(true)
      return
    }

    if (id === "calc") {
      const target = document.getElementById("calculator")
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" })
      } else {
        window.location.href = `${runtimeBasePath}/#calculator`
      }
    }
  }

  const docsDialog = (
    <Dialog open={docsModalOpen} onOpenChange={setDocsModalOpen}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Список документов</DialogTitle>
          <DialogDescription>
            Шаблоны форм вы можете скачать по кнопке «Документы» на главной. Ниже перечень того, что потребуется подготовить.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 text-sm leading-6">
          <div>
            <h3 className="font-semibold mb-2">Скачать шаблоны</h3>
            <div className="flex flex-col gap-2">
              {documentTemplates.map((tpl) => (
                <a
                  key={tpl.file}
                  href={`${runtimeBasePath}/CHEK_LIST/${tpl.file}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-between rounded-md border border-gray-200 bg-white px-4 py-2 hover:bg-gray-50"
                >
                  <span className="font-medium">{tpl.label}</span>
                  <span className="text-xs text-gray-500">PDF</span>
                </a>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Список документов для перехода на АУСН</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Выписка из ЕГРЮЛ/ЕГРИП (оригинал или нотариально заверенная копия)</li>
              <li>Заявление о применении АУСН (по форме ФНС)</li>
              <li>Документ, подтверждающий остаточную стоимость основных средств (справка или расчёт)</li>
              <li>Информация о среднесписочной численности сотрудников (расчёт, табели)</li>
              <li>Уставные документы (для ООО: устав, учредительный договор и протокол/решение о назначении директора)</li>
              <li>Паспорт и ИНН руководителя (копии)</li>
              <li>Свидетельство о постановке на учёт по НДС (если ранее регистрировались на ОСНО)</li>
              <li>Договор с уполномоченным банком и реквизиты расчётного счёта</li>
              <li>Доверенность или полномочия на представителя (если подаёт не руководитель)</li>
            </ul>
          </div>
          <p className="text-muted-foreground">
            После подготовки шаблонов и заполнения всех форм загрузите их в личный кабинет ФНС или представьте в уполномоченный банк.
          </p>
        </div>
        <DialogFooter>
          <Button onClick={() => setDocsModalOpen(false)} variant="secondary">Закрыть</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )

  if (HERO_VARIANT === "simple") {
    const simpleTitleText = (title.text || "")
      .replace(/\s+для\s+малого\s+бизнеса\s*:?/i, "")
      .replace(/\s*калькулятор\s*,\s*чек-?лист\s*,\s*документы\s*/i, "")
      .trim()

    const simpleHighlightText = (title.highlightText || "")
      .replace(/\s*калькулятор\s*,\s*чек-?лист\s*,\s*документы\s*/i, "")
      .trim()

    const renderSimpleTitle = (text: string) => {
      const parts = (text || "").split(/(АУСН)/i)
      return parts.map((part, idx) => {
        if (!part) return null
        if (part.toLowerCase() === "аусн") {
          return (
            <span
              key={`ausn-${idx}`}
              className="inline-block text-cyan-300 font-black drop-shadow-[0_2px_10px_rgba(34,211,238,0.45)] text-[1.15em] md:text-[1.25em]"
            >
              {part.toUpperCase()}
            </span>
          )
        }
        return <span key={`t-${idx}`}>{part}</span>
      })
    }
    return (
      <section
        className="relative min-h-screen pt-16 md:pt-20"
        style={{
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <RiskBlobButton />
        <PDFViewerModal
          isOpen={pdfModalOpen}
          onClose={() => setPdfModalOpen(false)}
          pdfPath={currentPdfPath}
          title={modalTitle}
        />
        {docsDialog}

        <div
          className="absolute inset-0"
          style={{
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            backgroundColor: "rgba(255, 255, 255, 0.10)",
          }}
        />
        <div className="absolute inset-0 bg-black/35" />
        <div className="relative z-10 px-6 md:px-16 py-12 md:py-16 max-w-3xl">
          {badge.show && (
            <span className="mb-4 inline-block px-5 py-2.5 bg-blue-200 text-blue-900 rounded-full text-sm md:text-base font-semibold shadow-sm">
              {badge.text}
            </span>
          )}

          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 md:mb-6 drop-shadow-lg">
            {renderSimpleTitle(simpleTitleText)}
            {simpleHighlightText ? (
              <>
                {" "}
                <span className="text-blue-300">{simpleHighlightText}</span>
              </>
            ) : null}
          </h1>

          {/* CTA кнопка для перехода к калькулятору */}
          <Button
            size="lg"
            onClick={() => handleFeatureClick("calc", "Калькулятор")}
            className="w-full sm:w-auto mb-4 md:mb-6 h-auto whitespace-normal text-center px-6 sm:px-10 md:px-12 py-6 md:py-7 text-lg md:text-xl font-extrabold leading-snug rounded-2xl bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 text-white shadow-[0_14px_32px_rgba(0,0,0,0.45)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_55px_rgba(0,0,0,0.55)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-300/70 focus-visible:shadow-[0_22px_55px_rgba(0,0,0,0.55)] active:translate-y-0 active:shadow-[0_10px_24px_rgba(0,0,0,0.40)] flex items-center gap-2"
            style={{
              boxShadow: "0 14px 32px rgba(0,0,0,0.45)",
              filter: "drop-shadow(0 10px 22px rgba(0,0,0,0.28))",
            }}
          >
            Рассчитать свою выгоду на АУСН за 30 секунд
            <ArrowDown className="h-5 w-5 md:h-6 md:w-6 animate-bounce" />
          </Button>

          {button.show && (
            <Button
              size="lg"
              onClick={handleCruiseClick}
              className="w-full sm:w-auto h-auto whitespace-normal text-center px-6 sm:px-10 md:px-12 py-6 md:py-7 text-lg md:text-xl font-extrabold leading-snug rounded-2xl bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 text-white shadow-[0_14px_32px_rgba(0,0,0,0.45)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_55px_rgba(0,0,0,0.55)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-300/70 focus-visible:shadow-[0_22px_55px_rgba(0,0,0,0.55)] active:translate-y-0 active:shadow-[0_10px_24px_rgba(0,0,0,0.40)]"
              style={{
                boxShadow: "0 14px 32px rgba(0,0,0,0.45)",
                filter: "drop-shadow(0 10px 22px rgba(0,0,0,0.28))",
              }}
            >
              {button.text}
            </Button>
          )}
        </div>

        <div className="relative z-10 px-4 md:px-8 pb-10">
          <div className="w-full mt-8 md:mt-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 max-w-6xl">
              {features.filter(feature => feature.show).map((feature, idx) => {
                const bgVariants = [
                  "bg-[#FFF8F0]",
                  "bg-[#F5E6D6]",
                  "bg-[#E9D8C3]",
                ]
                const cardBg = bgVariants[idx % 3]
                return (
                  <button
                    type="button"
                    key={feature.id}
                    onClick={() => handleFeatureClick(feature.id, feature.title)}
                    className={`${cardBg} rounded-xl shadow-md p-4 md:p-6 w-full flex flex-col justify-start text-left cursor-pointer`}
                  >
                    <div className="w-full">
                      <AnimatedContent direction="vertical" distance={40} duration={0.7} ease="power3.out" threshold={0.2} animateOpacity={true} initialOpacity={0}>
                        <div
                          className="w-full bg-white rounded-lg py-2 mb-3 text-sm md:text-lg font-bold text-gray-900 flex items-center justify-center min-h-[40px]"
                          style={{ boxShadow: "8px 8px 0 #000" }}
                        >
                          {feature.title}
                        </div>
                      </AnimatedContent>
                      <div className="text-gray-700 text-xs md:text-sm mb-2 text-left">{feature.description}</div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section 
      className="relative min-h-screen flex items-center justify-center px-4 md:px-8"
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <RiskBlobButton />
      <PDFViewerModal
        isOpen={pdfModalOpen}
        onClose={() => setPdfModalOpen(false)}
        pdfPath={currentPdfPath}
        title={modalTitle}
      />

      {docsDialog}

      <div
        className="absolute inset-0 z-10"
        style={{
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          backgroundColor: 'rgba(255, 255, 255, 0.10)',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-white/0 z-10" />
      <div className="relative z-20 flex flex-col items-center justify-center w-full h-full py-8 md:py-12">
        <div className="relative z-10 w-full flex justify-start">
          <div className="max-w-4xl w-full text-left px-4">
            {/* Badge */}
            {badge.show && (
              <div className="mb-4 md:mb-6">
                <Badge 
                  variant="secondary" 
                  className="px-3 md:px-4 py-1 md:py-2 text-xs md:text-sm font-medium bg-sky-200 text-sky-700 border-sky-300 shadow-md hover:bg-sky-300 hover:border-sky-400"
                >
                  {badge.text}
                </Badge>
              </div>
            )}

            {/* Title */}
            <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 md:mb-6 leading-tight text-white text-left">
              {title.text}{" "}
              <span className="text-blue-400">{title.highlightText}</span>
            </h1>

            {/* Description */}
            <p className="text-sm md:text-base lg:text-lg mb-6 md:mb-8 leading-relaxed text-gray-800 font-medium max-w-2xl text-left">
              {description}
            </p>

            {/* CTA Button */}
            {button.show && (
              <div className="mb-8 md:mb-12 text-left">
                <Button 
                  size="lg" 
                  onClick={handleCruiseClick}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-base md:text-lg px-6 md:px-8 py-3 md:py-4 rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 border-2 border-blue-500 hover:border-blue-400"
                  style={{
                    boxShadow: '0 10px 25px rgba(59, 130, 246, 0.4), 0 4px 10px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                  }}
                >
                  {button.text}
                </Button>
              </div>
            )}

            {/* Features */}
            <div className="w-full mt-8 md:mt-12">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 max-w-6xl text-left">
                {features.filter(feature => feature.show).map((feature, idx) => {
                  const bgVariants = [
                    'bg-[#FFF8F0]', // самая светлая
                    'bg-[#F5E6D6]', // средняя
                    'bg-[#E9D8C3]', // тёмная
                  ]
                  const cardBg = bgVariants[idx % 3]
                  return (
                    <button
                      type="button"
                      key={feature.id}
                      onClick={() => handleFeatureClick(feature.id, feature.title)}
                      className={`${cardBg} rounded-xl shadow-md p-4 md:p-6 w-full flex flex-col justify-start text-left cursor-pointer`}
                    >
                      <div className="w-full">
                        <AnimatedContent direction="vertical" distance={40} duration={0.7} ease="power3.out" threshold={0.2} animateOpacity={true} initialOpacity={0}>
                          <div
                            className="w-full bg-white rounded-lg py-2 mb-3 text-sm md:text-lg font-bold text-gray-900 flex items-center justify-center min-h-[40px]"
                            style={{ boxShadow: '8px 8px 0 #000' }}
                          >
                            {feature.title}
                          </div>
                        </AnimatedContent>
                        <div className="text-gray-700 text-xs md:text-sm mb-2 text-left">{feature.description}</div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero

