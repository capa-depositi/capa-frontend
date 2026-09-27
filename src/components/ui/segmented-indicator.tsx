import * as React from 'react'
import { cn } from '@/lib/utils'

type SegItem = { value: string; label: React.ReactNode }

interface SegmentedIndicatorProps {
  items: [SegItem, SegItem, SegItem]
  active: string
  className?: string
}

export function SegmentedIndicator({ items, active, className }: SegmentedIndicatorProps) {
  return (
    <div
      className={cn(
        'w-full flex flex-row flex-nowrap items-stretch divide-x rounded-lg overflow-hidden border bg-white/50 mb-4',
        className
      )}
      role="presentation"
      style={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap' }}
    >
      {items.map((it, idx) => {
        const isActive = it.value === active
        return (
          <div
            key={it.value}
            // each segment shares equal space
            className={cn('min-w-0 px-1.5 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm select-none truncate',
              // keep text color classes as a fallback
              isActive ? 'font-semibold' : 'text-slate-600')}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              backgroundColor: isActive ? '#FDE68A' : 'transparent',
              color: isActive ? '#92400e' : undefined
            }}
            aria-current={isActive ? 'true' : undefined}
            // prevent keyboard focus/click semantics
            tabIndex={-1}
            data-seg-index={idx}
          >
            {it.label}
          </div>
        )
      })}
    </div>
  )
}

export default SegmentedIndicator
