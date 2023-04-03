
import { Container } from './styles'
import { Moon, Sun } from 'phosphor-react'
import { ButtonIcon } from '@/components/atoms/ButtonIcon'
import { AppContext } from '@/contexts/AppContext'
import { useContext } from 'react'

export function ButtonModeDark() {  
  const { isDark, changeTheme } = useContext(AppContext)

  return (
    <Container>
      <ButtonIcon onClick={changeTheme}>
        {isDark ? <Moon /> : <Sun /> }
      </ButtonIcon>
    </Container>
  )
}
