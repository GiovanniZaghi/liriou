'use client'

import { useState } from 'react'
import { formatDayShort, formatNumber } from '@/lib/format'
import { cn } from '@/lib/utils'

/** Teto do eixo = 2 × passo "redondo" (1, 2, 3, 5 × 10ⁿ): o tick do meio é sempre inteiro. */
function niceMax(n: number) {
  if (n <= 4) return 4
  const half = n / 2
  const pow = 10 ** Math.floor(Math.log10(half))
  const step = [1, 2, 3, 5, 10].find((s) => s * pow >= half)!
  return step * pow * 2
}

const PLOT_H = 220

/** Rótulo do eixo X: no celular a cada 4 dias, no desktop dia sim dia não; "Hoje" sempre. */
function xLabelClass(i: number, last: number) {
  if (i === last) return ''
  if (i % 4 === 1) return 'sm:invisible'
  if (i % 2 === 0) return 'invisible sm:visible'
  return 'invisible'
}

/** Colunas de cadastros por dia (série única: sem legenda, o título diz o que é). */
export function DailyChart({ daily }: { daily: { day: string; count: number }[] }) {
  const [active, setActive] = useState<number | null>(null)
  const max = niceMax(Math.max(...daily.map((d) => d.count)))
  const ticks = [max, max / 2, 0]
  const peak = daily.reduce((best, d, i) => (d.count > daily[best].count ? i : best), 0)
  const lastIdx = daily.length - 1

  return (
    <figure className="rounded-[20px] border border-linho bg-white p-6">
      <figcaption>
        <h3 className="text-[16px] font-medium text-noite-900">Cadastros por dia</h3>
        <p className="text-[13px] text-musgo">Últimos 14 dias</p>
      </figcaption>

      <div className="mt-6 flex gap-3">
        {/* Eixo Y */}
        <div className="relative w-7 shrink-0 text-right text-[11px] text-musgo tabular-nums" style={{ height: PLOT_H }}>
          {ticks.map((t) => (
            <span key={t} className="absolute right-0 -translate-y-1/2" style={{ top: `${(1 - t / max) * 100}%` }}>
              {formatNumber(t)}
            </span>
          ))}
        </div>

        <div className="relative flex-1">
          {/* Grade: linha fina, recessiva */}
          <div aria-hidden className="absolute inset-x-0 top-0" style={{ height: PLOT_H }}>
            {ticks.map((t) => (
              <div key={t} className="absolute inset-x-0 h-px bg-linho" style={{ top: `${(1 - t / max) * 100}%` }} />
            ))}
          </div>

          <div className="relative grid grid-cols-14" style={{ height: PLOT_H }} onPointerLeave={() => setActive(null)}>
            {daily.map((d, i) => {
              const h = (d.count / max) * PLOT_H
              const label = `${i === lastIdx ? 'Hoje' : formatDayShort(d.day)}: ${d.count} ${d.count === 1 ? 'cadastro' : 'cadastros'}`
              return (
                // A coluna inteira é a área de hover/foco (maior que a barra)
                <div
                  key={d.day}
                  tabIndex={0}
                  role="img"
                  aria-label={label}
                  onPointerEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onBlur={() => setActive(null)}
                  className="group relative flex h-full items-end justify-center outline-none"
                >
                  {d.count > 0 && (
                    <div
                      className={cn(
                        'w-[min(24px,60%)] rounded-t-[4px] bg-folha transition-opacity',
                        active !== null && active !== i && 'opacity-45',
                      )}
                      style={{ height: Math.max(h, 2) }}
                    />
                  )}
                  {/* Rótulo direto só no pico */}
                  {i === peak && d.count > 0 && active === null && (
                    <span
                      className="absolute text-[12px] font-semibold text-noite-900 tabular-nums"
                      style={{ bottom: h + 6 }}
                    >
                      {formatNumber(d.count)}
                    </span>
                  )}
                  {active === i && (
                    <div
                      role="presentation"
                      className="pointer-events-none absolute z-10 -translate-y-2 rounded-[10px] bg-noite-900 px-3 py-2 text-center whitespace-nowrap shadow-lg"
                      style={{ bottom: h }}
                    >
                      <strong className="block text-[15px] text-leite tabular-nums">{formatNumber(d.count)}</strong>
                      <span className="text-[11px] text-leite/78">{i === lastIdx ? 'Hoje' : formatDayShort(d.day)}</span>
                    </div>
                  )}
                  <span className="pointer-events-none absolute inset-0 rounded-md group-focus-visible:outline-2 group-focus-visible:outline-noite-900" />
                </div>
              )
            })}
          </div>

          {/* Eixo X */}
          <div aria-hidden className="mt-2 grid grid-cols-14 text-center text-[11px] text-musgo tabular-nums">
            {daily.map((d, i) => (
              <span key={d.day} className={cn('whitespace-nowrap', xLabelClass(i, lastIdx))}>
                {i === lastIdx ? 'Hoje' : formatDayShort(d.day)}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Visão em tabela para leitores de tela */}
      <table className="sr-only">
        <caption>Cadastros por dia, últimos 14 dias</caption>
        <tbody>
          {daily.map((d) => (
            <tr key={d.day}>
              <th scope="row">{formatDayShort(d.day)}</th>
              <td>{d.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  )
}
