import * as React from 'react'
import AppCard from '@/components/app/AppCard'

type SettingsSectionProps = {
  title: string
  description?: string
  density?: 'comfortable' | 'compact'
}

export function SettingsSection({ title, description, density = 'comfortable', children }: React.PropsWithChildren<SettingsSectionProps>) {
  return (
    <AppCard density={density} className="mb-4">
      <div className="px-2 py-1">
        <div className="mb-1 text-sm font-medium">{title}</div>
        {description && <div className="mb-2 text-xs text-muted-foreground">{description}</div>}
        <div>{children}</div>
      </div>
    </AppCard>
  )
}

export default SettingsSection
