'use client'

import { ImagePlus, Link2, LoaderCircle, X } from 'lucide-react'
import { useId, useRef, useState } from 'react'
import { uploadImageAction } from '@/app/actions/images'
import { cn } from '@/lib/utils'

const MAX_BYTES = 5 * 1024 * 1024
/** Lado maior da foto depois de reduzida: sobra para a vitrine e o detalhe, e pesa poucos KB */
const MAX_SIDE = 1600
const GALLERY_MAX = 12

/**
 * Reduz e converte para WebP no próprio navegador antes de enviar.
 * Foto de celular (3–8 MB) costuma virar 150–400 KB, o que mantém o banco leve.
 */
async function compressImage(file: File): Promise<File> {
  if (file.type === 'image/gif' || !file.type.startsWith('image/')) return file
  try {
    const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
    const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height))
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(bitmap.width * scale)
    canvas.height = Math.round(bitmap.height * scale)
    canvas.getContext('2d')?.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
    bitmap.close()
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/webp', 0.85))
    if (!blob || blob.type !== 'image/webp' || blob.size >= file.size) return file
    return new File([blob], file.name.replace(/\.\w+$/, '') + '.webp', { type: 'image/webp' })
  } catch {
    return file // formato que o navegador não decodifica: a API decide se aceita
  }
}

/** Envia uma ou mais fotos e devolve os links públicos, na mesma ordem. */
function useImageUpload() {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function upload(files: File[]): Promise<string[]> {
    setError(null)
    setUploading(true)
    const urls: string[] = []
    try {
      for (const original of files) {
        const file = await compressImage(original)
        if (file.size > MAX_BYTES) {
          setError(`"${original.name}" é grande demais (máx. 5 MB).`)
          continue
        }
        const fd = new FormData()
        fd.append('file', file)
        const res = await uploadImageAction(fd)
        if (res.ok) urls.push(res.url)
        else setError(res.error)
      }
    } finally {
      setUploading(false)
    }
    return urls
  }

  return { upload, uploading, error, setError }
}

const imagesFrom = (list: FileList | null | undefined) =>
  Array.from(list ?? []).filter((f) => f.type.startsWith('image/') || f.type === '')

// ─── Foto única (principal / hover) ───────────────────────────────────────────

interface ImageFieldProps {
  label: string
  /** Nome do campo enviado no formulário (guarda o link) */
  name: string
  value: string
  onChange: (url: string) => void
  hint?: string
  error?: string
  required?: boolean
}

export function ImageField({ label, name, value, onChange, hint, error, required }: ImageFieldProps) {
  const inputId = useId()
  const fileRef = useRef<HTMLInputElement>(null)
  const { upload, uploading, error: uploadError, setError } = useImageUpload()
  const [dragging, setDragging] = useState(false)
  const [showUrl, setShowUrl] = useState(false)
  const message = uploadError ?? error

  async function handle(files: File[]) {
    const [url] = await upload(files.slice(0, 1))
    if (url) onChange(url)
  }

  return (
    <div>
      <span className="mb-1 block text-[13px] font-medium">
        {label}
        {required && <span className="text-rubor"> *</span>}
      </span>
      <input type="hidden" name={name} value={value} />
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); void handle(imagesFrom(e.dataTransfer.files)) }}
        className={cn(
          'flex items-center gap-4 rounded-xl border-[1.5px] border-dashed bg-white p-3 transition-colors',
          dragging ? 'border-noite-900 bg-linho/40' : message ? 'border-rubor' : 'border-linho',
        )}
      >
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          aria-label={value ? 'Trocar foto' : 'Enviar foto'}
          className="relative grid size-24 shrink-0 cursor-pointer place-items-center overflow-hidden rounded-lg bg-linho/50 text-musgo hover:text-noite-900"
        >
          {value ? <img src={value} alt="" className="size-full object-cover" /> : <ImagePlus className="size-7" aria-hidden />}
          {uploading && (
            <span className="absolute inset-0 grid place-items-center bg-white/70">
              <LoaderCircle className="size-6 animate-spin text-noite-900" aria-hidden />
            </span>
          )}
        </button>

        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex flex-wrap gap-1.5">
            <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
              className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full border-[1.5px] border-noite-900 px-3.5 text-[13px] font-semibold text-noite-900 hover:bg-noite-900 hover:text-leite disabled:cursor-wait disabled:opacity-60">
              <ImagePlus className="size-4" aria-hidden />
              {uploading ? 'Enviando…' : value ? 'Trocar foto' : 'Enviar foto'}
            </button>
            {value && !uploading && (
              <button type="button" onClick={() => { onChange(''); setError(null) }}
                className="inline-flex h-9 cursor-pointer items-center gap-1 rounded-full px-3 text-[13px] font-medium text-rubor hover:bg-rubor/10">
                <X className="size-4" aria-hidden /> Remover
              </button>
            )}
          </div>
          <p className="text-[12px] text-musgo">Arraste a foto aqui ou clique. JPG, PNG ou WebP.</p>
          <button type="button" onClick={() => setShowUrl((s) => !s)}
            className="inline-flex cursor-pointer items-center gap-1 text-[12px] text-musgo underline-offset-2 hover:text-noite-900 hover:underline">
            <Link2 className="size-3.5" aria-hidden /> {showUrl ? 'Esconder link' : 'Usar um link'}
          </button>
          {showUrl && (
            <input id={inputId} type="url" value={value} placeholder="https://…" aria-label={`${label} (link)`}
              onChange={(e) => onChange(e.target.value)}
              className="h-9 w-full rounded-lg border-[1.5px] border-linho bg-white px-2.5 text-[13px] outline-none focus:border-noite-900" />
          )}
        </div>
      </div>
      <input ref={fileRef} type="file" accept="image/*" hidden
        onChange={(e) => { void handle(imagesFrom(e.target.files)); e.target.value = '' }} />
      {message ? (
        <span role="alert" className="mt-1 block text-[12px] text-rubor">{message}</span>
      ) : (
        hint && <span className="mt-1 block text-[12px] text-musgo">{hint}</span>
      )}
    </div>
  )
}

// ─── Galeria (várias fotos) ───────────────────────────────────────────────────

interface GalleryFieldProps {
  label: string
  name: string
  value: string[]
  onChange: (urls: string[]) => void
  hint?: string
  error?: string
}

export function GalleryField({ label, name, value, onChange, hint, error }: GalleryFieldProps) {
  const fileRef = useRef<HTMLInputElement>(null)
  const { upload, uploading, error: uploadError } = useImageUpload()
  const [dragging, setDragging] = useState(false)
  const message = uploadError ?? error
  const remaining = GALLERY_MAX - value.length

  async function handle(files: File[]) {
    const urls = await upload(files.slice(0, remaining))
    if (urls.length) onChange([...value, ...urls])
  }

  return (
    <div>
      <span className="mb-1 block text-[13px] font-medium">{label}</span>
      <input type="hidden" name={name} value={value.join('\n')} />
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); void handle(imagesFrom(e.dataTransfer.files)) }}
        className={cn(
          'grid grid-cols-[repeat(auto-fill,minmax(80px,1fr))] gap-2 rounded-xl border-[1.5px] border-dashed bg-white p-3',
          dragging ? 'border-noite-900 bg-linho/40' : message ? 'border-rubor' : 'border-linho',
        )}
      >
        {value.map((url, i) => (
          <div key={`${url}-${i}`} className="group relative aspect-square overflow-hidden rounded-lg bg-linho/50">
            <img src={url} alt="" className="size-full object-cover" />
            <button type="button" onClick={() => onChange(value.filter((_, j) => j !== i))} aria-label={`Remover foto ${i + 1}`}
              className="absolute top-1 right-1 grid size-6 cursor-pointer place-items-center rounded-full bg-white/90 text-rubor shadow hover:bg-rubor hover:text-leite">
              <X className="size-3.5" aria-hidden />
            </button>
          </div>
        ))}
        {remaining > 0 && (
          <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
            className="grid aspect-square cursor-pointer place-items-center rounded-lg bg-linho/40 text-musgo hover:bg-linho hover:text-noite-900 disabled:cursor-wait">
            {uploading ? (
              <LoaderCircle className="size-6 animate-spin" aria-label="Enviando" />
            ) : (
              <span className="flex flex-col items-center gap-1 text-[11px] font-medium">
                <ImagePlus className="size-6" aria-hidden /> Adicionar
              </span>
            )}
          </button>
        )}
      </div>
      <input ref={fileRef} type="file" accept="image/*" multiple hidden
        onChange={(e) => { void handle(imagesFrom(e.target.files)); e.target.value = '' }} />
      {message ? (
        <span role="alert" className="mt-1 block text-[12px] text-rubor">{message}</span>
      ) : (
        hint && <span className="mt-1 block text-[12px] text-musgo">{hint} Até {GALLERY_MAX} fotos.</span>
      )}
    </div>
  )
}
