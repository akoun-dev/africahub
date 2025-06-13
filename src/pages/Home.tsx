import React from "react"
import SimplifiedHome from "./SimplifiedHome"
import { TestProfileCreation } from "@/components/TestProfileCreation"

// Use SimplifiedHome as the main home page
const Home = () => {
    return (
        <div>
            <TestProfileCreation />
            <SimplifiedHome />
        </div>
    )
}

export default Home
