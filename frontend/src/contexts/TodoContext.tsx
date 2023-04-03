import { ReactNode, useCallback, useEffect, useState, createContext, useContext } from 'react'
import { api } from '../lib/axios'

export interface Todo {
  id?: string
  description: string   
  createdAt?: number 
}  

interface TodoContextType {
  todo: Todo[]
  id: string,
  loading: boolean,
  setId: (id: string) => void,
  fetchTodo: () => Promise<void>
  createTodo: (data: Todo) => Promise<void>
  updateTodo: (data: Todo) => Promise<void>
  removeTodo: (id: string) => Promise<void>
  getByIdTodo: (id: string) => Todo
}

interface TodoProviderProps {
  children: ReactNode
}

const TodoContext = createContext({} as TodoContextType)

const TodoProvider = ({ children }: TodoProviderProps) => {
  const [todo, setTodo] = useState<Todo[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [id, setId] = useState<string>('')

  const fetchTodo = useCallback(async () => {
    try {
      setLoading(true)
      const response = await api.get('todo')
      setTodo(response.data) 
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [loading])

  const getByIdTodo = useCallback(() => {   
    return todo.find(prop => prop.id == id) || {} as Todo
  }, [id])

  const createTodo = useCallback(async (data: Todo) => {  
    try {
      const response = await api.post('todo', data)  
      setTodo((state) => [response.data, ...state])
    } catch (error) {
      console.error(error)
    }   
  }, [])

  const updateTodo = useCallback(async (data: Todo) => { 
    try {
      const response = await api.put(`todo/${data.id}`, data)             
      setTodo((state) => [response.data, ...state.filter(prop => prop.id !== data.id) ])      
    } catch (error) {
      console.error(error)
    }          
  }, [])

  const removeTodo = useCallback(async (id: string) => {  
    try {
      await api.delete(`todo/${id}`)          
      setTodo((state) => state.filter(prop => prop.id !== id))      
    } catch (error) {
      console.error(error)
    }        
  }, [])

  useEffect(() => {
    fetchTodo()
  }, [])

  return (
    <TodoContext.Provider
      value={{
        loading,
        todo,
        id,
        fetchTodo,
        createTodo,
        updateTodo,
        removeTodo,
        setId,
        getByIdTodo
      }}
    >
      {children}
    </TodoContext.Provider>
  )
}

const useContextTodo = () => {
  const context = useContext(TodoContext);

  if (!context) {
    throw new Error('useContextTodo: Provider not found');
  }

  return context;
};

export { useContextTodo, TodoProvider };