import { render, screen } from '@testing-library/react';
import { Button } from './Button';

test('renderiza children', () => {
  render(<Button>Hola</Button>);
  expect(screen.getByText('Hola')).toBeInTheDocument();
});