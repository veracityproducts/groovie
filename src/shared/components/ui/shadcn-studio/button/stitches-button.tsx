'use client';

import React from 'react';
import { motion } from 'motion/react';
import { cn } from '@/shared/lib/cn';

export interface StitchesButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'muted';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

const variantStyles = {
  primary:
    'border-primary-500 bg-primary-500 text-white hover:shadow-lg dark:border-primary-600 dark:bg-primary-600',
  secondary:
    'border-secondary-500 bg-secondary-500 text-white hover:shadow-lg dark:border-secondary-600 dark:bg-secondary-600',
  accent:
    'border-accent-500 bg-accent-500 text-white hover:shadow-lg dark:border-accent-600 dark:bg-accent-600',
  muted:
    'border-muted bg-muted text-muted-foreground hover:shadow-lg dark:border-muted dark:bg-muted dark:text-muted-foreground',
};

const sizeStyles = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

/**
 * StitchesButton - Animated button with 3D press effect
 * Features:
 * - Smooth spring animations on hover and press
 * - Stitched border effect with inner shadows
 * - Multiple color variants (primary, secondary, accent, muted)
 * - Multiple sizes (sm, md, lg)
 * - Auto dark mode support via CSS variables
 * - Loading state with disabled styling
 * - Full accessibility support
 */
export const StitchesButton = React.forwardRef<
  HTMLButtonElement,
  StitchesButtonProps
>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled = false,
      className,
      ...props
    },
    ref,
  ) => {
    const [isPressed, setIsPressed] = React.useState(false);

    const handleMouseDown = () => {
      if (!disabled && !isLoading) setIsPressed(true);
    };

    const handleMouseUp = () => setIsPressed(false);
    const handleMouseLeave = () => setIsPressed(false);

    const isDisabled = disabled || isLoading;

    return (
      <motion.button
        ref={ref}
        type={props.type || 'button'}
        disabled={isDisabled}
        className={cn(
          'group relative rounded-lg border-2 font-semibold transition-opacity',
          variantStyles[variant],
          sizeStyles[size],
          isDisabled && 'cursor-not-allowed opacity-60',
          className,
        )}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        whileHover={!isDisabled ? { scale: 1.05 } : {}}
        whileTap={!isDisabled ? { scale: 0.95 } : {}}
        animate={
          isPressed
            ? {
                y: 2,
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
              }
            : {
                y: 0,
                boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
              }
        }
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 20,
        }}
      >
        {/* Stitched border overlay */}
        <motion.span
          className="absolute top-0 left-0 size-full rounded-md border border-dashed opacity-40 group-active:opacity-30"
          style={{
            borderColor: 'currentColor',
          }}
          animate={
            isPressed
              ? { opacity: 0.8, scale: 0.98 }
              : { opacity: 1, scale: 1 }
          }
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 20,
          }}
        />

        {/* Inner shadow effect - top light */}
        <span className="absolute top-0 left-0 size-full rounded-md shadow-inner shadow-white/30 group-active:shadow-white/10 dark:shadow-black/30 dark:group-active:shadow-black/10" />

        {/* Inner shadow effect - bottom dark (3D bubble) */}
        <span className="absolute top-0 left-0 size-full rotate-180 rounded-md shadow-inner shadow-black/30 group-active:shadow-black/10 dark:shadow-white/20" />

        {/* Loading spinner */}
        {isLoading && (
          <span className="absolute inset-0 flex items-center justify-center">
            <svg
              className="h-4 w-4 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-label="Loading"
            >
              <title>Loading</title>
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </span>
        )}

        {/* Button text */}
        <span className={isLoading ? 'invisible' : 'visible'}>
          {children}
        </span>
      </motion.button>
    );
  },
);

StitchesButton.displayName = 'StitchesButton';
