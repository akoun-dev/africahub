#!/bin/bash

# Script pour mettre à jour toutes les couleurs marineBlue vers la couleur personnalisée #2D4A6B

echo "🎨 Mise à jour des couleurs vers #2D4A6B..."

# Liste des fichiers à mettre à jour
files=(
    "src/pages/Banque.tsx"
    "src/pages/Commerce.tsx" 
    "src/pages/Education.tsx"
    "src/pages/Transport.tsx"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "📝 Mise à jour de $file..."
        
        # Remplacer les couleurs marineBlue par la couleur personnalisée
        sed -i 's/border-l-marineBlue-500/border-l-4" style={{borderLeftColor: "#2D4A6B"}}/g' "$file"
        sed -i 's/bg-marineBlue-100/bg-slate-100" style={{backgroundColor: "#2D4A6B20"}}/g' "$file"
        sed -i 's/text-marineBlue-600/text-slate-600" style={{color: "#2D4A6B"}}/g' "$file"
        sed -i 's/text-marineBlue-500/text-slate-500" style={{color: "#2D4A6B"}}/g' "$file"
        sed -i 's/bg-marineBlue-50/bg-slate-50" style={{backgroundColor: "#2D4A6B10"}}/g' "$file"
        sed -i 's/text-green-500/text-slate-500" style={{color: "#2D4A6B"}}/g' "$file"
        
        echo "✅ $file mis à jour"
    else
        echo "❌ $file non trouvé"
    fi
done

echo "🎉 Mise à jour terminée !"
