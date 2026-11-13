import { Pencil } from 'lucide-react'
import Link from 'next/link'
import type { AdminProduct } from '@/lib/api/types'
import { formatBRL } from '@/lib/format'
import { categoryLabel } from '@/lib/products'
import { cn } from '@/lib/utils'
import { dashBtn } from '../page-header'
import { StockMovementDialog } from './stock-movement-dialog'
import { VisibilityToggle } from './visibility-toggle'

export function ProductsTable({ rows }: { rows: AdminProduct[] }) {
  if (rows.length === 0) {
    return (
      <div className="rounded-[20px] border border-linho bg-white px-6 py-14 text-center text-[14px] text-musgo">
        Nenhum produto encontrado.{' '}
        <Link href="/dashboard/estoque/novo" className="font-medium text-noite-900 underline">
          Cadastrar produto
        </Link>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-[20px] border border-linho bg-white">
      <table className="w-full min-w-[960px] text-left text-[14px]">
        <thead className="border-b border-linho text-[12px] font-semibold tracking-[0.08em] text-musgo uppercase">
          <tr>
            <th scope="col" className="px-5 py-3.5 font-semibold">Produto</th>
            <th scope="col" className="px-5 py-3.5 font-semibold">SKU</th>
            <th scope="col" className="px-5 py-3.5 font-semibold">Categoria</th>
            <th scope="col" className="px-5 py-3.5 text-right font-semibold">Preço</th>
            <th scope="col" className="px-5 py-3.5 text-right font-semibold">Estoque</th>
            <th scope="col" className="px-5 py-3.5 font-semibold">Vitrine</th>
            <th scope="col" className="px-5 py-3.5 font-semibold"><span className="sr-only">Ações</span></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((p) => (
            <tr key={p.id} className="border-b border-linho/70 last:border-0 hover:bg-leite/60">
              <td className="px-5 py-3">
                <Link href={`/dashboard/estoque/${p.id}`} className="flex items-center gap-3">
                  <img src={p.imageUrl} alt="" className="size-11 shrink-0 rounded-xl border border-linho object-cover" />
                  <span className="min-w-0">
                    <span className="block font-medium text-noite-900 hover:underline">{p.name}</span>
                    {p.colorName && <span className="block text-[12px] text-musgo">{p.colorName}</span>}
                  </span>
                </Link>
              </td>
              <td className="px-5 py-3 font-mono text-[13px] text-musgo">{p.sku}</td>
              <td className="px-5 py-3 text-tinta">{categoryLabel(p.category)}</td>
              <td className="px-5 py-3 text-right whitespace-nowrap tabular-nums">{formatBRL(p.price)}</td>
              <td className="px-5 py-3 text-right whitespace-nowrap">
                <span className={cn('font-semibold tabular-nums', p.stock === 0 ? 'text-rubor' : 'text-noite-900')}>{p.stock}</span>
                <StockBadge product={p} />
              </td>
              <td className="px-5 py-3">
                <VisibilityToggle productId={p.id} isActive={p.isActive} name={p.name} />
              </td>
              <td className="px-5 py-3">
                <div className="flex items-center justify-end gap-1">
                  <StockMovementDialog productId={p.id} productName={p.name} stock={p.stock} />
                  <Link href={`/dashboard/estoque/${p.id}`} className={dashBtn.ghost}>
                    <Pencil className="size-3.5" aria-hidden /> Editar
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function StockBadge({ product }: { product: Pick<AdminProduct, 'stock' | 'isLowStock' | 'minStock'> }) {
  if (product.stock === 0)
    return <span className="ml-2 rounded-full bg-rubor/12 px-2 py-0.5 text-[11px] font-semibold text-rubor">Esgotado</span>
  if (product.isLowStock)
    return (
      <span title={`Mínimo: ${product.minStock}`} className="ml-2 rounded-full bg-petala/60 px-2 py-0.5 text-[11px] font-semibold text-rubor">
        Baixo
      </span>
    )
  return null
}
