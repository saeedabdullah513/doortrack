"use client";
import { cn } from "@/lib/utils";
import { type ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost" | "outline";
  size?: "sm" | "md" | "lg" | "xl";
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, disabled, children, ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed";

    const variants = {
      primary: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
      secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-400",
      danger: "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 focus:ring-red-400",
      ghost: "text-gray-600 hover:bg-gray-100 focus:ring-gray-400",
      outline: "border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-400",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-sm",
      lg: "px-5 py-2.5 text-base",
      xl: "px-6 py-3.5 text-base w-full",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      >
        {loading && (
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
