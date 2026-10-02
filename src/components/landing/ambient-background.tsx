import { LilyLines } from './lily-lines'
import { ScrollParallax } from './scroll-parallax'

/*
 * Fundo animado (.ambient, CSS puro): faixas de seda com blur/screen em loop de 16s
 * + parallax de rolagem, linha do lírio desenhada e grão.
 * Coordenadas dos frames 1440 (desktop) e 390 (mobile), centralizadas na viewport.
 */
export function AmbientBackground() {
  return (
    <div aria-hidden className="ambient pointer-events-none absolute inset-0 overflow-hidden">
      <ScrollParallax />

      {/* Mobile (frame 390) */}
      <div className="absolute inset-y-0 left-1/2 w-[390px] -translate-x-1/2 lg:hidden">
        <Silk className="silk-a top-[120px] left-[-327.98px] h-[444px] w-[791px]" rotate={18} w={760} h={220} inner="inset-[-27.27%_-7.89%]" src="seda-1-mobile" />
        <Silk className="silk-b top-[754.85px] left-[-40px] h-[310px] w-[623px]" rotate={-14} w={600} h={170} inner="inset-[-35.29%_-10%]" src="seda-2-mobile" />
        <Silk className="silk-a top-[2300px] left-[-220.91px] h-[272px] w-[717px]" rotate={6} w={700} h={200} inner="inset-[-30%_-8.57%]" src="seda-3-mobile" />
        <LilyLines variant="lirio" className="top-[-9.6px] left-[150px] h-[536px] w-[310px] opacity-16" />
      </div>

      {/* Desktop (frame 1440) */}
      <div className="absolute inset-y-0 left-1/2 hidden w-[1440px] -translate-x-1/2 lg:block">
        <Silk className="silk-a top-[80px] left-[-491.93px] h-[731.6px] w-[1547.4px]" rotate={14} w={1500} h={380} inner="inset-[-23.68%_-6%]" src="seda-1" />
        <Silk className="silk-b top-[411.3px] left-[500px] h-[502.6px] w-[1134.2px]" rotate={-12} w={1100} h={280} inner="inset-[-32.14%_-8.18%]" src="seda-2" />
        <Silk className="silk-a top-[1700px] left-[-335.54px] h-[484.5px] w-[1427.9px]" rotate={6} w={1400} h={340} inner="inset-[-26.47%_-6.43%]" src="seda-3" />
        <LilyLines variant="lirio" className="top-[-69.8px] left-[980.1px] h-[953.7px] w-[454.2px] opacity-14" />
      </div>

      <div className="grain absolute inset-0" />
    </div>
  )
}

interface SilkProps {
  className: string
  rotate: number
  w: number
  h: number
  inner: string
  src: string
}

function Silk({ className, rotate, w, h, inner, src }: SilkProps) {
  return (
    <div className={`silk absolute flex items-center justify-center ${className}`}>
      <div className="flex-none" style={{ rotate: `${rotate}deg` }}>
        <div className="relative" style={{ width: w, height: h }}>
          <div className={`absolute ${inner}`}>
            <img alt="" className="block size-full max-w-none" src={`/figma/${src}.svg`} />
          </div>
        </div>
      </div>
    </div>
  )
}
