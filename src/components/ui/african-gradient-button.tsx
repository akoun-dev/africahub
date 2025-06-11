import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const africanGradientButtonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 transform hover:scale-105 shadow-lg hover:shadow-xl",
    {
        variants: {
            variant: {
                default:
                    "bg-gradient-to-r from-marineBlue-600 to-brandSky text-white hover:from-marineBlue-700 hover:to-brandSky-dark",
                outline:
                    "border-2 border-marineBlue-600 bg-white text-marineBlue-600 hover:bg-marineBlue-600 hover:text-white shadow-md",
                ghost: "bg-white/95 text-marineBlue-600 hover:bg-marineBlue-600 hover:text-white border border-marineBlue-600/20",
                accent: "bg-gradient-to-r from-marineBlue-600 via-brandSky to-marineBlue-400 text-white hover:brightness-110",
                muted: "bg-white text-gray-700 border-2 border-gray-200 hover:bg-gray-50 hover:border-marineBlue-600/50",
                solid: "bg-marineBlue-600 text-white hover:bg-marineBlue-700 shadow-lg",
                "solid-gold":
                    "bg-brandSky text-white hover:bg-brandSky-dark shadow-lg",
            },
            size: {
                default: "h-11 px-6 py-3",
                sm: "h-9 px-4 py-2",
                lg: "h-12 px-8 py-4",
                icon: "h-11 w-11",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

export interface AfricanGradientButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof africanGradientButtonVariants> {
    asChild?: boolean
}

const AfricanGradientButton = React.forwardRef<
    HTMLButtonElement,
    AfricanGradientButtonProps
>(({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
        <Comp
            className={cn(
                africanGradientButtonVariants({ variant, size, className })
            )}
            ref={ref}
            {...props}
        />
    )
})
AfricanGradientButton.displayName = "AfricanGradientButton"

export { AfricanGradientButton, africanGradientButtonVariants }
