import React from 'react';
import { cn } from '../../lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'feature' | 'testimonial' | 'pricing';
  gradient?: 'none' | 'gradient-1' | 'gradient-2' | 'gradient-3' | 'pricing';
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', gradient = 'none', ...props }, ref) => {
    const baseStyles = 'rounded-2xl border border-medium-gray backdrop-blur';
    
    const variantStyles = {
      default: 'bg-dark-gray shadow-[0_4px_24px_rgba(0,0,0,0.25)] p-8',
      feature: 'bg-dark-gray shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-10',
      testimonial: 'bg-dark-gray shadow-[0_4px_16px_rgba(0,0,0,0.2)] p-6',
      pricing: 'bg-dark-gray shadow-[0_4px_24px_rgba(0,0,0,0.25)] p-8',
    };

    const gradientStyles = {
      none: '',
      'gradient-1': 'feature-gradient-1',
      'gradient-2': 'feature-gradient-2', 
      'gradient-3': 'feature-gradient-3',
      pricing: 'pricing-gradient',
    };

    return (
      <div
        ref={ref}
        className={cn(
          baseStyles,
          variantStyles[variant],
          gradient !== 'none' && gradientStyles[gradient],
          className
        )}
        {...props}
      />
    );
  }
);
Card.displayName = 'Card';

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col space-y-1.5', className)} {...props} />
  )
);
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn('text-2xl font-semibold leading-none tracking-tight text-white', className)} {...props} />
  )
);
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn('text-base text-[#cccccc] leading-relaxed', className)} {...props} />
  )
);
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('pt-6', className)} {...props} />
  )
);
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center pt-6', className)} {...props} />
  )
);
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };