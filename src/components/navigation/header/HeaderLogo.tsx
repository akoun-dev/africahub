import React from "react"
import { Link } from "react-router-dom"
import { Globe } from "lucide-react"

export const HeaderLogo: React.FC = () => {
    return (
        <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-brandBlue p-2 shadow-lg group-hover:shadow-xl transition-shadow">
                <Globe className="w-full h-full text-white" />
            </div>
            <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-afroGreen via-afroGold to-afroRed bg-clip-text text-transparent">
                    AfricaHub
                </h1>
                <p className="text-xs text-gray-600">Comparateur africain</p>
            </div>
        </Link>
    )
}
