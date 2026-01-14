import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const defaultUrl =
      process.env.NODE_ENV === "development"
        ? "http://localhost:3001/api/quiz-lead"
        : "https://prostoburo.com/api/quiz-lead"

    const rawBackendUrl =
      (process.env.QUIZ_LEAD_BACKEND_URL ||
        process.env.QUIZ_LEAD_PROXY_URL ||
        process.env.NEXT_PUBLIC_QUIZ_LEAD_PROXY_URL ||
        defaultUrl)
        .toString()
        .trim()

    const url = rawBackendUrl.replace(/\/+$/, "").endsWith("/api/quiz-lead")
      ? rawBackendUrl.replace(/\/+$/, "")
      : `${rawBackendUrl.replace(/\/+$/, "")}/api/quiz-lead`

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.QUIZ_LEAD_PROXY_KEY
          ? { "x-quiz-proxy-key": String(process.env.QUIZ_LEAD_PROXY_KEY) }
          : {}),
      },
      body: JSON.stringify(body),
    })

    const contentType = res.headers.get("content-type") || ""

    if (contentType.includes("application/json")) {
      const json = await res.json()
      return NextResponse.json(json, { status: res.status })
    }

    const text = await res.text()
    return new NextResponse(text, {
      status: res.status,
      headers: {
        "content-type": contentType || "text/plain; charset=utf-8",
      },
    })
  } catch (error) {
    console.error("[quiz-lead proxy] failed:", error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    
    // Более понятное сообщение об ошибке
    let userMessage = "Сервер временно недоступен. Пожалуйста, попробуйте позже."
    if (errorMessage.includes("ECONNREFUSED") || errorMessage.includes("fetch failed")) {
      userMessage = "Не удалось подключиться к серверу. Проверьте подключение к интернету."
    } else if (errorMessage.includes("timeout")) {
      userMessage = "Превышено время ожидания ответа сервера. Попробуйте еще раз."
    }
    
    return NextResponse.json(
      {
        success: false,
        error: "PROXY_FAILED",
        details: userMessage,
        technical: process.env.NODE_ENV === "development" ? errorMessage : undefined,
      },
      { status: 500 }
    )
  }
}
