import { ReactNode, useCallback, useEffect, useState, createContext } from 'react'
import { ThemeProvider } from 'styled-components'
import { defaultTheme, darkTheme } from '@/styles/themes/default'

interface AppContextType {
  isDark: boolean,
  changeTheme: () => void
}

interface AppProviderProps {
  children: ReactNode
}

export const AppContext = createContext({} as AppContextType)

export function AppProvider({ children }: AppProviderProps) {
  
  const [isDark, setDark] = useState<boolean>(false)

  const changeTheme = useCallback(() => {   
    setDark(!isDark)
    window.localStorage.setItem('theme', `${!isDark}`)  
  }, [isDark])

  useEffect(() =>{
    const localTheme = window.localStorage.getItem('theme');    
    if(localTheme){      
      setDark( JSON.parse(localTheme))
    }
  }, [])

  return (
    <AppContext.Provider value={{ isDark, changeTheme }}>
      <ThemeProvider theme={isDark ? defaultTheme : darkTheme}>
      {children}
      </ThemeProvider>
    </AppContext.Provider>
  )
}