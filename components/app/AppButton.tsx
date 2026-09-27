import * as React from 'react'
import { Button as PrimitiveButton } from '@/components/ui/button'

type AppButtonProps = React.ComponentProps<typeof PrimitiveButton> & {
  variant?: 'primary' | 'secondary' | 'ghost'
}

export function AppButton({ variant = 'primary', size, ...rest }: AppButtonProps) {
  const map: Record<string, string> = {
    primary: 'default',
    secondary: 'secondary',
    ghost: 'ghost',
  }

  return <PrimitiveButton variant={(map[variant] as any) ?? 'default'} size={size} {...rest} />
}

export default AppButton
