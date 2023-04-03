
import { AppProvider } from './contexts/AppContext'
import { TodoProvider } from './contexts/TodoContext'
import { Todo } from './pages/todo'
import { GlobalStyle } from './styles/global'
import { ButtonModeDark } from './components/organisms/DarkModeButton'

export default function App() {  
  return (
    <AppProvider>
      <GlobalStyle />
      <ButtonModeDark/>
      <TodoProvider>
        <Todo/>
      </TodoProvider>
    </AppProvider>
  )
}