import React, { createContext, useContext, useState, ReactNode } from 'react'

export type AppState = 'intro' | 'profile' | 'questionnaire' | 'results'

interface AppContextType {
  appState: AppState
  setAppState: (s: AppState) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppProvider: React.FC<{
  initialState?: AppState
  children: ReactNode
  // optional controlled props
  state?: AppState
  setState?: (s: AppState) => void
}> = ({ initialState = 'intro', children, state, setState }) => {
  const [internalState, setInternalState] = useState<AppState>(initialState)

  const appState = state ?? internalState
  const setAppState = setState ?? setInternalState

  return (
    <AppContext.Provider value={{ appState, setAppState }}>
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useAppContext must be used within AppProvider')
  return ctx
}

export default AppContext
