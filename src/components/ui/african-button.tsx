import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const africanButtonVariants = cva(
    "relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 overflow-hidden shadow-md hover:shadow-lg",
    {
        variants: {
            variant: {
                default: "bg-marineBlue-600 text-white hover:bg-marineBlue-700",
                gold: "bg-brandSky text-white hover:bg-brandSky-dark",
                red: "bg-marineBlue-800 text-white hover:bg-marineBlue-900",
                outline:
                    "border-2 border-marineBlue-600 bg-white text-marineBlue-600 hover:bg-marineBlue-50",
                ghost: "bg-gray-50 text-marineBlue-600 hover:bg-gray-100 border border-gray-200",
                link: "text-marineBlue-600 underline-offset-4 hover:underline bg-transparent shadow-none",
                rainbow:
                    "bg-gradient-to-r from-marineBlue-600 via-brandSky to-marineBlue-400 text-white hover:brightness-110",
            },
            size: {
                default: "h-10 px-4 py-2",
                sm: "h-9 rounded-md px-3",
                lg: "h-11 rounded-md px-8",
                icon: "h-10 w-10",
            },
            withPattern: {
                true: "after:content-[''] after:absolute after:inset-0 after:bg-diagonal-lines after:opacity-10 after:pointer-events-none",
                false: "",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
            withPattern: false,
        },
    }
)

export interface AfricanButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof africanButtonVariants> {
    asChild?: boolean
}

const AfricanButton = React.forwardRef<HTMLButtonElement, AfricanButtonProps>(
    (
        { className, variant, size, withPattern, asChild = false, ...props },
        ref
    ) => {
        const Comp = asChild ? Slot : "button"
        return (
            <Comp
                className={cn(
                    africanButtonVariants({
                        variant,
                        size,
                        withPattern,
                        className,
                    })
                )}
                ref={ref}
                {...props}
            />
        )
    }
)
AfricanButton.displayName = "AfricanButton"

export { AfricanButton, africanButtonVariants }
