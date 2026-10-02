import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

interface SelectFieldProps extends ComponentProps<'select'> {
  placeholder: string
  options: readonly { value: string; label: string }[]
}

/** Select: pesadelo capilar (44:36). `<select>` nativo: no celular abre o seletor do sistema. */
export function SelectField({ placeholder, options, className, value, ...props }: SelectFieldProps) {
  return (
    <div className={cn('group relative h-14 w-full', className)}>
      <select
        value={value}
        className={cn(
          'size-full cursor-pointer appearance-none rounded-(--radius-field) border-[1.5px] border-linho bg-white pr-12 pl-[14.5px]',
          'text-[16px] leading-[1.55] outline-none transition-colors duration-(--t-base) ease-cetim focus:border-noite-900',
          value ? 'text-tinta' : 'text-musgo',
        )}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute top-1/2 right-[20.5px] h-[6px] w-[12px] -translate-y-1/2 transition-transform duration-(--t-base) ease-petala group-focus-within:rotate-180">
        <div className="absolute inset-[-16.67%_-8.33%]">
          <img alt="" className="block size-full max-w-none" src="/figma/chevron-select.svg" />
        </div>
      </div>
    </div>
  )
}
