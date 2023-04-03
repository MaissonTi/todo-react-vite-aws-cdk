import { Button } from '@/components/atoms/Button';
import { render, screen } from '@testing-library/react';

describe('Components::Atoms::Button', () => {
  it('Should display name button', async () => {
    render(<Button>Save</Button>);
   
    expect(screen.getByText('Save')).toBeInTheDocument()
  });
});