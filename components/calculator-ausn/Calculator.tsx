"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calculator as CalculatorIcon, TrendingDown, TrendingUp, DollarSign, AlertCircle } from "lucide-react"
import { CalculatorForm } from "./CalculatorForm"
import { DashboardSummary } from "./DashboardSummary"
import { DashboardChartsNew } from "./DashboardChartsNew"
import { DashboardComparisonTable } from "./DashboardComparisonTable"
import { DashboardLimits } from "./DashboardLimits"
import { DashboardAdvice } from "./DashboardAdvice"
import type { CalculatorFormData, ComparisonResults, EligibilityCheck } from "./types"
import {
  calculateUSN6,
  calculateUSN15,
  calculateOSNO,
  calculateAUSN8,
  calculateAUSN20,
  checkAUSNEligibility,
  AUSN_CONFIG,
} from "./calculator-config"

export function Calculator() {
  const [results, setResults] = useState<ComparisonResults | null>(null)
  const [eligibility, setEligibility] = useState<EligibilityCheck | null>(null)
  const [formData, setFormData] = useState<CalculatorFormData | null>(null)

  // Отслеживание открытия калькулятора для Яндекс.Метрики
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).ym) {
      try {
        (window as any).ym(105967457, 'reachGoal', 'calculator_open')
        console.log('[Calculator] Яндекс.Метрика: событие calculator_open отправлено')
      } catch (error) {
        console.error('[Calculator] Ошибка отправки события в Яндекс.Метрику:', error)
      }
    }
  }, [])

  // Обработка отправки формы
  const handleCalculate = (data: CalculatorFormData) => {
    // Сохраняем данные формы
    setFormData(data)

    // Проверка соответствия лимитам АУСН
    const eligibilityCheck = checkAUSNEligibility({
      revenue: data.revenue,
      employees: data.employees,
      region: data.region || 'Калужская область',
    })
    setEligibility(eligibilityCheck)

    // Расчет текущей системы
    let currentResult
    let currentSystemName = ''

    switch (data.currentTaxSystem) {
      case 'USN_INCOME':
        currentResult = calculateUSN6({
          businessType: data.businessType,
          revenue: data.revenue,
          employees: data.employees,
          avgSalary: data.avgSalary,
        })
        currentSystemName = 'УСН "Доходы" (6%)'
        break

      case 'USN_INCOME_EXPENSES':
        currentResult = calculateUSN15({
          businessType: data.businessType,
          revenue: data.revenue,
          expenses: data.expenses,
          employees: data.employees,
          avgSalary: data.avgSalary,
        })
        currentSystemName = 'УСН "Доходы минус расходы" (15%)'
        break

      case 'OSNO':
        currentResult = calculateOSNO({
          businessType: data.businessType,
          revenue: data.revenue,
          expenses: data.expenses,
          employees: data.employees,
          avgSalary: data.avgSalary,
        })
        currentSystemName = 'ОСНО'
        break

      default:
        currentResult = calculateUSN6({
          businessType: data.businessType,
          revenue: data.revenue,
          employees: data.employees,
          avgSalary: data.avgSalary,
        })
        currentSystemName = 'УСН "Доходы" (6%)'
    }

    // Расчет АУСН 8%
    const ausn8Result = calculateAUSN8({
      revenue: data.revenue,
      employees: data.employees,
      avgSalary: data.avgSalary,
    })

    // Расчет АУСН 20%
    const ausn20Result = calculateAUSN20({
      revenue: data.revenue,
      expenses: data.expenses,
      employees: data.employees,
      avgSalary: data.avgSalary,
    })

    // Расчет экономии
    const ausn8Savings = currentResult.total - ausn8Result.total
    const ausn8SavingsPercent = currentResult.total > 0 
      ? (ausn8Savings / currentResult.total) * 100 
      : 0

    const ausn20Savings = currentResult.total - ausn20Result.total
    const ausn20SavingsPercent = currentResult.total > 0 
      ? (ausn20Savings / currentResult.total) * 100 
      : 0

    // Определение лучшего варианта
    const totals = [
      { key: 'current' as const, total: currentResult.total },
      { key: 'ausn8' as const, total: ausn8Result.total },
      { key: 'ausn20' as const, total: ausn20Result.total },
    ]
    const bestOption = totals.reduce((prev, current) => 
      current.total < prev.total ? current : prev
    ).key

    // Формирование рекомендации
    let recommendation = ''
    if (bestOption === 'current') {
      recommendation = 'Ваша текущая система налогообложения остается оптимальной. Переход на АУСН не принесет экономии.'
    } else if (bestOption === 'ausn8') {
      recommendation = `Рекомендуем перейти на АУСН 8% (Доходы). Экономия составит ${Math.abs(ausn8Savings).toLocaleString('ru-RU')} руб. в год.`
    } else {
      recommendation = `Рекомендуем перейти на АУСН 20% (Доходы минус расходы). Экономия составит ${Math.abs(ausn20Savings).toLocaleString('ru-RU')} руб. в год.`
    }

    // Формируем результаты
    const comparisonResults: ComparisonResults = {
      current: {
        ...currentResult,
        system: data.currentTaxSystem,
        systemName: currentSystemName,
      },
      ausn8: {
        ...ausn8Result,
        systemName: 'АУСН 8% (Доходы)',
        savings: ausn8Savings,
        savingsPercent: ausn8SavingsPercent,
      },
      ausn20: {
        ...ausn20Result,
        systemName: 'АУСН 20% (Доходы минус расходы)',
        savings: ausn20Savings,
        savingsPercent: ausn20SavingsPercent,
      },
      bestOption,
      recommendation,
    }

    setResults(comparisonResults)

    // Прокрутка к результатам
    setTimeout(() => {
      document.getElementById('calculator-results')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }, 100)
  }

  // Обработка запроса консультации
  const handleConsultation = () => {
    // Здесь можно открыть форму контакта или модальное окно
    // Используем window для прокрутки к контактам
    const contactsSection = document.getElementById('contacts')
    if (contactsSection) {
      contactsSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Заглушка для скачивания PDF
  const handleDownloadPDF = () => {
    alert('Функция скачивания PDF будет доступна в ближайшее время')
  }

  // Сброс результатов
  const handleReset = () => {
    setResults(null)
    setEligibility(null)
    setFormData(null)
    // Прокрутка к началу калькулятора
    document.getElementById('calculator-form')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  return (
    <section id="calculator" className="min-h-screen" style={{ backgroundColor: '#FAFAFF' }}>
      {/* Hero Section */}
      <div className="relative py-16 md:py-20 bg-gradient-to-r from-blue-600 to-purple-600 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.2),transparent)]"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center text-white">
          <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white/20 backdrop-blur-sm mb-6 shadow-xl">
            <CalculatorIcon className="h-8 w-8 md:h-10 md:w-10 text-white" />
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-4 drop-shadow-lg">
            Калькулятор сравнения налоговых режимов
          </h1>
          <p className="text-base md:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Сравните вашу текущую систему налогообложения с АУСН и узнайте, сколько вы можете сэкономить
          </p>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl py-8 md:py-12 px-4">
        {/* Призыв к действию над калькулятором */}
        <div className="text-center mb-6 md:mb-8">
          <p className="text-lg md:text-xl text-gray-700 font-medium">
            Введи доход и количество сотрудников — увидишь экономию за год
          </p>
        </div>
        
        {/* Row 1: Форма + Информер лимитов */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <Card className="rounded-3xl bg-white/95 border border-slate-200 shadow-[0_10px_30px_rgba(2,6,23,0.06)]">
              <CardContent className="pt-4">
                <CalculatorForm
                  onSubmit={handleCalculate}
                  initialData={formData || undefined}
                  onChange={(data) => {
                    setFormData(data)
                  }}
                />
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-1 lg:sticky lg:top-6 lg:max-h-[calc(100vh-6rem)] overflow-auto h-fit pr-1">
            <DashboardLimits
              eligibility={eligibility}
              revenue={formData?.revenue || 0}
              employees={formData?.employees || 0}
              expenses={formData?.expenses || 0}
              region={formData?.region}
            />
          </div>
        </div>

        {/* Результаты (показываем после расчёта) */}
        {results && eligibility && formData && (
          <div id="calculator-results" className="space-y-6">
            {/* Row 2: Итоговая аналитика */}
            <DashboardSummary results={results} />

            {/* Row 3: Графики и диаграммы */}
            <DashboardChartsNew 
              results={results} 
              formData={{
                revenue: formData.revenue,
                expenses: formData.expenses,
                employees: formData.employees
              }}
            />

            {/* Row 4: Таблица сравнения */}
            <DashboardComparisonTable results={results} />

            {/* Row 5: Юридические советы */}
            <DashboardAdvice results={results} eligibility={eligibility} />

            {/* Кнопка нового расчёта */}
            <div className="flex justify-center pt-6">
              <button
                onClick={handleReset}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                ← Сделать новый расчет
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

