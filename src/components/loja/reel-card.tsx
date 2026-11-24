'use client'

import { Play } from 'lucide-react'
import { useRef } from 'react'
import type { Reel } from '@/lib/content'
import { useStore } from './store-provider'

/**
 * Card do vídeo: mostra o primeiro quadro (sem baixar o vídeo inteiro), toca mudo ao passar o mouse
 * e abre o vídeo com som ao clicar.
 */
export function ReelCard({ reel, index }: { reel: Reel; index: number }) {
  const { openDialog } = useStore()
  const video = useRef<HTMLVideoElement>(null)

  return (
    <button
      type="button"
      onClick={() => openDialog({ type: 'reel', reel })}
      onMouseEnter={() => video.current?.play().catch(() => {})}
      onMouseLeave={() => video.current?.pause()}
      data-reveal
      style={{ '--i': index } as React.CSSProperties}
      aria-label={`Assistir: ${reel.title}`}
      className="group relative aspect-[9/16] max-h-[560px] w-full overflow-hidden rounded-3xl bg-black/90 text-left shadow-lg"
    >
      <video
        ref={video}
        // #t=0.1 faz o navegador desenhar o primeiro quadro como capa
        src={`${reel.video}#t=0.1`}
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden
        className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 flex flex-col justify-between bg-linear-to-t from-black/70 via-transparent to-transparent p-6 text-white">
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium backdrop-blur-md">@lirio.u</span>
          <span className="rounded-full bg-white/30 p-2.5 backdrop-blur-md">
            <Play className="size-3 fill-current" aria-hidden />
          </span>
        </div>
        <div>
          {reel.caption && <p className="font-serif text-lg">{reel.caption}</p>}
          <p className="mt-1 text-xs text-white/70">Toque para ver o vídeo</p>
        </div>
      </div>
    </button>
  )
}
