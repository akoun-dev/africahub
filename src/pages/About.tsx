import React from "react"
import {
    AboutHero,
    AboutMission,
    AboutValues,
    AboutTimeline,
    AboutTeam,
    AboutImpact,
    AboutCTA,
} from "@/components/about"

/**
 * Page À propos - Utilise maintenant le PublicLayout via App.tsx
 * Le header et footer sont gérés automatiquement par le layout
 */
const About: React.FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-marineBlue-50/20 via-white to-brandSky/5">
            <main>
                <AboutHero />
                <AboutMission />
                <AboutValues />
                <AboutTimeline />
                <AboutTeam />
                <AboutImpact />
                <AboutCTA />
            </main>
        </div>
    )
}

export default About
