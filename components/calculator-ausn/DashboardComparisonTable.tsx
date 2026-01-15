"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, FileDown, MessageCircle, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DashboardCard } from "./ui/DashboardCard"
import { formatCurrency } from "./dashboard-theme"
import type { ComparisonResults } from "./types"

interface DashboardComparisonTableProps {
  results: ComparisonResults
}

export function DashboardComparisonTable({ results }: DashboardComparisonTableProps) {
  const [expandedRow, setExpandedRow] = useState<string | null>(null)

  const systems = [
    {
      id: 'current',
      name: results.current.systemName,
      tax: results.current.tax,
      surcharge: results.current.surcharge || 0,
      insurance: results.current.insurance,
      total: results.current.total,
      savings: 0,
      isBest: results.bestOption === 'current',
    },
    {
      id: 'ausn8',
      name: 'АУСН 8% (Доходы)',
      tax: results.ausn8.tax,
      surcharge: results.ausn8.surcharge || 0,
      insurance: results.ausn8.insurance,
      total: results.ausn8.total,
      savings: results.ausn8.savings,
      isBest: results.bestOption === 'ausn8',
    },
    {
      id: 'ausn20',
      name: 'АУСН 20% (Доходы минус расходы)',
      tax: results.ausn20.tax,
      surcharge: results.ausn20.surcharge || 0,
      insurance: results.ausn20.insurance,
      total: results.ausn20.total,
      savings: results.ausn20.savings,
      isBest: results.bestOption === 'ausn20',
    },
  ]

  const handleExportPDF = () => {
    alert('Экспорт в PDF будет доступен в ближайшее время')
  }

  const handleConsultation = () => {
    // Отправляем событие в Яндекс.Метрику при клике на кнопку консультации
    if (typeof window !== 'undefined' && (window as any).ym) {
      try {
        (window as any).ym(105967457, 'reachGoal', 'consult_click')
        console.log('[DashboardComparisonTable] Яндекс.Метрика: событие consult_click отправлено')
      } catch (error) {
        console.error('[DashboardComparisonTable] Ошибка отправки события в Яндекс.Метрику:', error)
      }
    }
    const contactsSection = document.getElementById('contacts')
    if (contactsSection) {
      contactsSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const toggleExpand = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id)
  }

  return (
    <DashboardCard
      title="Детальное сравнение режимов"
      description="Разбивка по налогам и взносам для каждой системы"
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Налоговый режим</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700">Налог</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700">5% НДС</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700">Взносы</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700">Итого</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700">Экономия</th>
              <th className="text-center py-3 px-4 font-semibold text-gray-700">Действия</th>
            </tr>
          </thead>
          <tbody>
            {systems.map((system, idx) => (
              <>
                <tr
                  key={system.id}
                  className={`border-b border-gray-100 transition-colors ${
                    system.isBest
                      ? 'bg-gradient-to-r from-green-50 to-emerald-50'
                      : idx % 2 === 0
                      ? 'bg-white hover:bg-gray-50'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">{system.name}</span>
                      {system.isBest && (
                        <span className="px-2 py-0.5 text-xs font-semibold bg-green-600 text-white rounded-full">
                          Лучший
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right font-medium text-gray-900">
                    {formatCurrency(system.tax)}
                  </td>
                  <td className="py-4 px-4 text-right font-medium text-gray-900">
                    {formatCurrency(system.surcharge || 0)}
                  </td>
                  <td className="py-4 px-4 text-right font-medium text-gray-900">
                    {formatCurrency(system.insurance)}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className="text-lg font-bold text-gray-900">
                      {formatCurrency(system.total)}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    {system.savings === 0 ? (
                      <span className="text-gray-400">—</span>
                    ) : (
                      <span className={`font-bold ${
                        system.savings > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {system.savings > 0 ? '-' : '+'}{formatCurrency(Math.abs(system.savings))}
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleExpand(system.id)}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        {expandedRow === system.id ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </td>
                </tr>

                {/* Развёрнутая информация */}
                {expandedRow === system.id && (
                  <tr className="bg-blue-50 border-b border-gray-100">
                    <td colSpan={7} className="py-4 px-8">
                      <div className="space-y-3 text-sm">
                        <div className="flex items-start gap-2">
                          <Info className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold text-gray-900 mb-2">
                              Детальная информация о {system.name}:
                            </p>
                            <div className="space-y-1 text-gray-700">
                              <p>• Ставка налога: {
                                system.id === 'ausn8' ? '8%' :
                                system.id === 'ausn20' ? '20%' :
                                system.name.includes('6%') ? '6%' :
                                system.name.includes('15%') ? '15%' : 'смешанная'
                              }</p>
                              <p>• Налоговая база: {
                                system.id === 'ausn8' || system.name.includes('6%') ? 'Доходы' :
                                system.id === 'ausn20' || system.name.includes('15%') ? 'Доходы минус расходы' :
                                'Смешанная'
                              }</p>
                              {system.surcharge > 0 && (
                                <p>• Доп. надбавка 5% (доход &gt; 10 млн): {formatCurrency(system.surcharge)}</p>
                              )}
                              <p>• Страховые взносы: {formatCurrency(system.insurance)}</p>
                              {system.id.startsWith('ausn') && (
                                <p className="text-green-700">• АУСН: автоматический расчёт и отчётность через банк</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>

      {/* Действия */}
      <div className="mt-6 pt-6 border-t border-gray-200 flex flex-wrap gap-3 justify-end">
        <Button
          variant="outline"
          onClick={handleExportPDF}
          className="flex items-center gap-2"
        >
          <FileDown className="h-4 w-4" />
          Экспорт в PDF
        </Button>
        <Button
          onClick={handleConsultation}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          <MessageCircle className="h-4 w-4" />
          Получить консультацию
        </Button>
      </div>
    </DashboardCard>
  )
}

