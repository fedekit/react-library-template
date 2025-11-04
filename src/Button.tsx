import * as React from 'react';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary';
};

export function Button({ variant = 'primary', ...rest }: ButtonProps) {
  return (
    <button
      data-variant={variant}
      style={{
        padding: '0.5rem 1rem',
        borderRadius: 8,
        border: '1px solid #ddd',
        fontWeight: 600
      }}
      {...rest}
    />
  );
}