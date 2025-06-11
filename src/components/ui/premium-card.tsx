
import * as React from "react"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const premiumCardVariants = cva(
  "relative overflow-hidden bg-white border border-gray-100 transition-all duration-300 ease-out group",
  {
    variants: {
      variant: {
        default: "hover:border-gray-200 hover:shadow-sm",
        elevated: "shadow-sm hover:shadow-md hover:border-gray-150",
        interactive: "hover:border-gray-200 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer",
        ghost: "border-transparent hover:border-gray-100 hover:bg-gray-50/30",
        premium: "shadow-lg hover:shadow-xl hover:border-gray-200",
      },
      size: {
        sm: "p-4",
        default: "p-6",
        lg: "p-8",
        xl: "p-10",
      },
      radius: {
        default: "rounded-xl",
        sm: "rounded-lg",
        lg: "rounded-2xl",
        none: "rounded-none",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      radius: "default",
    },
  }
)

export interface PremiumCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof premiumCardVariants> {}

const PremiumCard = React.forwardRef<HTMLDivElement, PremiumCardProps>(
  ({ className, variant, size, radius, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(premiumCardVariants({ variant, size, radius }), className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
PremiumCard.displayName = "PremiumCard"

const PremiumCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-2", className)}
    {...props}
  />
))
PremiumCardHeader.displayName = "PremiumCardHeader"

const PremiumCardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-tight tracking-tight text-gray-900",
      className
    )}
    {...props}
  />
))
PremiumCardTitle.displayName = "PremiumCardTitle"

const PremiumCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-gray-600 leading-relaxed", className)}
    {...props}
  />
))
PremiumCardDescription.displayName = "PremiumCardDescription"

const PremiumCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("", className)} {...props} />
))
PremiumCardContent.displayName = "PremiumCardContent"

export { 
  PremiumCard, 
  PremiumCardHeader, 
  PremiumCardTitle, 
  PremiumCardDescription, 
  PremiumCardContent,
  premiumCardVariants 
}
