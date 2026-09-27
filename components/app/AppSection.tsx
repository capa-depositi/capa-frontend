import * as React from 'react'

type AppSectionProps = React.HTMLAttributes<HTMLElement> & {
  title?: React.ReactNode
  description?: React.ReactNode
}

export function AppSection({ title, description, children, className, ...rest }: AppSectionProps) {
  return (
    <section className={`${className ?? ''}`} {...rest}>
      {title && <div className="mb-2 text-lg font-medium">{title}</div>}
      {description && <div className="mb-4 text-sm text-muted-foreground">{description}</div>}
      <div>{children}</div>
    </section>
  )
}

export default AppSection
