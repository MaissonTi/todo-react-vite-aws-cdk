import { Todo, } from '@/contexts/TodoContext';
import { TodoList } from '@/pages/todo/components/TodoList';
import { render, screen } from '@testing-library/react';

const mock = [{
  id: '123',
  description: 'Test description',
  createdAt: Date.now()
}] as Todo[]

describe('Pages::Todo', () => {  
  describe('Components::TodoList', () => {
    it('Should display some item', async () => {  
      render(<TodoList todoList={mock} />);
  
      const tbody = screen.getByRole('tbody-todolist');
  
      expect(screen.getByText('Test description')).toBeInTheDocument()
      expect(tbody.childNodes.length).toEqual(mock.length)
    });

    it('Should not display some item', async () => {  
      render(<TodoList todoList={[] as Todo[]} />);
  
      const tbody = screen.getByRole('tbody-todolist');  
      
      expect(tbody.childNodes.length).toEqual(0)
    });
 
  });
});