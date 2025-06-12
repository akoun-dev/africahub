import type { Config } from "tailwindcss"

export default {
    darkMode: ["class"],
    content: [
        "./pages/**/*.{ts,tsx}",
        "./components/**/*.{ts,tsx}",
        "./app/**/*.{ts,tsx}",
        "./src/**/*.{ts,tsx}",
    ],
    prefix: "",
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px",
            },
        },
        extend: {
            colors: {
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
                sidebar: {
                    DEFAULT: "hsl(var(--sidebar-background))",
                    foreground: "hsl(var(--sidebar-foreground))",
                    primary: "hsl(var(--sidebar-primary))",
                    "primary-foreground":
                        "hsl(var(--sidebar-primary-foreground))",
                    accent: "hsl(var(--sidebar-accent))",
                    "accent-foreground":
                        "hsl(var(--sidebar-accent-foreground))",
                    border: "hsl(var(--sidebar-border))",
                    ring: "hsl(var(--sidebar-ring))",
                },
                // Nouvelle palette bleu marine moderne
                marineBlue: {
                    50: "#f0f4f8",
                    100: "#d9e6f2",
                    200: "#b3cce5",
                    300: "#8db3d8",
                    400: "#6799cb",
                    500: "#4180be",
                    600: "#1e3a5f", // Couleur principale
                    700: "#1a3354",
                    800: "#162b49",
                    900: "#12243e",
                    950: "#0e1d33",
                },
                // Palette bleue moderne mise à jour
                brandBlue: {
                    light: "#f0f4f8",
                    DEFAULT: "#1e3a5f", // Nouvelle couleur principale
                    dark: "#12243e",
                },
                brandNavy: {
                    light: "#d9e6f2",
                    DEFAULT: "#1e3a5f", // Nouvelle couleur principale
                    dark: "#0e1d33",
                },
                brandSky: {
                    light: "#b3cce5",
                    DEFAULT: "#4180be", // Variante plus claire
                    dark: "#1a3354",
                },
                brandIndigo: {
                    light: "#f0f4f8",
                    DEFAULT: "#1e3a5f", // Nouvelle couleur principale
                    dark: "#12243e",
                },
                brandCyan: {
                    light: "#d9e6f2",
                    DEFAULT: "#6799cb", // Variante cyan
                    dark: "#1a3354",
                },
                // Couleurs de support
                brandGray: {
                    light: "#F8FAFC",
                    DEFAULT: "#64748B",
                    dark: "#334155",
                },
                // Couleurs africaines définies
                afroGreen: {
                    light: "#4ADE80",
                    DEFAULT: "#009639", // Vert du drapeau panafricain
                    dark: "#15803D",
                },
                afroGold: {
                    light: "#FDE047",
                    DEFAULT: "#FCD116", // Or du drapeau panafricain
                    dark: "#CA8A04",
                },
                afroRed: {
                    light: "#F87171",
                    DEFAULT: "#CE1126", // Rouge du drapeau panafricain
                    dark: "#991B1B",
                },
                afroBlack: {
                    light: "#374151",
                    DEFAULT: "#000000", // Noir du drapeau panafricain
                    dark: "#000000",
                },
                // Couleurs pour l'assurance et secteurs spécialisés
                insurPurple: {
                    light: "#f0f4f8",
                    DEFAULT: "#1e3a5f", // Nouvelle couleur marine
                    dark: "#12243e",
                },
                insurBlue: {
                    light: "#d9e6f2",
                    DEFAULT: "#1e3a5f", // Nouvelle couleur marine
                    dark: "#0e1d33",
                },
                insurGray: {
                    light: "#F5F7FA",
                    DEFAULT: "#8E9196",
                    dark: "#1A1F2C",
                },
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            keyframes: {
                "accordion-down": {
                    from: {
                        height: "0",
                    },
                    to: {
                        height: "var(--radix-accordion-content-height)",
                    },
                },
                "accordion-up": {
                    from: {
                        height: "var(--radix-accordion-content-height)",
                    },
                    to: {
                        height: "0",
                    },
                },
                "pulse-subtle": {
                    "0%, 100%": {
                        opacity: "1",
                    },
                    "50%": {
                        opacity: "0.8",
                    },
                },
                wave: {
                    "0%": { transform: "translateX(0)" },
                    "50%": { transform: "translateX(-5px)" },
                    "100%": { transform: "translateX(0)" },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
                "pulse-subtle": "pulse-subtle 2s ease-in-out infinite",
                wave: "wave 2s ease-in-out infinite",
            },
            backgroundImage: {
                "blue-pattern": "url('/patterns/blue-pattern.svg')",
                "geometric-pattern": "url('/patterns/geometric-pattern.svg')",
                "diagonal-lines":
                    "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(30, 111, 187, 0.05) 10px, rgba(30, 111, 187, 0.05) 20px)",
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
} satisfies Config
