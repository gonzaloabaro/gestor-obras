'use client'

import { AppProgressBar as ProgressBar } from 'next-nprogress-bar'

export function NavigationProgress() {
  return (
    <ProgressBar
      height="2px"
      color="#D4A853"
      options={{ showSpinner: false }}
      shallowRouting
    />
  )
}
