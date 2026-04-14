import { type ButtonHTMLAttributes, forwardRef } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export type ButtonVariant = "primary" | "secondary";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style variant */
  variant?: ButtonVariant;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-viaje-primary text-gray-900 hover:brightness-110 active:brightness-95",
  secondary:
    "bg-viaje-secondary text-white hover:brightness-110 active:brightness-95",
};

/**
 * Reusable button component following the Viaje Bem Design System.
 *
 * - Fully rounded corners (`rounded-full`)
 * - Two variants: `primary` (amber/gold) and `secondary` (brown)
 * - Forwards ref for integration with form libraries
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", className, children, ...rest }, ref) => {
    return (
      <button
        ref={ref}
        className={twMerge(
          clsx(
            // Base styles
            "inline-flex items-center justify-center rounded-full",
            "px-6 py-2.5 text-sm font-semibold tracking-wide",
            "transition-all duration-200 ease-in-out",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-viaje-primary",
            "disabled:pointer-events-none disabled:opacity-50",
            // Variant
            variantStyles[variant],
          ),
          className,
        )}
        {...rest}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";

export { Button };
