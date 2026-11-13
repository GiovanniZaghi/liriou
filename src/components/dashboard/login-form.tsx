'use client'

import { useActionState, useState } from 'react'
import { loginAction, type LoginState } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/field'

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(loginAction, {})
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [seenState, setSeenState] = useState(state)

  // Login recusado: mantém o e-mail e limpa a senha para digitar de novo
  if (state !== seenState) {
    setSeenState(state)
    if (state.error) {
      setPassword('')
      if (state.email) setEmail(state.email)
    }
  }

  return (
    <form action={action} className="flex flex-col gap-4">
      <Field
        name="email"
        type="email"
        label="E-mail"
        autoComplete="username"
        autoFocus
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Field
        name="password"
        type="password"
        label="Senha"
        autoComplete="current-password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={state.error}
      />
      <Button type="submit" fullWidth loading={pending}>
        Entrar
      </Button>
    </form>
  )
}
