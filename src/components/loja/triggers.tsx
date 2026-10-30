'use client'

import type { ComponentProps } from 'react'
import { useStore, type StoreDialog } from './store-provider'

/** Botões que abrem modais ou mexem na sacola, usáveis dentro de Server Components. */

interface DialogTriggerProps extends Omit<ComponentProps<'button'>, 'onClick'> {
  dialog: StoreDialog
}

export function DialogTrigger({ dialog, ...props }: DialogTriggerProps) {
  const { openDialog } = useStore()
  return <button type="button" onClick={() => openDialog(dialog)} {...props} />
}

interface AddToCartButtonProps extends Omit<ComponentProps<'button'>, 'onClick'> {
  productId: string
  openCart?: boolean
}

export function AddToCartButton({ productId, openCart = true, ...props }: AddToCartButtonProps) {
  const { addToCart } = useStore()
  return <button type="button" onClick={() => addToCart(productId, { openCart })} {...props} />
}
