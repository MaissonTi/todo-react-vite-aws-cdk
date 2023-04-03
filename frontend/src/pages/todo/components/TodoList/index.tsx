
import * as Dialog from '@radix-ui/react-dialog'
import { useState } from 'react'
import { ButtonIcon } from '@/components/atoms/ButtonIcon'
import { Todo, useContextTodo } from '@/contexts/TodoContext'
import { dateFormatter } from '@/utils/formatter'
import { TodoModalRemove } from '../TodoModal/Remove'
import {
  Action,  
  TodoListContainer,
  TodoListTable,
} from './styles'
import { Pencil, Trash } from 'phosphor-react'
import { TodoModalCreate } from '../TodoModal/Create'


interface TodoProps {
    todoList: Todo[],
    remove?: (id: string) => Promise<void>
    updated?: (data: Todo) => Promise<void>    
}

export function TodoList({ todoList}: TodoProps) {
  const { setId } = useContextTodo()
  const [openRemove, setOpenRemove] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  function remove(id: string) {
    setOpenRemove(true)
    setId(id)
  }

  function edit(id: string) {
    setOpenEdit(true)
    setId(id)
  }

  return (  
    <>
      <TodoListContainer>      
        <TodoListTable>
          <tbody role="tbody-todolist">
            {todoList.map((todo) => {
              return (
                <tr key={todo.id}>
                  <td width="75%">{todo.description}</td>                  
                  <td>
                    {dateFormatter.format(new Date(todo.createdAt!))}
                  </td>
                  <td width="25%">
                    <Action>
                      <ButtonIcon role="button-edit" onClick={ () => edit(String(todo.id)) } color='green-500'> <Pencil size={32} /> </ButtonIcon>
                      <ButtonIcon role="button-remove" onClick={ () => remove(String(todo.id)) } color='orange-500'> <Trash size={32} />  </ButtonIcon>                                              
                    </Action>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </TodoListTable>
      </TodoListContainer>   
      <Dialog.Root open={openEdit}>
        <TodoModalCreate onClose={() => setOpenEdit(false)} />
      </Dialog.Root>
      <Dialog.Root open={openRemove}>
        <TodoModalRemove onClose={() => setOpenRemove(false)} />
      </Dialog.Root>
      </> 
  )
}