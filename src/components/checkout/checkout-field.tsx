import { cn } from '@/lib/utils'

type CheckoutFieldProps = Omit<React.ComponentProps<'input'>, 'onChange' | 'value'> & {
  label: string
  value: string
  error?: string
  hint?: string
  onChange: (value: string) => void
}

/** Campo do checkout na paleta da loja, com erro anunciado para leitores de tela. */
export function CheckoutField({ label, value, error, hint, onChange, className, id, name, ...props }: CheckoutFieldProps) {
  const fieldId = id ?? `co-${name}`
  return (
    <div className={className}>
      <label htmlFor={fieldId} className="mb-1 block text-xs font-semibold tracking-wider text-grafite uppercase">
        {label}
      </label>
      <input
        {...props}
        id={fieldId}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${fieldId}-erro` : undefined}
        className={cn(
          'w-full rounded-xl border bg-white px-4 py-3 text-sm text-grafite placeholder:text-cinza/60 focus:outline-none',
          error ? 'border-rubor focus:border-rubor' : 'border-borda focus:border-salvia',
        )}
      />
      {error ? (
        <p id={`${fieldId}-erro`} role="alert" className="mt-1 text-[11px] text-rubor">
          {error}
        </p>
      ) : (
        hint && <p className="mt-1 text-[11px] text-cinza">{hint}</p>
      )}
    </div>
  )
}
