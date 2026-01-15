"use client"

import { Lightbulb, AlertTriangle, FileCheck, ArrowRight } from "lucide-react"
import { DashboardCard } from "./ui/DashboardCard"
import { Button } from "@/components/ui/button"
import type { ComparisonResults, EligibilityCheck } from "./types"
import Link from "next/link"

interface DashboardAdviceProps {
  results: ComparisonResults
  eligibility: EligibilityCheck
}

export function DashboardAdvice({ results, eligibility }: DashboardAdviceProps) {
  const hasEconomy = results.ausn8.savings > 0 || results.ausn20.savings > 0
  const bestOption = results.bestOption

  // Документы для перехода на АУСН
  const documents = [
    'Уведомление о переходе на АУСН',
    'Договор с уполномоченным банком',
    'Заявление на открытие расчётного счёта',
    'Документы, подтверждающие вид деятельности',
    'Справка о среднесписочной численности',
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Рекомендации */}
      <DashboardCard
        title="Юридические рекомендации"
        description="На основе введённых данных"
        gradient="primary"
      >
        <div className="space-y-4">
          {/* Основная рекомендация */}
          {eligibility.eligible && hasEconomy && (
            <div className="p-4 bg-green-50 border-l-4 border-green-600 rounded-lg">
              <div className="flex gap-3">
                <Lightbulb className="h-6 w-6 text-green-600 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-green-900 mb-2">
                    Переход на АУСН выгоден!
                  </h4>
                  <p className="text-sm text-green-800 mb-2">
                    {results.recommendation}
                  </p>
                  <p className="text-sm text-green-700">
                    Рекомендуем подать уведомление о переходе до конца года для применения АУСН со следующего календарного года.
                  </p>
                </div>
              </div>
            </div>
          )}

          {!eligibility.eligible && (
            <div className="p-4 bg-red-50 border-l-4 border-red-600 rounded-lg">
              <div className="flex gap-3">
                <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-red-900 mb-2">
                    Не соответствуете требованиям АУСН
                  </h4>
                  <p className="text-sm text-red-800 mb-2">
                    Обнаружены следующие проблемы:
                  </p>
                  <ul className="text-sm text-red-700 space-y-1">
                    {eligibility.issues.map((issue, idx) => (
                      <li key={idx}>• {issue}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {eligibility.eligible && !hasEconomy && (
            <div className="p-4 bg-orange-50 border-l-4 border-orange-600 rounded-lg">
              <div className="flex gap-3">
                <AlertTriangle className="h-6 w-6 text-orange-600 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-orange-900 mb-2">
                    Переход на АУСН не даст экономии
                  </h4>
                  <p className="text-sm text-orange-800">
                    Несмотря на соответствие требованиям, в вашем случае АУСН приведёт к дополнительным расходам. 
                    Рекомендуем остаться на текущем режиме налогообложения.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Дополнительные советы */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-blue-600" />
              Важные моменты:
            </h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <ArrowRight className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <span>АУСН доступен только для малого бизнеса с оборотом до 60 млн руб. в год</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <span>Количество сотрудников не должно превышать 5 человек</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <span>Необходим расчётный счёт в уполномоченном банке</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <span>Налоги и взносы рассчитываются автоматически банком</span>
              </li>
            </ul>
          </div>

          {/* Кнопка консультации */}
          <div className="pt-4">
            <Link 
              href="/support" 
              passHref
              onClick={() => {
                // Отправляем событие в Яндекс.Метрику при клике на кнопку консультации
                if (typeof window !== 'undefined' && (window as any).ym) {
                  try {
                    (window as any).ym(105967457, 'reachGoal', 'consult_click')
                    console.log('[DashboardAdvice] Яндекс.Метрика: событие consult_click отправлено')
                  } catch (error) {
                    console.error('[DashboardAdvice] Ошибка отправки события в Яндекс.Метрику:', error)
                  }
                }
              }}
            >
              <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Получить консультацию специалиста
              </Button>
            </Link>
          </div>
        </div>
      </DashboardCard>

      {/* Документы */}
      <DashboardCard
        title="Документы для перехода"
        description="Что нужно подготовить"
        gradient="secondary"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-700">
            Для перехода на АУСН вам потребуются следующие документы:
          </p>

          <div className="space-y-3">
            {documents.map((doc, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
              >
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-semibold">
                  {idx + 1}
                </div>
                <span className="text-sm text-gray-800 font-medium">{doc}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-gray-200">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-900 mb-3">
                <strong>Обратите внимание:</strong> Уведомление о переходе нужно подать не позднее 31 декабря для применения АУСН с 1 января следующего года.
              </p>
              <Link href="/banks" passHref>
                <Button variant="outline" className="w-full">
                  Посмотреть список уполномоченных банков
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </DashboardCard>
    </div>
  )
}

