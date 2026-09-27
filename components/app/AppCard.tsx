import * as React from 'react'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'

type AppCardProps = React.ComponentProps<typeof Card> & {
  variant?: 'default' | 'elevated' | 'outlined'
  density?: 'comfortable' | 'compact'
  size?: 'sm' | 'md' | 'lg'
}

export function AppCard({ variant = 'default', density = 'comfortable', size = 'md', className, style, children, ...rest }: AppCardProps) {
  // Map semantic props to primitive props / styles
  const cardSize = size === 'sm' ? 'sm' : 'default'
  const densityPadding = density === 'compact' ? '0.5rem' : '1rem'
  const variantClass = variant === 'elevated' ? 'shadow-md' : variant === 'outlined' ? 'ring-1 ring-border' : ''

  return (
    <Card
      size={cardSize}
      className={`${variantClass} ${className ?? ''}`.trim()}
      style={{ ['--card-spacing' as any]: densityPadding, ...(style as React.CSSProperties) }}
      {...rest}
    >
      {children}
    </Card>
  )
}

export function AppCardHeader(props: React.ComponentProps<typeof CardHeader>) {
  return <CardHeader {...props} />
}

export function AppCardTitle(props: React.ComponentProps<typeof CardTitle>) {
  return <CardTitle {...props} />
}

export function AppCardContent(props: React.ComponentProps<typeof CardContent>) {
  return <CardContent {...props} />
}

export function AppCardDescription(props: React.ComponentProps<typeof CardDescription>) {
  return <CardDescription {...props} />
}

export default AppCard
