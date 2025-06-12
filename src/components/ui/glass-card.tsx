import * as React from "react"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const glassCardVariants = cva(
    "relative overflow-hidden border shadow-sm backdrop-blur-sm transition-all duration-300",
    {
        variants: {
            variant: {
                default: "bg-white/98 border-gray-200/60 shadow-md",
                muted: "bg-white/95 border-gray-200/50 shadow-sm",
                accent: "bg-white/99 border-gray-200/70 shadow-lg",
                gold: "bg-white/98 border-amber-200/60 shadow-md",
                premium:
                    "bg-white/99 border-gray-200/80 shadow-xl backdrop-blur-md",
                subtle: "bg-white/96 border-white/70 shadow-sm",
                // Nouveaux variants solides
                solid: "bg-white border-gray-200 shadow-lg",
                "solid-warm":
                    "bg-gradient-to-br from-white to-amber-50/30 border-amber-200/70 shadow-lg",
                "solid-blue":
                    "bg-gradient-to-br from-white to-blue-50/40 border-blue-200/70 shadow-lg",
                "african-card":
                    "bg-gradient-to-br from-white via-amber-50/20 to-white border-amber-200/50 shadow-xl",
                "mobile-menu": "bg-white border-marineBlue-100 shadow-2xl",
            },
            size: {
                default: "p-6",
                sm: "p-4",
                lg: "p-8",
                xl: "p-10",
            },
            radius: {
                default: "rounded-xl",
                sm: "rounded-lg",
                lg: "rounded-2xl",
                xl: "rounded-3xl",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
            radius: "default",
        },
    }
)

export interface GlassCardProps
    extends React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof glassCardVariants> {
    withPattern?: boolean
    withHover?: boolean
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
    (
        {
            className,
            variant,
            size,
            radius,
            withPattern = false,
            withHover = true,
            children,
            ...props
        },
        ref
    ) => {
        const isAfricanVariant =
            variant?.includes("african") || variant?.includes("warm")

        return (
            <div
                ref={ref}
                className={cn(
                    glassCardVariants({ variant, size, radius }),
                    withHover && "hover:shadow-xl hover:-translate-y-1",
                    className
                )}
                {...props}
            >
                {withPattern && (
                    <>
                        {isAfricanVariant ? (
                            <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_2px_2px,_rgba(251,191,36,0.3)_1px,_transparent_0)] bg-[length:20px_20px] pointer-events-none" />
                        ) : (
                            <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(circle_at_1px_1px,_rgba(0,0,0,0.15)_1px,_transparent_0)] bg-[length:20px_20px] pointer-events-none" />
                        )}
                    </>
                )}

                {/* Micro-éléments décoratifs pour les variants africains */}
                {isAfricanVariant && (
                    <div className="absolute top-4 right-4 w-2 h-2 bg-amber-200/40 rounded-full opacity-60" />
                )}

                <div className="relative z-10">{children}</div>
            </div>
        )
    }
)
GlassCard.displayName = "GlassCard"

export { GlassCard, glassCardVariants }
