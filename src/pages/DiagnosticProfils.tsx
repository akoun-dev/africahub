/**
 * Page de diagnostic pour les profils utilisateur
 * Permet de diagnostiquer et corriger les problèmes de création de profils
 */

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { AlertCircle, CheckCircle, Play, RefreshCw, Users, UserCheck } from 'lucide-react'
import { diagnoseProfils, creerProfilsManquants, testerInscription, DiagnosticResult } from '@/utils/diagnoseProfils'
import { useToast } from '@/hooks/use-toast'

const DiagnosticProfils: React.FC = () => {
    const [results, setResults] = useState<DiagnosticResult[]>([])
    const [loading, setLoading] = useState(false)
    const [activeTest, setActiveTest] = useState<string>('')
    const { toast } = useToast()

    const runDiagnostic = async () => {
        setLoading(true)
        setActiveTest('diagnostic')
        setResults([])

        try {
            const diagnosticResults = await diagnoseProfils()
            setResults(diagnosticResults)
            
            const hasErrors = diagnosticResults.some(r => !r.success)
            toast({
                title: hasErrors ? "Diagnostic terminé avec des erreurs" : "Diagnostic terminé avec succès",
                description: `${diagnosticResults.length} vérifications effectuées`,
                variant: hasErrors ? "destructive" : "default"
            })
        } catch (error) {
            toast({
                title: "Erreur lors du diagnostic",
                description: `Erreur inattendue: ${error}`,
                variant: "destructive"
            })
        } finally {
            setLoading(false)
            setActiveTest('')
        }
    }

    const createMissingProfiles = async () => {
        setLoading(true)
        setActiveTest('creation')
        setResults([])

        try {
            const creationResults = await creerProfilsManquants()
            setResults(creationResults)
            
            const hasErrors = creationResults.some(r => !r.success)
            toast({
                title: hasErrors ? "Création terminée avec des erreurs" : "Profils créés avec succès",
                description: `${creationResults.length} opérations effectuées`,
                variant: hasErrors ? "destructive" : "default"
            })
        } catch (error) {
            toast({
                title: "Erreur lors de la création",
                description: `Erreur inattendue: ${error}`,
                variant: "destructive"
            })
        } finally {
            setLoading(false)
            setActiveTest('')
        }
    }

    const testSignup = async () => {
        setLoading(true)
        setActiveTest('test')
        setResults([])

        try {
            const testResults = await testerInscription()
            setResults(testResults)
            
            const hasErrors = testResults.some(r => !r.success)
            toast({
                title: hasErrors ? "Test terminé avec des erreurs" : "Test d'inscription réussi",
                description: `${testResults.length} étapes testées`,
                variant: hasErrors ? "destructive" : "default"
            })
        } catch (error) {
            toast({
                title: "Erreur lors du test",
                description: `Erreur inattendue: ${error}`,
                variant: "destructive"
            })
        } finally {
            setLoading(false)
            setActiveTest('')
        }
    }

    const getStatusIcon = (success: boolean) => {
        return success ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
        ) : (
            <AlertCircle className="h-4 w-4 text-red-600" />
        )
    }

    const getStatusBadge = (success: boolean) => {
        return (
            <Badge variant={success ? "default" : "destructive"}>
                {success ? "Succès" : "Erreur"}
            </Badge>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6">
            <div className="max-w-6xl mx-auto">
                {/* En-tête */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Diagnostic des Profils Utilisateur
                    </h1>
                    <p className="text-gray-600">
                        Diagnostiquez et corrigez les problèmes de création de profils lors de l'inscription
                    </p>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Play className="h-5 w-5 text-blue-600" />
                                Diagnostic
                            </CardTitle>
                            <CardDescription>
                                Analyser l'état actuel des profils
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button 
                                onClick={runDiagnostic}
                                disabled={loading}
                                className="w-full"
                                variant={activeTest === 'diagnostic' ? "secondary" : "default"}
                            >
                                {loading && activeTest === 'diagnostic' && (
                                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Lancer le diagnostic
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Users className="h-5 w-5 text-green-600" />
                                Correction
                            </CardTitle>
                            <CardDescription>
                                Créer les profils manquants
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button 
                                onClick={createMissingProfiles}
                                disabled={loading}
                                className="w-full"
                                variant={activeTest === 'creation' ? "secondary" : "default"}
                            >
                                {loading && activeTest === 'creation' && (
                                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Créer les profils
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <UserCheck className="h-5 w-5 text-purple-600" />
                                Test
                            </CardTitle>
                            <CardDescription>
                                Tester l'inscription complète
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button 
                                onClick={testSignup}
                                disabled={loading}
                                className="w-full"
                                variant={activeTest === 'test' ? "secondary" : "default"}
                            >
                                {loading && activeTest === 'test' && (
                                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Tester inscription
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Résultats */}
                {results.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <AlertCircle className="h-5 w-5" />
                                Résultats du diagnostic
                            </CardTitle>
                            <CardDescription>
                                {results.filter(r => r.success).length} succès, {results.filter(r => !r.success).length} erreurs
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {results.map((result, index) => (
                                <div key={index} className="border rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            {getStatusIcon(result.success)}
                                            <span className="font-medium">{result.step}</span>
                                        </div>
                                        {getStatusBadge(result.success)}
                                    </div>
                                    
                                    <p className="text-sm text-gray-600 mb-2">
                                        {result.message}
                                    </p>

                                    {result.data && (
                                        <>
                                            <Separator className="my-2" />
                                            <details className="text-xs">
                                                <summary className="cursor-pointer text-gray-500 hover:text-gray-700">
                                                    Voir les détails
                                                </summary>
                                                <pre className="mt-2 p-2 bg-gray-50 rounded text-xs overflow-auto">
                                                    {JSON.stringify(result.data, null, 2)}
                                                </pre>
                                            </details>
                                        </>
                                    )}
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                )}

                {/* Instructions */}
                <Card className="mt-8">
                    <CardHeader>
                        <CardTitle>Instructions d'utilisation</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <h4 className="font-medium mb-2">1. Diagnostic</h4>
                            <p className="text-sm text-gray-600">
                                Lance une analyse complète pour identifier les utilisateurs sans profil et vérifier l'état des triggers.
                            </p>
                        </div>
                        
                        <div>
                            <h4 className="font-medium mb-2">2. Correction</h4>
                            <p className="text-sm text-gray-600">
                                Crée manuellement les profils manquants pour tous les utilisateurs existants.
                            </p>
                        </div>
                        
                        <div>
                            <h4 className="font-medium mb-2">3. Test</h4>
                            <p className="text-sm text-gray-600">
                                Effectue une inscription de test pour vérifier que les profils sont créés automatiquement.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default DiagnosticProfils
