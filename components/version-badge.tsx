'use client'

import { useState, useEffect } from 'react'

interface VersionInfo {
  version: string
  build: string
  date: string
  description: string
}

export function VersionBadge() {
  const [versionInfo, setVersionInfo] = useState<VersionInfo | null>(null)

  useEffect(() => {
    const fetchVersion = async () => {
      try {
        // Добавляем timestamp для обхода кэша браузера
        const response = await fetch(`/version.json?v=${Date.now()}`)
        if (response.ok) {
          const data = await response.json()
          setVersionInfo(data)
        }
      } catch (error) {
        console.error('Ошибка загрузки версии:', error)
      }
    }

    fetchVersion()
  }, [])

  if (!versionInfo) {
    return (
      <div className="text-xs text-gray-500 font-mono">
        v1.0.2
      </div>
    )
  }

  return (
    <div className="text-xs text-gray-500 font-mono">
      v{versionInfo.version}
    </div>
  )
}
