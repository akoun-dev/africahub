import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { ChevronDown, Globe } from "lucide-react"
import AfricaMap from "./AfricaMap"
import { Country, getAfricanCountryByCode } from "@/components/CountrySelector"

interface InteractiveCountrySelectorProps {
    onSelect: (country: Country) => void
    selectedCountry?: Country
}

export const InteractiveCountrySelector: React.FC<
    InteractiveCountrySelectorProps
> = ({ onSelect, selectedCountry }) => {
    const [isOpen, setIsOpen] = useState(false)

    const handleCountryClick = (countryCode: string) => {
        console.log("Map country clicked:", countryCode)
        const country = getAfricanCountryByCode(countryCode)
        if (country) {
            onSelect(country)
            setIsOpen(false)
        }
    }

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 w-full border-marineBlue-600 text-marineBlue-600 hover:bg-marineBlue-600 hover:text-white"
                >
                    <Globe className="h-4 w-4" />
                    <span className="text-sm">Carte interactive</span>
                    <ChevronDown className="h-4 w-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="p-0 w-[400px] z-50 bg-white border border-marineBlue-100 shadow-xl"
                align="end"
            >
                <div className="p-4">
                    <h3 className="font-semibold text-sm mb-3 text-marineBlue-600">
                        Sélectionnez votre pays
                    </h3>
                    <AfricaMap
                        height="250px"
                        onCountryClick={handleCountryClick}
                        selectedCountry={selectedCountry?.code}
                        showCountryLabels={true}
                        className="border rounded-md"
                    />
                    <p className="text-xs text-marineBlue-600/70 mt-2 text-center">
                        Cliquez sur votre pays sur la carte ci-dessus
                    </p>
                </div>
            </PopoverContent>
        </Popover>
    )
}
