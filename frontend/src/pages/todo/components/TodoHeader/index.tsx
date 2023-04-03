import { HeaderContainer, NewTodoButton } from './styles'
import * as Dialog from '@radix-ui/react-dialog'
import { TodoModalCreate } from '../TodoModal/Create'
import { useState } from 'react';

export function TodoHeader() {
  const [open, setOpen] = useState(false);

  return (    
      <HeaderContainer>
        <h1>To DO</h1>       
        <Dialog.Root open={open}>          
          <NewTodoButton role="button-new" onClick={() => setOpen(true)}>New activity</NewTodoButton>         
          <TodoModalCreate onClose={() => setOpen(false)} />
        </Dialog.Root>
      </HeaderContainer>    
  )
}