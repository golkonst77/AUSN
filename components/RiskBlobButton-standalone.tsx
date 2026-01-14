"use client"

// Упрощенная самодостаточная версия кляксы для использования в других проектах
// Просто скопируйте этот файл и CSS стили в ваш проект

export function RiskBlobButton() {
  return (
    <>
      <style jsx>{`
        .risk-blob {
          border-radius: 60% 40% 65% 35% / 40% 60% 35% 65%;
          position: relative;
        }
        .risk-blob::before {
          content: "";
          position: absolute;
          inset: 10%;
          border-radius: inherit;
          border: 3px dashed rgba(255, 255, 255, 0.7);
          mix-blend-mode: screen;
        }
        @keyframes risk-blob-vibrate {
          0%, 100% { transform: rotate(12deg) translate(0, 0); }
          10% { transform: rotate(12deg) translate(-1px, 1px); }
          20% { transform: rotate(12deg) translate(1px, -1px); }
          30% { transform: rotate(12deg) translate(-1px, -1px); }
          40% { transform: rotate(12deg) translate(1px, 1px); }
          50% { transform: rotate(12deg) translate(-1px, 0); }
          60% { transform: rotate(12deg) translate(1px, 0); }
          70% { transform: rotate(12deg) translate(0, 1px); }
          80% { transform: rotate(12deg) translate(0, -1px); }
        }
        .risk-blob-vibrate {
          animation: risk-blob-vibrate 3.5s infinite;
          will-change: transform;
        }
        .risk-blob-vibrate:hover {
          animation: none;
        }
        @media (prefers-reduced-motion: reduce) {
          .risk-blob-vibrate {
            animation: none;
          }
        }
      `}</style>
      <a
        href="https://prostoburo.com/risk/"
        className="
          fixed z-[60] top-auto bottom-[5vh] right-[2vw] md:bottom-auto md:top-[42vh] md:right-[8vh]
          flex items-center justify-center
          w-12 h-12 md:w-36 md:h-36
          bg-[#FF00A8]
          text-white text-[7px] md:text-sm font-extrabold leading-[1.05] md:leading-tight text-center px-1.5
          shadow-[0_0_28px_rgba(255,0,168,0.55)]
          rotate-[12deg]
          hover:rotate-[18deg]
          hover:scale-110
          transition-transform duration-300 ease-out
          cursor-pointer
          select-none
          risk-blob
          risk-blob-vibrate
        "
      >
        Риски дробления<br />и самозанятых
      </a>
    </>
  )
}
