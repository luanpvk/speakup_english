import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl font-display text-base font-semibold tracking-wide focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "press-3d bg-primary text-primary-foreground shadow-[0_4px_0_hsl(var(--primary-shadow))] hover:brightness-105",
        secondary:
          "press-3d bg-secondary text-secondary-foreground shadow-[0_4px_0_hsl(var(--secondary-shadow))] hover:brightness-105",
        accent:
          "press-3d bg-accent text-accent-foreground shadow-[0_4px_0_hsl(var(--accent-shadow))] hover:brightness-105",
        outline:
          "press-3d border-2 border-border bg-card text-primary shadow-[0_4px_0_hsl(var(--border-shadow))] hover:bg-muted/60",
        ghost: "shadow-none hover:bg-muted hover:text-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        child:
          "press-3d border-2 border-primary/60 bg-card text-primary shadow-[0_4px_0_hsl(var(--primary)/0.45)] hover:bg-speakup-green-soft/60",
      },
      size: {
        default: "h-12 px-6 py-2",
        sm: "h-10 rounded-xl px-4 text-sm",
        lg: "h-14 px-8 text-lg",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
