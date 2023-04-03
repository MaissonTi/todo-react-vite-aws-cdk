import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { SpinnerGap, X } from 'phosphor-react'
import {
  CloseButton,
  Content,
  Overlay
} from '../styles'
import { useContextTodo } from '@/contexts/TodoContext'
import { Button } from '@/components/atoms/Button'

interface PropsModal {
  onClose: () => void,
}

export function TodoModalRemove({ onClose }: PropsModal) {
  const [loading, setLoading] = useState(false)
  const [_open, _setOpen] = useState(false);
  const { removeTodo, id, setId } = useContextTodo()

  async function handleDelete() {    
    setLoading(true)
    await removeTodo(id)
    handleClose()
    setLoading(false)
  }

  function handleClose(){    
    onClose()
    setId('')
  }
  
  return (    
      <Dialog.Portal >
        <Overlay />
        <Content>
          <Dialog.Title>Delete TODO</Dialog.Title>

          <CloseButton role="button-close" onClick={handleClose}>
            <X size={24} />
          </CloseButton>

          <Button role="button-confirmed" onClick={handleDelete} disabled={loading}>
            { loading ? <SpinnerGap className='load' size={32} /> : 'Delete'}               
          </Button>
        </Content>
      </Dialog.Portal>    
  )
}