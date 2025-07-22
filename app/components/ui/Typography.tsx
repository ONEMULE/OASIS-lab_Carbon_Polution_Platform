import React from 'react';
import { cn } from '../../lib/utils';

export interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'body-large' | 'body-medium' | 'body-small' | 'accent';
  as?: keyof React.JSX.IntrinsicElements;
}

const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  ({ className, variant = 'body-medium', as, children, ...props }, ref) => {
    const variantStyles = {
      h1: 'text-6xl md:text-7xl lg:text-8xl libre-baskerville-bold leading-none tracking-tight text-white',
      h2: 'text-4xl md:text-5xl lg:text-6xl libre-baskerville-bold leading-tight tracking-tight text-white',
      h3: 'text-2xl md:text-3xl lg:text-4xl noto-serif-sc-semibold leading-snug text-white',
      h4: 'text-xl md:text-2xl lg:text-3xl noto-serif-sc-semibold leading-normal text-white',
      'body-large': 'text-lg md:text-xl libre-baskerville-regular leading-relaxed text-[#cccccc]',
      'body-medium': 'text-base libre-baskerville-regular leading-normal text-[#cccccc]',
      'body-small': 'text-sm libre-baskerville-regular leading-tight text-[#999999]',
      accent: 'text-sm noto-serif-sc-medium uppercase tracking-widest text-white',
    };

    const defaultElements = {
      h1: 'h1',
      h2: 'h2', 
      h3: 'h3',
      h4: 'h4',
      'body-large': 'p',
      'body-medium': 'p',
      'body-small': 'p',
      accent: 'span',
    };

    const Element = as || defaultElements[variant] || 'p';

    return React.createElement(
      Element,
      {
        ref,
        className: cn(variantStyles[variant], className),
        ...props,
      },
      children
    );
  }
);
Typography.displayName = 'Typography';

export { Typography };