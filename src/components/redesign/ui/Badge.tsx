import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../lib/cn";

const badgeVariants = cva(
  "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--color-secondary)] text-[var(--color-secondary-foreground)]",
        accent:
          "bg-[var(--color-accent)]/15 text-[var(--color-accent)]",
        outline:
          "border border-[var(--color-border)] text-[var(--color-foreground)]",
        muted:
          "bg-[var(--color-muted)] text-[var(--color-muted-foreground)]",
        success:
          "bg-[var(--success-bg)] text-[var(--success-text)] border border-[rgba(34,197,94,0.18)]",
        warning:
          "bg-[var(--warning-bg)] text-[var(--warning-text)] border border-[rgba(245,158,11,0.18)]",
        destructive:
          "bg-[var(--danger-bg)] text-[var(--danger-text)] border border-[rgba(239,68,68,0.18)]",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export const Badge = ({ className, variant, ...props }: BadgeProps) => (
  <span className={cn(badgeVariants({ variant, className }))} {...props} />
);
