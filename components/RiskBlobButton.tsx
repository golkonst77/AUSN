"use client"

export function RiskBlobButton() {
  return (
    <a
      href="https://prostoburo.com/risk/"
      className="
        fixed z-[60] top-auto bottom-[24vh] right-[4vw] md:bottom-auto md:top-[24vh] md:right-[12vh]
        flex items-center justify-center
        w-16 h-16 md:w-48 md:h-48
        bg-[#FF00A8]
        text-white text-[9px] md:text-xl font-extrabold leading-[1.05] md:leading-tight text-center px-2
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
