'use client'

import { CartDrawer } from '../loja/cart-drawer'
import { useStore } from '../loja/store-provider'

/** No checkout só a sacola abre como modal (sem pop-ups de marketing da loja). */
export function CheckoutDialogs() {
  const { dialog } = useStore()
  return dialog?.type === 'cart' ? <CartDrawer /> : null
}
