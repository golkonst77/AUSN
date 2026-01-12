"use client"

export function RiskBlobButton() {
  return (
    <a
      href="https://prostoburo.com/risk/"
      className="
        fixed z-[60] top-auto bottom-[10vh] right-[2vw] md:bottom-auto md:top-[32vh] md:right-[8vh]
        flex items-center justify-center
        w-16 h-16 md:w-48 md:h-48
        bg-[#FF00A8]
        text-white text-[8px] md:text-base font-extrabold leading-[1.05] md:leading-tight text-center px-2
        shadow-[0_0_28px_rgba(255,0,168,0.55)]
        rotate-[12deg]
        hover:rotate-[18deg]
        hover:scale-110
        transition-transform duration-300 ease-out
        cursor-pointer
        select-none
        blob-ausn
        blob-ausn-vibrate
      "
    >
      Риски дробления<br />и самозанятых
    </a>
  )
}
