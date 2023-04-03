import { useEffect, useMemo } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import * as Dialog from '@radix-ui/react-dialog'
import { X, SpinnerGap } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import {
  CloseButton,
  Content,
  Overlay
} from '../styles'
import { Todo, useContextTodo } from '@/contexts/TodoContext'
import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'

const todoSchema = z.object({  
  description: z.string(),
  category: z.string(),    
  createdAt: z.number()
})

type TypeTodoSchema = z.infer<typeof todoSchema>

interface PropsModal {
  onClose: () => void,
}

export function TodoModalCreate({ onClose }: PropsModal) {
  const { createTodo, updateTodo, getByIdTodo, id, setId } = useContextTodo()

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
    setValue
  } = useForm<TypeTodoSchema>({
    resolver: zodResolver(todoSchema),
    defaultValues: {      
      category: 'Teste',      
      createdAt: Date.now(),
    },
  })

  async function loadTodo() {    
      if(id){               
        const data = getByIdTodo(id)                        
        setValue('description', data.description)                    
      }else{
        reset()     
      }       
  }

  useEffect(() => {
    loadTodo()
  },[id])

  async function handleCreateNewTransaction(data: TypeTodoSchema) {
    const { description } = data

    const todo = {
      description    
    } as Todo

    if(id){
      todo.id = id
      await updateTodo(todo)
    }else{
      await createTodo(todo)
    }

    handleClose()
  }

  function handleClose(){
    reset()
    onClose()
    setId('')
  }

  const title = useMemo(() =>{
    return `${id ? 'Update' : 'New' } activity` 
  }, [id])

  return (
    <Dialog.Portal>
      <Overlay />

      <Content>
        <Dialog.Title>{title}</Dialog.Title>

        <CloseButton role="button-close" onClick={handleClose}>
          <X size={24} />
        </CloseButton>

        <form onSubmit={handleSubmit(handleCreateNewTransaction)}>
          <Input
            type="text"
            placeholder="Description"
            required
            {...register('description')} 
          />

          <Button type="submit" role="button-confirmed" disabled={isSubmitting}>
           { isSubmitting ? <SpinnerGap className='load' size={32} /> : 'Save'} 
          </Button>
        </form>
      </Content>
    </Dialog.Portal>
  )
}