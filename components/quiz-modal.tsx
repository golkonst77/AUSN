"use client"

// ✅ WhatsApp отправка включена обратно
// Дата включения: 2025-09-04

import { useRef, useState, useEffect } from "react"
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { useContactForm } from "@/hooks/use-contact-form"
import { useToast } from "@/hooks/use-toast"
import { ArrowRight, ArrowLeft, Gift, Phone, X } from "lucide-react"
import { QuizFinalStep, type QuizFinalStepHandle } from "@/components/quiz/QuizFinalStep"

// CSS анимация для мигающей карточки скидки
const discountCardAnimation = `
  @keyframes discountGlow {
    0%, 100% {
      background: linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      border: 1px solid #e5e7eb;
    }
    50% {
      background: linear-gradient(135deg, #ecfeff 0%, #cffafe 100%);
      box-shadow: 0 10px 15px -3px rgba(6, 182, 212, 0.2), 0 4px 6px -2px rgba(6, 182, 212, 0.1);
      border: 1px solid #06b6d4;
    }
  }
  
  .discount-card-animate {
    animation: discountGlow 2s ease-in-out infinite;
  }
`

interface QuizAnswer {
  questionId: number
  answer: string | string[]
}

const questions = [
  {
    id: 1,
    title: "Форма собственности",
    type: "single" as const,
    options: [
      { value: "ooo", label: "ООО" },
      { value: "ip", label: "ИП" },
    ],
  },
  {
    id: 2,
    title: "Размер годовой выручки",
    type: "single" as const,
    options: [
      { value: "revenue_lt_60", label: "До 60 млн руб" },
      { value: "revenue_60_272_5", label: "От 60 до 272,5 млн руб (НДС 5%)" },
      { value: "revenue_272_5_490_5", label: "От 272,5 до 490,5 млн руб (НДС 7%)" },
      { value: "revenue_gt_490_5", label: "Более 490,5 млн руб" },
    ],
  },
  {
    id: 3,
    title: "Количество работников",
    type: "single" as const,
    options: [
      { value: "emp_le_5", label: "До 5 человек (включительно)" },
      { value: "emp_gt_5", label: "Более 5 человек" },
    ],
  },
  {
    id: 4,
    title: "Какой процент от доходов составляют ваши расходы?",
    type: "single" as const,
    options: [
      { value: "expenses_lt_30", label: "До 30%" },
      { value: "expenses_30_70", label: "30-70%" },
      { value: "expenses_gt_70", label: "Более 70%" },
    ],
  },
]

const bonuses = ["Бесплатная консультация", "Дополнительные услуги"]

function formatRuPhone(input: string) {
  const digits = (input || "").replace(/\D/g, "")
  let normalized = digits
  if (normalized.startsWith("8")) normalized = `7${normalized.slice(1)}`
  if (normalized.startsWith("9")) normalized = `7${normalized}`
  if (!normalized.startsWith("7")) normalized = `7${normalized}`
  normalized = normalized.slice(0, 11)

  const parts = normalized.slice(1)
  const a = parts.slice(0, 3)
  const b = parts.slice(3, 6)
  const c = parts.slice(6, 8)
  const d = parts.slice(8, 10)

  let out = "+7"
  if (a) out += ` (${a}`
  if (a.length === 3) out += ")"
  if (b) out += ` ${b}`
  if (c) out += `-${c}`
  if (d) out += `-${d}`
  return out
}

function QuizSidebar({
  canProceed,
  handleNext,
  isPhoneStep,
  currentQuestion,
  calculateDiscount,
  getBonusCount,
  bonuses,
  handleSubmit,
  canSubmit,
  isSubmitting
}: {
  canProceed: boolean,
  handleNext: () => void,
  isPhoneStep: boolean,
  currentQuestion: any,
  calculateDiscount: () => number,
  getBonusCount: () => number,
  bonuses: string[],
  handleSubmit: () => void,
  canSubmit: boolean,
  isSubmitting: boolean
}) {
  return (
         <div className="w-full sm:w-80 bg-amber-100 px-2 py-2 sm:px-6 sm:py-6 border-t sm:border-t-0 sm:border-l border-amber-200 flex flex-col justify-between items-center overflow-y-auto">
      <style dangerouslySetInnerHTML={{ __html: discountCardAnimation }} />
      <div className="w-full flex flex-col items-center">
        <div className={`rounded-lg sm:rounded-2xl flex flex-col items-center mb-2 min-h-[50px] sm:min-h-[80px] max-h-[60px] sm:max-h-[100px] p-1.5 sm:p-2 w-full ${calculateDiscount() > 0 ? 'discount-card-animate' : 'bg-white shadow-md'}`}>
          <div className="flex items-center justify-center w-4 h-4 sm:w-8 sm:h-8 rounded-full bg-cyan-100 mb-0.5">
            <span className="text-xs sm:text-xl text-cyan-500">₽</span>
          </div>
          <div className="text-[8px] sm:text-xs text-gray-500 mb-0.5 leading-tight">Ваша скидка</div>
          <div className="text-xs sm:text-lg font-bold text-cyan-500 mb-0.5 leading-tight break-words max-w-[90%] text-center">{calculateDiscount().toLocaleString()} ₽</div>
          <div className="text-[7px] sm:text-[10px] text-gray-400 leading-tight text-center break-words max-w-[90%] whitespace-pre-line">на первый месяц\nобслуживания</div>
        </div>
        <div className="bg-white rounded-lg sm:rounded-2xl shadow-md flex flex-col items-center p-1.5 sm:p-3 w-full">
          <div className="text-[10px] sm:text-sm font-bold mb-0.5 text-gray-900">Бонусы в подарок:</div>
          <div className="flex gap-1 sm:gap-1 mt-0.5 justify-center items-center w-full flex-wrap sm:flex-nowrap">
            {bonuses.map((bonus, idx) => (
                             <div
                 key={bonus}
                 className="flex flex-col items-center bg-green-200 rounded-md sm:rounded-xl shadow min-w-[70px] sm:min-w-[120px] max-w-[70px] sm:max-w-[120px] min-h-[55px] sm:min-h-[100px] max-h-[55px] sm:max-h-[100px] justify-center p-0.5 sm:p-1"
                 style={{ flex: '0 0 auto' }}
               >
                <span
                  className={`w-4 h-4 sm:w-8 sm:h-8 flex items-center justify-center rounded-full text-white text-xs sm:text-xl mb-0.5 ${idx === 0 ? 'bg-orange-500' : 'bg-cyan-500'}`}
                >
                  {idx === 0 ? '🎁' : '💡'}
                </span>
                <span className="text-[8px] sm:text-xs text-gray-900 text-center font-bold leading-tight px-0.5">
                  {bonus}
                </span>
              </div>
            ))}
          </div>
        </div>
        {/* Вместо блока 'Ваша экономия' — кнопка 'Получить предложение' на последнем шаге */}
        {isPhoneStep ? (
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit || isSubmitting}
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white w-full mt-2 rounded-lg sm:rounded-xl font-bold text-[10px] sm:text-lg shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 border-2 border-orange-400 hover:border-orange-300 whitespace-normal leading-tight text-center min-h-[50px] sm:min-h-[96px] py-2 sm:py-6"
            style={{
              boxShadow: '0 10px 25px rgba(249, 115, 22, 0.4), 0 4px 10px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
            }}
          >
            {isSubmitting ? "Отправляем..." : "ПОЛУЧИТЬ ПОДАРОК И КУПОН"}
          </Button>
        ) : null}
      </div>
      {/* Кнопка Далее справа для multiple choice */}
      {(!isPhoneStep && currentQuestion?.type === "multiple") ? (
        <Button
          onClick={handleNext}
          disabled={!canProceed}
          className="bg-cyan-500 hover:bg-cyan-600 text-white w-full mt-2 py-1.5 sm:py-3 rounded-lg sm:rounded-xl font-medium text-xs sm:text-base shadow-lg hover:shadow-xl transition-all"
        >
          Далее
          <ArrowRight className="ml-1 h-3 w-3 sm:h-5 sm:w-5" />
        </Button>
      ) : null}
    </div>
  )
}

// Добавим функцию отправки WhatsApp с улучшенной обработкой ошибок
async function sendWhatsAppMessage(phone: string, message: string) {
  try {
    // phone теперь вся маска, извлекаем только цифры
    const cleanPhone = '7' + phone.replace(/\D/g, '').slice(1, 11);
    if (cleanPhone.length !== 11) {
      console.error('[WHATSAPP] Неверный формат номера:', phone);
      throw new Error('Неверный формат номера телефона');
    }
    
    console.log('[WHATSAPP] Отправляем сообщение на номер:', cleanPhone);
    
    const response = await fetch('https://gate.whapi.cloud/messages/text', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer K9edm63ZcOVma3QQQZy4vQM7JQOSI1RF',
      },
      body: JSON.stringify({
        to: cleanPhone,
        body: message,
      }),
    });
    
    const responseText = await response.text();
    console.log('[WHATSAPP] Ответ от сервера:', responseText);
    console.log('[WHATSAPP] Статус:', response.status);
    
    if (!response.ok) {
      console.error('[WHATSAPP] Ошибка отправки:', response.status, responseText);
      throw new Error(`Ошибка отправки WhatsApp: ${response.status}`);
    }
    
    try {
      const result = JSON.parse(responseText);
      if (!result.sent) {
        console.error('[WHATSAPP] Сообщение не отправлено:', result);
        throw new Error('Сообщение не было отправлено');
      }
      console.log('[WHATSAPP] Сообщение успешно отправлено:', result);
    } catch (parseError) {
      console.error('[WHATSAPP] Ошибка парсинга ответа:', parseError);
      throw new Error('Ошибка обработки ответа сервера');
    }
  } catch (error) {
    console.error('[WHATSAPP] Ошибка при отправке сообщения:', error);
    throw error;
  }
}

// Определяем тип бизнеса на основе ответов
const getBusinessType = (answers: QuizAnswer[]): "ip" | "ooo" | "both" => {
  const businessTypeAnswer = answers.find(a => a.questionId === 1)?.answer
  if (!businessTypeAnswer) return "both"

  if (Array.isArray(businessTypeAnswer)) {
    const hasIP = businessTypeAnswer.some(v => v.startsWith("ip"))
    const hasOOO = businessTypeAnswer.some(v => v.includes("ooo"))
    if (hasIP && hasOOO) return "both"
    if (hasIP) return "ip"
    if (hasOOO) return "ooo"
    return "both"
  }

  const val = businessTypeAnswer as string
  if (val.startsWith("ip")) return "ip"
  if (val.includes("ooo")) return "ooo"
  return "both"
}

function mapAusnQuizStateToQuizData(answers: QuizAnswer[], discount: number, businessType: string) {
  return {
    answers,
    discount,
    businessType,
  } as any
}

// Отправка PDF чек-листа (статический файл из public/CHEK_LIST)
async function sendWhatsAppDocument(phone: string, quiz_result: "ip" | "ooo" | "both", caption: string) {
  console.log('[QUIZ] Начинаем отправку PDF:', { phone, quiz_result, caption });
  
  // phone теперь вся маска, извлекаем только цифры
  const cleanPhone = '7' + phone.replace(/\D/g, '').slice(1, 11);
  if (cleanPhone.length !== 11) {
    console.error('[QUIZ] Неверный формат номера:', phone);
    throw new Error('Неверный формат номера телефона');
  }
  
  try {
    // Статический файл из public: /CHEK_LIST/Chek-list-perehoda.pdf
    const origin = typeof window !== 'undefined' ? window.location.origin : ''
    const isLocal = origin.includes('localhost') || origin.includes('127.0.0.1')
    const publicOrigin =
      (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_PUBLIC_ORIGIN) ||
      (isLocal ? 'https://prostoburo.com' : origin)

    const base =
      typeof window !== 'undefined' && (window.location.pathname || '').startsWith('/ausn')
        ? '/ausn'
        : ''
    const publicBase =
      (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_PUBLIC_BASEPATH) ||
      (isLocal ? '/ausn' : base)

    const fileUrl = `${publicOrigin}${publicBase}/CHEK_LIST/Chek-list-perehoda.pdf`

    // Отправляем чек-лист через WhatsApp
    const response = await fetch('/api/send-whatsapp-document', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone: cleanPhone,
        filePath: fileUrl,
        caption: caption,
      }),
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      console.error('[QUIZ] Ошибка отправки файла:', JSON.stringify(result));
      throw new Error(`Ошибка отправки файла: ${response.status}`);
    }

    console.log('[QUIZ] Файл успешно отправлен:', result);
  } catch (error) {
    console.error('[QUIZ] Ошибка при отправке файла:', error);
    throw error;
  }
}

export function QuizModal({ open, onOpenChange }: { open?: boolean, onOpenChange?: (open: boolean) => void } = {}) {
  const { isOpen, closeContactForm } = useContactForm()
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<QuizAnswer[]>([])
  const finalStepRef = useRef<QuizFinalStepHandle | null>(null)
  const [canFinalSubmit, setCanFinalSubmit] = useState(false)
  const [isFinalSubmitting, setIsFinalSubmitting] = useState(false)
  const [phone, setPhone] = useState("")
  const [wantChecklist, setWantChecklist] = useState<boolean>(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showThanks, setShowThanks] = useState(false)
  const [coupon, setCoupon] = useState<string | null>(null)
  const [whatsAppFallbackUrl, setWhatsAppFallbackUrl] = useState<string | null>(null)
  const [whatsAppAutoSent, setWhatsAppAutoSent] = useState<boolean | null>(null)

  const handleThanksOpenChange = (nextOpen: boolean) => {
    setShowThanks(nextOpen)
    if (!nextOpen) {
      setCoupon(null)
      setWhatsAppFallbackUrl(null)
      setWhatsAppAutoSent(null)
    }
  }

  const totalSteps = questions.length + 1 // +1 for phone step
  const progress = ((currentStep + 1) / totalSteps) * 100

  const calculateDiscount = () => {
    // Каждый завершенный шаг дает 2500 рублей скидки
    const completedSteps = answers.length
    const discountPerStep = 2500
    const maxDiscount = 10000

    return Math.min(completedSteps * discountPerStep, maxDiscount)
  }

  const getBonusCount = () => {
    const completedSteps = answers.length

    // Первый бонус появляется после 2-го ответа
    // Второй бонус появляется после 4-го ответа
    if (completedSteps >= 4) return 2
    if (completedSteps >= 2) return 1
    return 0
  }

  const handleAnswer = (questionId: number, answer: string | string[]) => {
    setAnswers((prev) => {
      const existing = prev.find((a) => a.questionId === questionId)
      if (existing) {
        return prev.map((a) => (a.questionId === questionId ? { ...a, answer } : a))
      }
      return [...prev, { questionId, answer }]
    })
  }

  const handleNext = () => {
    if (currentStep < questions.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    if (!phone.trim()) return

    console.log('🚀 [QUIZ] Начинаем отправку квиза...')
    console.log('📱 [QUIZ] Телефон:', phone.trim())
    console.log('📝 [QUIZ] Ответы:', answers)
    
    setIsSubmitting(true)
    let couponSaved = false
    let whatsappSent = false
    let whatsappManual = false
    let documentSent = false
    
    try {
      const discount = calculateDiscount()
      const code = `PROSTOBURO-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
      const fullCoupon = `${code}-${discount}`
      
      // Определяем тип бизнеса
      const businessType = getBusinessType(answers)
      
      // Сохраняем купон в базу данных
      try {
        const response = await fetch('/api/coupons', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            code: fullCoupon,
            phone: phone.trim(),
            discount: discount,
            business_type: businessType
          })
        })
        
        if (!response.ok) {
          if (response.status === 501) {
            couponSaved = false
          } else {
            throw new Error(`Ошибка при сохранении купона: ${response.status}`)
          }
        }
        
        if (response.ok) {
          const result = await response.json()
          console.log('Купон сохранен:', result)
          couponSaved = true
        }
      } catch (error) {
        console.error('Ошибка сохранения купона:', error)
        couponSaved = false
      }

      // ✅ ВКЛЮЧЕНО: Отправка WhatsApp-сообщения клиенту
      try {
        await sendWhatsAppMessage(phone, `Здравствуйте, спасибо за интерес к нашей компании. Вам купон на скидку ${fullCoupon}. Также Вам бесплатная консультация 30 минут и СКИДКА 50% на первый месяц обслуживания! Если есть вопросы — пишите прямо здесь, ответим оперативно.`)
        whatsappSent = true
        console.log('✅ WhatsApp сообщение отправлено успешно')
      } catch (error) {
        console.error('❌ Ошибка отправки WhatsApp сообщения:', error)
        // Создаем ссылку для ручной отправки
        const cleanPhone = '7' + phone.replace(/\D/g, '').slice(1, 11);
        const message = `Здравствуйте, спасибо за интерес к нашей компании. Вам купон на скидку ${fullCoupon}. Также Вам бесплатная консультация 30 минут и СКИДКА 50% на первый месяц обслуживания! Если есть вопросы — пишите прямо здесь, ответим оперативно.`;
        const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;

        setWhatsAppFallbackUrl(whatsappUrl)
        whatsappManual = true
        whatsappSent = false
      }
      
      // ✅ ВКЛЮЧЕНО: Отправка PDF-файла с чек-листом
      if (wantChecklist) {
        try {
          await sendWhatsAppDocument(phone, businessType, `Ваш чек-лист. Спасибо за интерес к ПростоБюро!`)
          documentSent = true
          console.log('✅ WhatsApp документ отправлен успешно')
        } catch (error) {
          console.error('❌ Ошибка отправки WhatsApp документа:', error)
          // Не прерываем выполнение
        }
      }

      // Отправляем уведомление администратору
      console.log('🚀 [QUIZ] Начинаем отправку уведомления администратору...', {
        phone: phone.trim(),
        discount: discount,
        businessType: businessType,
        coupon: fullCoupon,
        answersCount: answers.length
      })
      
      try {
        console.log('📡 [QUIZ] Вызываем API /api/admin/notify-quiz-completion...')
        const notifyResponse = await fetch('/api/admin/notify-quiz-completion', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            phone: phone.trim(),
            discount: discount,
            businessType: businessType,
            coupon: fullCoupon,
            answers: answers
          }),
        })
        
        console.log('📡 [QUIZ] Получен ответ от API:', notifyResponse.status, notifyResponse.statusText)

        if (notifyResponse.status === 404) {
          return
        }
        
        if (!notifyResponse.ok) {
          const errorText = await notifyResponse.text()
          const shortText = errorText.length > 500 ? `${errorText.slice(0, 500)}...` : errorText
          throw new Error(`API ответил с ошибкой: ${notifyResponse.status} - ${shortText}`)
        }
        
        const notifyResult = await notifyResponse.json()
        console.log('✅ [QUIZ] Уведомление администратору отправлено успешно:', notifyResult)
      } catch (error) {
        console.error('❌ [QUIZ] Ошибка отправки уведомления администратору:', error)
        // Не критично для основного функционала
      }
      
      setCoupon(fullCoupon)
      setShowThanks(true)
      setWhatsAppAutoSent(whatsappSent)
      
      // Reset form
      setCurrentStep(0)
      setAnswers([])
      setPhone("")
      setWantChecklist(true)
      closeContactForm()
      
                   // Показываем соответствующее сообщение в зависимости от успешности операций
      if (whatsappSent) {
        toast({
          title: "Успешно!",
          description: couponSaved
            ? "Ваш купон сохранен и отправлен в WhatsApp."
            : "Мы отправили вам предложение в WhatsApp. Сохранение купона на сайте временно недоступно.",
        })
      } else if (whatsappManual) {
        toast({
          title: "Почти готово",
          description: "Не удалось отправить сообщение автоматически. Откройте WhatsApp и отправьте сообщение вручную.",
          variant: "default",
        })
      } else if (couponSaved) {
        toast({
          title: "Купон сохранен!",
          description: "Купон сохранен, но возникли проблемы с отправкой в WhatsApp. Мы свяжемся с вами по телефону.",
          variant: "default",
        })
      } else {
        toast({
          title: "Ошибка",
          description: "Не удалось отправить предложение. Попробуйте еще раз или свяжитесь с нами по телефону.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Критическая ошибка при отправке:', error)
      const errorMessage = error instanceof Error ? error.message : "Попробуйте еще раз или свяжитесь с нами по телефону."
      toast({
        title: "Ошибка отправки",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const currentQuestion = questions[currentStep]
  const currentAnswer = answers.find((a) => a.questionId === currentQuestion?.id)
  const canProceed = Boolean(
    currentAnswer && (Array.isArray(currentAnswer.answer) ? currentAnswer.answer.length > 0 : currentAnswer.answer)
  ) || false

  const isPhoneStep = currentStep >= questions.length

  const quizData = mapAusnQuizStateToQuizData(answers, calculateDiscount(), getBusinessType(answers))

  // Auto-advance for single choice questions
  useEffect(() => {
    if (!isPhoneStep && currentQuestion?.type === "single" && canProceed) {
      const timer = setTimeout(() => {
        handleNext()
      }, 500) // Small delay for better UX
      return () => clearTimeout(timer)
    }
  }, [canProceed, currentQuestion?.type, isPhoneStep])

  const handleOptionCheckedChange = (questionId: number, optionValue: string, checked: CheckboxPrimitive.CheckedState) => {
    const currentAnswers = Array.isArray(answers.find(a => a.questionId === questionId)?.answer)
      ? answers.find(a => a.questionId === questionId)?.answer as string[]
      : [];

    if (checked === true) {
      handleAnswer(questionId, [...currentAnswers, optionValue]);
    } else {
      handleAnswer(
        questionId,
        currentAnswers.filter((a) => a !== optionValue)
      );
    }
  }

  const handleCheckedChange = (checked: CheckboxPrimitive.CheckedState) => {
    setWantChecklist(checked === true || checked === 'indeterminate')
  }

  return (
    <>
      <Dialog open={!!(open !== undefined ? open : isOpen)} onOpenChange={onOpenChange || closeContactForm}>
        <DialogTitle className="sr-only">Квиз для получения скидки</DialogTitle>
        <DialogDescription className="sr-only">Пройдите квиз, чтобы получить персональную скидку на бухгалтерские услуги</DialogDescription>
        <DialogContent className="max-w-4xl w-full h-[100vh] max-h-[100vh] sm:h-[90vh] sm:max-h-[800px] p-0 overflow-hidden border-0 shadow-2xl m-0 rounded-none sm:rounded-lg sm:left-[50%] sm:top-[50%] sm:translate-x-[-50%] sm:translate-y-[-50%] left-0 top-0 translate-x-0 translate-y-0" style={{
           backgroundImage: 'url("/quiz-background.jpg")',
           backgroundSize: 'cover',
           backgroundPosition: 'center',
           backgroundRepeat: 'no-repeat'
         }}>
                     <div className="h-full flex flex-col relative">
             {/* Полупрозрачный overlay для читаемости */}
             <div className="absolute inset-0 bg-white/90 backdrop-blur-sm"></div>
             <div className="relative z-10 h-full flex flex-col">
            {/* Header */}
            <div className="bg-white px-2 py-2 sm:px-12 sm:py-8 text-center border-b border-gray-100 relative">
              <button 
                onClick={() => (onOpenChange || closeContactForm)(false)} 
                className="absolute top-1 right-1 sm:hidden text-gray-400 hover:text-gray-700 z-20"
                aria-label="Закрыть"
              >
                <X className="w-4 h-4" />
              </button>
              <h1 className="text-sm sm:text-2xl font-bold text-gray-900 mb-1 leading-tight pr-6 sm:pr-0">
                Пройдите короткий опрос и получите подарок и бонусы
              </h1>
              <p className="text-xs sm:text-base text-gray-500">Всего 4 вопроса — 2 минуты вашего времени</p>
            </div>

            <div className="flex flex-col sm:flex-row flex-1 overflow-hidden">
              {/* Left side - Questions */}
                             <div className="flex-1 px-2 py-2 sm:px-12 sm:py-8 flex flex-col bg-amber-50 overflow-y-auto">
                {/* Progress */}
                <div className="mb-2 sm:mb-12">
                  <div className="flex justify-between items-center mb-1 sm:mb-4">
                    <span className="text-[10px] sm:text-sm text-gray-400">
                      Шаг {currentStep + 1} из {totalSteps}
                    </span>
                    <span className="text-[10px] sm:text-sm font-medium text-cyan-500">{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-0.5 sm:h-1">
                    <div
                      className="bg-cyan-400 h-0.5 sm:h-1 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Question or Phone Step */}
                {!isPhoneStep ? (
                  <>
                    <div className="flex flex-col px-0 py-0 overflow-y-auto max-h-[50vh] sm:max-h-[60vh]">
                      <h2 className="text-sm sm:text-2xl font-bold mb-2 sm:mb-6 mt-1 text-gray-900 leading-tight">{currentQuestion.title}</h2>

                      {currentQuestion.type === "single" ? (
                        <div className="space-y-2 sm:space-y-4">
                          {currentQuestion.options.map((option) => (
                            <div
                              key={option.value}
                              className="group relative bg-cyan-50 border border-gray-200 rounded-md sm:rounded-lg p-2 sm:p-6 hover:border-cyan-300 hover:shadow-lg transition-all duration-200 cursor-pointer"
                            >
                              <div className="flex items-center space-x-2 sm:space-x-4">
                                <input
                                  type="radio"
                                  id={option.value}
                                  name={`question-${currentQuestion.id}`}
                                  value={option.value}
                                  checked={!Array.isArray(currentAnswer?.answer) && currentAnswer?.answer === option.value}
                                  onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
                                  className="text-cyan-500 border-2 border-gray-300 w-3 h-3 sm:w-5 sm:h-5 flex-shrink-0"
                                />
                                                                 <Label
                                   htmlFor={option.value}
                                   className="text-xs sm:text-lg cursor-pointer text-gray-700 flex-1 font-normal leading-tight break-words"
                                 >
                                   {option.label}
                                 </Label>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-2 sm:space-y-4">
                          {currentQuestion.options.map((option) => (
                            <div
                              key={option.value}
                              className="group relative bg-cyan-50 border border-gray-200 rounded-md sm:rounded-lg p-2 sm:p-6 hover:border-cyan-300 hover:shadow-lg transition-all duration-200 cursor-pointer"
                            >
                              <div className="flex items-center space-x-2 sm:space-x-4">
                                <Checkbox
                                  id={option.value}
                                  checked={!!(Array.isArray(currentAnswer?.answer) && currentAnswer.answer.includes(option.value))}
                                  onCheckedChange={(checked) => handleOptionCheckedChange(currentQuestion.id, option.value, checked)}
                                  className="text-cyan-500 border-2 border-gray-300 w-3 h-3 sm:w-5 sm:h-5 rounded flex-shrink-0"
                                />
                                                                 <Label
                                   htmlFor={option.value}
                                   className="text-xs sm:text-lg cursor-pointer text-gray-700 flex-1 font-normal leading-tight break-words"
                                 >
                                   {option.label}
                                 </Label>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    {/* Navigation */}
                    <div className="flex justify-between items-center mt-2 sm:mt-6 pt-2 sm:pt-4">
                      <Button
                        variant="ghost"
                        onClick={handleBack}
                        disabled={currentStep === 0}
                        className="flex items-center text-gray-500 hover:text-gray-700 px-2 py-1 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-base"
                      >
                        <ArrowLeft className="mr-1 h-3 w-3 sm:h-5 sm:w-5" />
                        Назад
                      </Button>
                    </div>
                  </>
                ) : (
                  <QuizFinalStep
                    ref={finalStepRef}
                    site="ausn"
                    quizData={quizData}
                    uiTexts={{
                      subtitle: `Оставьте email, и мы отправим персональное коммерческое предложение со скидкой ${calculateDiscount().toLocaleString()} ₽`,
                    }}
                    defaultGiftPdfFilename="Kak_vibrat_buh_kompany.pdf"
                    onStateChange={({ canSubmit, isSubmitting }) => {
                      setCanFinalSubmit(canSubmit)
                      setIsFinalSubmitting(isSubmitting)
                    }}
                    onSuccess={({ email, phone, quizData }) => {
                      setShowThanks(true)

                      setCurrentStep(0)
                      setAnswers([])
                      setCanFinalSubmit(false)
                      setIsFinalSubmitting(false)
                      closeContactForm()
                    }}
                  />
                )}
              </div>

              {/* Right side - Discount & Bonuses */}
              <QuizSidebar
                canProceed={canProceed}
                handleNext={handleNext}
                isPhoneStep={isPhoneStep}
                currentQuestion={currentQuestion}
                calculateDiscount={calculateDiscount}
                getBonusCount={getBonusCount}
                bonuses={bonuses}
                handleSubmit={() => finalStepRef.current?.submit()}
                canSubmit={canFinalSubmit && !showThanks}
                isSubmitting={isFinalSubmitting || showThanks}
              />
            </div>
          </div>
        </div>
        </DialogContent>
      </Dialog>
      {/* Модалка благодарности */}
      <Dialog open={showThanks} onOpenChange={handleThanksOpenChange}>
        <DialogTitle className="sr-only">Благодарность за прохождение квиза</DialogTitle>
        <DialogDescription className="sr-only">Ваш купон сохранен, мы свяжемся с вами</DialogDescription>
        <DialogContent className="max-w-md w-full p-4 sm:p-8 text-center flex flex-col items-center justify-center m-4 sm:m-0">
          <button onClick={() => handleThanksOpenChange(false)} className="absolute top-2 right-2 sm:top-4 sm:right-4 text-gray-400 hover:text-gray-700"><X className="w-5 h-5 sm:w-6 sm:h-6" /></button>
          <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-green-700 leading-tight">Спасибо за уделенное время!</h2>
          <p className="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4 leading-relaxed">
            Коммерческое предложение и подарок отправлены на ваш email, проверьте почту.
          </p>
          {coupon && (
            <div className="bg-gray-100 rounded-xl p-3 sm:p-4 mb-3 sm:mb-4 w-full">
              <div className="text-xs sm:text-sm text-gray-500 mb-1">Ваш купон на скидку:</div>
              <div className="text-base sm:text-lg font-mono font-bold text-purple-700 mb-2 sm:mb-1 select-all break-all">{coupon}</div>
              <Button size="sm" variant="outline" onClick={() => {navigator.clipboard.writeText(coupon)}} className="text-xs sm:text-sm">Скопировать</Button>
            </div>
          )}
          <Button onClick={() => handleThanksOpenChange(false)} className="mt-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 sm:px-6 sm:py-2 rounded-xl text-sm sm:text-base">Закрыть</Button>
        </DialogContent>
      </Dialog>
    </>
  )
}
