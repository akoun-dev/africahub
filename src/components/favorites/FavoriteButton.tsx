/**
 * Composant bouton favori réutilisable
 * Permet d'ajouter/supprimer un produit des favoris avec animation
 */

import React from "react"
import { Heart, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useFavorites, AddFavoriteData } from "@/hooks/useFavorites"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "sonner"

interface FavoriteButtonProps {
    productId: string
    productData: AddFavoriteData
    variant?: "default" | "outline" | "ghost" | "icon"
    size?: "sm" | "md" | "lg"
    showText?: boolean
    className?: string
    onToggle?: (isFavorite: boolean) => void
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
    productId,
    productData,
    variant = "ghost",
    size = "md",
    showText = false,
    className,
    onToggle,
}) => {
    const { user } = useAuth()
    const {
        isFavorite,
        addFavorite,
        removeFavorite,
        isAddingFavorite,
        isRemovingFavorite,
    } = useFavorites()

    const isCurrentlyFavorite = isFavorite(productId)
    const isLoading = isAddingFavorite || isRemovingFavorite

    const handleToggleFavorite = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        if (!user) {
            toast.error("Connectez-vous pour ajouter des favoris")
            return
        }

        try {
            if (isCurrentlyFavorite) {
                await removeFavorite(productId)
                onToggle?.(false)
            } else {
                await addFavorite(productData)
                onToggle?.(true)
            }
        } catch (error) {
            console.error("Erreur lors de la gestion du favori:", error)
        }
    }

    const getButtonSize = () => {
        switch (size) {
            case "sm":
                return "h-8 w-8"
            case "lg":
                return "h-12 w-12"
            default:
                return "h-10 w-10"
        }
    }

    const getIconSize = () => {
        switch (size) {
            case "sm":
                return "h-4 w-4"
            case "lg":
                return "h-6 w-6"
            default:
                return "h-5 w-5"
        }
    }

    if (showText) {
        return (
            <Button
                variant={variant}
                size={size}
                onClick={handleToggleFavorite}
                disabled={isLoading}
                className={cn(
                    "transition-all duration-200",
                    isCurrentlyFavorite && "text-red-500 hover:text-red-600",
                    className
                )}
            >
                {isLoading ? (
                    <Loader2
                        className={cn(getIconSize(), "animate-spin mr-2")}
                    />
                ) : (
                    <Heart
                        className={cn(
                            getIconSize(),
                            "mr-2 transition-all duration-200",
                            isCurrentlyFavorite
                                ? "fill-current text-red-500"
                                : "text-gray-400"
                        )}
                    />
                )}
                {isCurrentlyFavorite
                    ? "Retirer des favoris"
                    : "Ajouter aux favoris"}
            </Button>
        )
    }

    return (
        <Button
            variant={variant}
            size="icon"
            onClick={handleToggleFavorite}
            disabled={isLoading}
            className={cn(
                getButtonSize(),
                "transition-all duration-200 hover:scale-110",
                isCurrentlyFavorite && "text-red-500 hover:text-red-600",
                className
            )}
            title={
                isCurrentlyFavorite
                    ? "Retirer des favoris"
                    : "Ajouter aux favoris"
            }
        >
            {isLoading ? (
                <Loader2 className={cn(getIconSize(), "animate-spin")} />
            ) : (
                <Heart
                    className={cn(
                        getIconSize(),
                        "transition-all duration-200",
                        isCurrentlyFavorite
                            ? "fill-current text-red-500 scale-110"
                            : "text-gray-400 hover:text-red-400"
                    )}
                />
            )}
        </Button>
    )
}

export default FavoriteButton
