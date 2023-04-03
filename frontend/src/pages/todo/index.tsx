import { TodoHeader } from './components/TodoHeader'
import { TodoList } from './components/TodoList'
import { TodoContainer, TodoEmpty, TodoEmptyContainer } from './styles'
import { useContextTodo } from '@/contexts/TodoContext'
import { ProgressBar } from '@/components/atoms/ProgressBar'
import { useCallback } from 'react'

export function Todo() {
  const { todo, loading } = useContextTodo()

  const Empty = useCallback(() => (
    <TodoEmptyContainer>
      <TodoEmpty/>
      <h1> Empty! </h1>
    </TodoEmptyContainer>
  ),[])

  return (
    <TodoContainer>            
      <TodoHeader/>           
      {todo.length ? <TodoList todoList={todo}/> : <Empty/> }        
      {loading && <ProgressBar/>}            
    </TodoContainer>
  )
}