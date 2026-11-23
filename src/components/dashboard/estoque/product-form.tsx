'use client'

import { Eye, EyeOff } from 'lucide-react'
import { useActionState, useState } from 'react'
import { saveProductAction, type ProductFormState } from '@/app/actions/products'
import type { AdminProduct, ProductCategory } from '@/lib/api/types'
import { CATEGORY_OPTIONS, discountPercent, formatPriceInput, parsePrice, slugify } from '@/lib/products'
import { cn } from '@/lib/utils'
import { dashBtn } from '../page-header'
import { GalleryField, ImageField } from './image-fields'
import { VitrinePreview } from './vitrine-preview'

interface ProductFormProps {
  /** Sem produto = cadastro novo */
  product?: AdminProduct
  installments: number
}

/** Campos da API que chegam com nome diferente do campo do formulário */
const FIELD_ALIASES: Record<string, string> = {
  'kit.tag': 'kitTag',
  'kit.contents': 'kitContents',
  'kit.perks': 'kitPerks',
  'kit.note': 'kitNote',
}

export function ProductForm({ product, installments }: ProductFormProps) {
  const isNew = !product
  const [state, action, pending] = useActionState<ProductFormState, FormData>(saveProductAction, {})

  const [v, setV] = useState({
    name: product?.name ?? '',
    slug: product?.slug ?? '',
    sku: product?.sku ?? '',
    category: (product?.category ?? 'scrunchie') as ProductCategory,
    price: product ? formatPriceInput(product.price) : '',
    compareAtPrice: product?.compareAtPrice ? formatPriceInput(product.compareAtPrice) : '',
    description: product?.description ?? '',
    colorName: product?.colorName ?? '',
    colorHex: product?.colorHex ?? '#6A7B6C',
    badge: product?.badge ?? '',
    imageUrl: product?.imageUrl ?? '',
    hoverImageUrl: product?.hoverImageUrl ?? '',
    gallery: product?.gallery ?? [],
    kitTag: product?.kit?.tag ?? '',
    kitContents: product?.kit?.contents ?? '',
    kitPerks: product?.kit?.perks.join('\n') ?? '',
    kitNote: product?.kit?.note ?? '',
    minStock: String(product?.minStock ?? 5),
    sortOrder: String(product?.sortOrder ?? 0),
    weightGrams: String(product?.weightGrams ?? 100),
    lengthCm: String(product?.lengthCm ?? 16),
    widthCm: String(product?.widthCm ?? 11),
    heightCm: String(product?.heightCm ?? 4),
    initialStock: '0',
    isActive: product?.isActive ?? true,
  })
  // No cadastro, o endereço acompanha o nome até ser editado à mão
  const [slugTouched, setSlugTouched] = useState(!isNew)

  const set = <K extends keyof typeof v>(key: K, value: (typeof v)[K]) => setV((prev) => ({ ...prev, [key]: value }))

  const fieldErrors = Object.fromEntries(
    Object.entries(state.fields ?? {}).map(([k, msg]) => [FIELD_ALIASES[k] ?? k.split('.')[0], msg]),
  )
  const err = (name: string) => fieldErrors[name]

  const stock = product?.stock ?? (Number(v.initialStock) || 0)
  const isKit = v.category === 'kit'
  const priceNum = parsePrice(v.price) || 0
  const compareNum = parsePrice(v.compareAtPrice) || null
  const off = discountPercent(priceNum, compareNum)
  // Aviso na hora, antes de salvar (a API também valida)
  const compareError = compareNum && compareNum <= priceNum ? 'O preço "De" precisa ser maior que o "Por"' : undefined

  return (
    <form action={action} className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
      {product && <input type="hidden" name="productId" value={product.id} />}
      <div className="space-y-5">
        {state.error && (
          <p role="alert" className="rounded-2xl bg-rubor/10 px-4 py-3 text-[14px] text-rubor">
            {state.error}
          </p>
        )}

        <Card title="Informações do produto">
          <Input label="Nome" name="name" value={v.name} error={err('name')} required maxLength={160}
            onChange={(name) => setV((p) => ({ ...p, name, slug: slugTouched ? p.slug : slugify(name) }))} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="SKU" name="sku" value={v.sku} error={err('sku')} required maxLength={60}
              hint="Código interno (ex.: SCR-CLA-SAL)" onChange={(x) => set('sku', x.toUpperCase())} />
            <Select label="Categoria" name="category" value={v.category} error={err('category')}
              options={CATEGORY_OPTIONS} onChange={(x) => set('category', x as ProductCategory)} />
          </div>
          <Input label="Endereço (slug)" name="slug" value={v.slug} error={err('slug')} required maxLength={120}
            hint="Usado em links e na busca. Só letras minúsculas, números e hífens."
            onChange={(x) => { setSlugTouched(true); set('slug', slugify(x)) }} />
          <Textarea label="Descrição" name="description" value={v.description} error={err('description')} rows={4}
            hint="Aparece no detalhe do produto na loja." onChange={(x) => set('description', x)} />
        </Card>

        <Card title="Preço e estoque">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Preço “De” (R$)" name="compareAtPrice" value={v.compareAtPrice} inputMode="decimal" placeholder="69,90"
              error={compareError ?? err('compareAtPrice')}
              hint={off ? `Aparece riscado na loja · ${off}% de desconto` : 'Opcional. Aparece riscado na loja; vazio = sem promoção.'}
              onChange={(x) => set('compareAtPrice', x.replace(/[^\d.,]/g, ''))} />
            <Input label="Preço “Por” (R$)" name="price" value={v.price} error={err('price')} required inputMode="decimal"
              placeholder="49,90" hint="Valor cobrado da cliente" onChange={(x) => set('price', x.replace(/[^\d.,]/g, ''))} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Estoque mínimo" name="minStock" type="number" min={0} value={v.minStock} error={err('minStock')}
              hint="Alerta de estoque baixo" onChange={(x) => set('minStock', x)} />
            {isNew ? (
              <Input label="Estoque inicial" name="initialStock" type="number" min={0} value={v.initialStock}
                hint="Gera uma entrada no histórico" onChange={(x) => set('initialStock', x)} />
            ) : (
              <div>
                <span className="mb-1 block text-[13px] font-medium">Estoque atual</span>
                <p className="flex h-11 items-center text-[20px] font-semibold text-noite-900 tabular-nums">{product.stock} un.</p>
                <p className="mt-1 text-[12px] text-musgo">Altere por “Movimentar”</p>
              </div>
            )}
          </div>
        </Card>

        <Card title="Envio">
          <p className="-mt-2 text-[13px] text-musgo">
            Peso e medidas do produto já embalado. A Frenet usa esses dados para calcular o frete e gerar a etiqueta.
          </p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Input label="Peso (g)" name="weightGrams" type="number" min={1} value={v.weightGrams} error={err('weightGrams')}
              required onChange={(x) => set('weightGrams', x)} />
            <Input label="Comprimento (cm)" name="lengthCm" type="number" min={1} value={v.lengthCm} error={err('lengthCm')}
              required onChange={(x) => set('lengthCm', x)} />
            <Input label="Largura (cm)" name="widthCm" type="number" min={1} value={v.widthCm} error={err('widthCm')}
              required onChange={(x) => set('widthCm', x)} />
            <Input label="Altura (cm)" name="heightCm" type="number" min={1} value={v.heightCm} error={err('heightCm')}
              required onChange={(x) => set('heightCm', x)} />
          </div>
          <p className="text-[12px] text-musgo">Dica: os Correios aceitam caixas a partir de 16 × 11 × 2 cm.</p>
        </Card>

        <Card title="Aparência na vitrine">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Cor (nome)" name="colorName" value={v.colorName} error={err('colorName')} maxLength={80}
              placeholder="Verde Sálvia" onChange={(x) => set('colorName', x)} />
            <label className="block">
              <span className="mb-1 block text-[13px] font-medium">Cor (amostra)</span>
              <span className="flex h-11 items-center gap-2 rounded-xl border-[1.5px] border-linho bg-white px-2 focus-within:border-noite-900">
                <input type="color" value={v.colorHex} onChange={(e) => set('colorHex', e.target.value.toUpperCase())}
                  aria-label="Escolher cor" className="size-7 cursor-pointer rounded-md border-0 bg-transparent p-0" />
                <input name="colorHex" value={v.colorHex} onChange={(e) => set('colorHex', e.target.value)}
                  maxLength={7} className="min-w-0 flex-1 bg-transparent font-mono text-[14px] outline-none" />
              </span>
              {err('colorHex') && <FieldError msg={err('colorHex')} />}
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Selo" name="badge" value={v.badge} error={err('badge')} maxLength={40}
              placeholder="Best Seller" hint="Etiqueta no canto da foto" onChange={(x) => set('badge', x)} />
            <Input label="Ordem na vitrine" name="sortOrder" type="number" value={v.sortOrder} error={err('sortOrder')}
              hint="Menor aparece primeiro" onChange={(x) => set('sortOrder', x)} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <ImageField label="Foto principal" name="imageUrl" value={v.imageUrl} error={err('imageUrl')} required
              onChange={(x) => set('imageUrl', x)} />
            <ImageField label="Foto ao passar o mouse" name="hoverImageUrl" value={v.hoverImageUrl}
              error={err('hoverImageUrl')} hint="Opcional, ex.: foto de uso real." onChange={(x) => set('hoverImageUrl', x)} />
          </div>
          <GalleryField label="Galeria" name="gallery" value={v.gallery} error={err('gallery')}
            hint="Fotos extras no detalhe do produto." onChange={(x) => set('gallery', x)} />
        </Card>

        {isKit && (
          <Card title="Detalhes do kit" description="Aparece na seção “Rituais Completos” da loja.">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Etiqueta" name="kitTag" value={v.kitTag} error={err('kitTag')} maxLength={40}
                placeholder="Mais desejado" onChange={(x) => set('kitTag', x)} />
              <Input label="Observação" name="kitNote" value={v.kitNote} error={err('kitNote')} maxLength={80}
                placeholder="Economize R$ 10,00" onChange={(x) => set('kitNote', x)} />
            </div>
            <Input label="Conteúdo" name="kitContents" value={v.kitContents} error={err('kitContents')} maxLength={300}
              placeholder="Contém: 1 Touca + 1 Scrunchie" onChange={(x) => set('kitContents', x)} />
            <Textarea label="Benefícios (um por linha)" name="kitPerks" value={v.kitPerks} error={err('kitPerks')} rows={3}
              onChange={(x) => set('kitPerks', x)} />
          </Card>
        )}
      </div>

      {/* Coluna da vitrine: fica visível enquanto edita */}
      <aside className="space-y-4 lg:sticky lg:top-6">
        <section className="rounded-[20px] border border-linho bg-white p-5">
          <label className="flex cursor-pointer items-center justify-between gap-4">
            <span>
              <span className="flex items-center gap-2 text-[15px] font-semibold text-noite-900">
                {v.isActive ? <Eye className="size-4 text-folha" aria-hidden /> : <EyeOff className="size-4 text-musgo" aria-hidden />}
                Exibir na vitrine
              </span>
              <span className="mt-0.5 block text-[13px] text-musgo">
                {v.isActive ? 'Visível para as clientes na loja.' : 'Oculto: só aparece aqui no estoque.'}
              </span>
            </span>
            <input type="checkbox" name="isActive" checked={v.isActive} onChange={(e) => set('isActive', e.target.checked)}
              className="peer sr-only" />
            <span className={cn('relative h-7 w-12 shrink-0 rounded-full transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-noite-900',
              v.isActive ? 'bg-folha' : 'bg-linho')}>
              <span className={cn('absolute top-1 left-1 size-5 rounded-full bg-white shadow transition-transform', v.isActive && 'translate-x-5')} />
            </span>
          </label>
        </section>

        <VitrinePreview
          visible={v.isActive}
          installments={installments}
          card={{
            name: v.name || 'Nome do produto',
            price: priceNum,
            compareAtPrice: compareNum,
            colorName: v.colorName || null,
            badge: v.badge || null,
            image: v.imageUrl,
            hoverImage: v.hoverImageUrl || v.imageUrl,
            inStock: stock > 0,
          }}
          kit={
            isKit && v.kitTag
              ? { tag: v.kitTag, contents: v.kitContents, perks: v.kitPerks.split('\n').map((s) => s.trim()).filter(Boolean), note: v.kitNote }
              : null
          }
        />

        <button type="submit" disabled={pending} className={`${dashBtn.primary} w-full`}>
          {pending ? 'Salvando…' : isNew ? 'Cadastrar produto' : 'Salvar alterações'}
        </button>
      </aside>
    </form>
  )
}

// ─── Campos ───────────────────────────────────────────────────────────────────

const inputCls = (error?: string) =>
  cn(
    'w-full rounded-xl border-[1.5px] bg-white px-3 text-[15px] text-tinta outline-none focus:border-noite-900',
    error ? 'border-rubor' : 'border-linho',
  )

function Card({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4 rounded-[20px] border border-linho bg-white p-5 sm:p-6">
      <header>
        <h2 className="text-[16px] font-semibold text-noite-900">{title}</h2>
        {description && <p className="mt-0.5 text-[13px] text-musgo">{description}</p>}
      </header>
      {children}
    </section>
  )
}

function FieldError({ msg }: { msg?: string }) {
  return msg ? <span className="mt-1 block text-[12px] text-rubor">{msg}</span> : null
}

type InputProps = Omit<React.ComponentProps<'input'>, 'onChange' | 'value'> & {
  label: string
  value: string
  hint?: string
  error?: string
  onChange: (value: string) => void
}

function Input({ label, hint, error, onChange, ...props }: InputProps) {
  return (
    <label className="block">
      <span className="mb-1 block text-[13px] font-medium">{label}</span>
      <input {...props} onChange={(e) => onChange(e.target.value)} aria-invalid={Boolean(error)} className={cn(inputCls(error), 'h-11')} />
      {error ? <FieldError msg={error} /> : hint && <span className="mt-1 block text-[12px] text-musgo">{hint}</span>}
    </label>
  )
}

type TextareaProps = Omit<React.ComponentProps<'textarea'>, 'onChange' | 'value'> & {
  label: string
  value: string
  hint?: string
  error?: string
  onChange: (value: string) => void
}

function Textarea({ label, hint, error, onChange, ...props }: TextareaProps) {
  return (
    <label className="block">
      <span className="mb-1 block text-[13px] font-medium">{label}</span>
      <textarea {...props} onChange={(e) => onChange(e.target.value)} aria-invalid={Boolean(error)} className={cn(inputCls(error), 'py-2.5 leading-relaxed')} />
      {error ? <FieldError msg={error} /> : hint && <span className="mt-1 block text-[12px] text-musgo">{hint}</span>}
    </label>
  )
}

function Select({ label, name, value, error, options, onChange }: {
  label: string
  name: string
  value: string
  error?: string
  options: { value: string; label: string }[]
  onChange: (value: string) => void
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[13px] font-medium">{label}</span>
      <select name={name} value={value} onChange={(e) => onChange(e.target.value)} className={cn(inputCls(error), 'h-11 cursor-pointer')}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <FieldError msg={error} />
    </label>
  )
}
