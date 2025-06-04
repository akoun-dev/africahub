
import * as React from "react"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const sectionBackgroundVariants = cva(
  "relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-br from-white/60 via-blue-50/30 to-slate-50/20",
        accent: "bg-gradient-to-b from-white/70 via-blue-50/25 to-slate-50/15",
        muted: "bg-gradient-to-br from-blue-50/30 via-slate-50/20 to-gray-50/25",
        hero: "bg-gradient-to-b from-white/80 via-blue-50/20 via-slate-50/15 to-white/70",
        premium: "bg-gradient-to-br from-white/95 via-blue-50/60 to-slate-50/40",
        subtle: "bg-gradient-to-br from-white/75 via-blue-50/20 to-slate-50/15",
        blue: "bg-gradient-to-br from-white/85 via-brandBlue/[0.12] via-blue-50/60 to-brandSky/[0.08] relative",
        "blue-warm": "bg-gradient-to-r from-white/85 via-brandBlue/[0.15] via-blue-50/55 to-brandIndigo/[0.10]",
        "blue-cool": "bg-gradient-to-br from-white/80 via-brandNavy/[0.08] via-slate-100/50 to-brandCyan/[0.12]",
        // Nouveaux variants solides avec motifs africains
        solid: "bg-gradient-to-br from-white via-blue-50/80 to-slate-50/60",
        "solid-warm": "bg-gradient-to-r from-white via-amber-50/70 to-orange-50/50",
        "african-pattern": "bg-gradient-to-br from-white via-amber-50/60 to-slate-50/40",
        "geometric": "bg-gradient-to-br from-white/95 via-blue-50/70 to-indigo-50/50",
      },
      withPattern: {
        true: "",
        false: "",
      },
      withDecorations: {
        true: "",
        false: "",
      }
    },
    defaultVariants: {
      variant: "default",
      withPattern: false,
      withDecorations: false,
    },
  }
)

export interface SectionBackgroundProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sectionBackgroundVariants> {}

const SectionBackground = React.forwardRef<HTMLDivElement, SectionBackgroundProps>(
  ({ className, variant, withPattern, withDecorations, children, ...props }, ref) => {
    const isBlueVariant = variant?.includes('blue')
    const isSolidVariant = variant?.includes('solid') || variant?.includes('african') || variant?.includes('geometric')

    return (
      <div
        ref={ref}
        className={cn(sectionBackgroundVariants({ variant, withPattern, withDecorations }), className)}
        {...props}
      >
        {/* Décorations géométriques africaines modernes et visibles */}
        {withDecorations && (
          <>
            {isSolidVariant ? (
              <>
                {/* Formes géométriques africaines inspirées des motifs Adinkra */}
                <div className="absolute -left-20 top-1/6 h-80 w-80 rounded-full bg-gradient-to-br from-amber-100/40 to-orange-100/30 blur-2xl" />
                <div className="absolute -right-20 bottom-1/6 h-80 w-80 rounded-full bg-gradient-to-br from-blue-100/40 to-indigo-100/30 blur-2xl" />
                
                {/* Motifs géométriques africains modernes */}
                <div className="absolute top-1/4 left-1/6 h-32 w-32 opacity-[0.15]">
                  <div className="h-full w-full border-4 border-amber-200 rounded-lg rotate-12 shadow-sm" />
                </div>
                <div className="absolute bottom-1/3 right-1/5 h-24 w-24 opacity-[0.12]">
                  <div className="h-full w-full border-3 border-blue-200 rounded-full shadow-sm" />
                </div>
                <div className="absolute top-1/2 right-1/4 h-20 w-20 opacity-[0.10]">
                  <div className="h-full w-full bg-gradient-to-br from-amber-200/50 to-orange-200/50 rounded-lg rotate-45 shadow-sm" />
                </div>
                
                {/* Lignes géométriques inspirées du tissage Kente */}
                <div className="absolute top-1/3 left-1/3 h-40 w-1 bg-gradient-to-b from-amber-200/30 to-transparent rounded-full" />
                <div className="absolute bottom-1/4 right-1/3 h-1 w-32 bg-gradient-to-r from-blue-200/30 to-transparent rounded-full" />
              </>
            ) : isBlueVariant ? (
              <>
                {/* Formes géométriques modernes - plus prononcées */}
                <div className="absolute -left-32 top-1/6 h-96 w-96 rounded-full bg-brandBlue/[0.035] blur-3xl" />
                <div className="absolute -right-32 bottom-1/6 h-96 w-96 rounded-full bg-brandNavy/[0.035] blur-3xl" />
                <div className="absolute top-1/4 left-1/4 h-32 w-32 rotate-45 bg-brandSky/[0.03] blur-2xl" />
                <div className="absolute bottom-1/3 right-1/3 h-40 w-40 rounded-full bg-brandIndigo/[0.032] blur-2xl" />
                
                {/* Éléments géométriques modernes plus visibles */}
                <div className="absolute top-1/2 left-1/6 h-20 w-20 opacity-[0.06]">
                  <div className="h-full w-full border-2 border-brandBlue rounded-lg rotate-12" />
                </div>
                <div className="absolute bottom-1/4 right-1/5 h-16 w-16 opacity-[0.08]">
                  <div className="h-full w-full border-2 border-brandSky rounded-full" />
                </div>
              </>
            ) : (
              <>
                <div className="absolute -left-32 top-1/4 h-80 w-80 rounded-full bg-blue-100/40 blur-3xl" />
                <div className="absolute -right-32 bottom-1/4 h-80 w-80 rounded-full bg-slate-50/60 blur-3xl" />
                <div className="absolute top-1/3 left-1/3 h-40 w-40 rounded-full bg-blue-50/50 blur-2xl" />
              </>
            )}
          </>
        )}
        
        {/* Motifs géométriques plus visibles et définis */}
        {withPattern && (
          <div className="absolute inset-0">
            {isSolidVariant ? (
              <>
                {/* Motif africain moderne inspiré des textiles traditionnels */}
                <div className="h-full w-full opacity-[0.08] bg-[radial-gradient(circle_at_4px_4px,_rgba(251,191,36,0.4)_2px,_transparent_0)] bg-[length:32px_32px]" />
                {/* Lignes géométriques inspirées du Kente */}
                <div className="absolute inset-0 opacity-[0.06]">
                  <div className="h-full w-full bg-[linear-gradient(45deg,_transparent_15px,_rgba(59,130,246,0.3)_16px,_rgba(59,130,246,0.3)_17px,_transparent_18px)] bg-[length:64px_64px]" />
                </div>
                {/* Motif en diagonale moderne */}
                <div className="absolute inset-0 opacity-[0.04]">
                  <div className="h-full w-full bg-[linear-gradient(135deg,_transparent_8px,_rgba(251,191,36,0.25)_9px,_rgba(251,191,36,0.25)_10px,_transparent_11px)] bg-[length:48px_48px]" />
                </div>
              </>
            ) : isBlueVariant ? (
              <>
                {/* Motif moderne plus prononcé */}
                <div className="h-full w-full opacity-[0.035] bg-[radial-gradient(circle_at_2px_2px,_rgba(30,58,138,0.4)_1px,_transparent_0)] bg-[length:48px_48px]" />
                {/* Lignes géométriques modernes plus visibles */}
                <div className="absolute inset-0 opacity-[0.025]">
                  <div className="h-full w-full bg-[linear-gradient(45deg,_transparent_24px,_rgba(59,130,246,0.5)_25px,_rgba(59,130,246,0.5)_26px,_transparent_27px)] bg-[length:96px_96px]" />
                </div>
              </>
            ) : (
              <div className="h-full w-full opacity-[0.05] bg-[radial-gradient(circle_at_1px_1px,_rgba(59,130,246,0.35)_1px,_transparent_0)] bg-[length:24px_24px]" />
            )}
          </div>
        )}
        
        {/* Content avec z-index approprié */}
        <div className="relative z-10">
          {children}
        </div>
      </div>
    )
  }
)
SectionBackground.displayName = "SectionBackground"

export { SectionBackground, sectionBackgroundVariants }
