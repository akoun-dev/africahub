/**
 * Page de confirmation d'inscription
 * Gère la confirmation d'email et redirige vers le dashboard
 */

import React, { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/contexts/AuthContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"
import { toast } from "sonner"

const AuthConfirm: React.FC = () => {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const { user, loading: authLoading } = useAuth()
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
    const [message, setMessage] = useState('')

    useEffect(() => {
        const handleEmailConfirmation = async () => {
            try {
                // Récupérer les paramètres de l'URL
                const token = searchParams.get('token')
                const type = searchParams.get('type')
                const accessToken = searchParams.get('access_token')
                const refreshToken = searchParams.get('refresh_token')

                console.log('🔍 Paramètres de confirmation:', { token, type, accessToken: !!accessToken, refreshToken: !!refreshToken })

                if (type === 'signup' && token) {
                    // Confirmer l'email avec le token
                    const { data, error } = await supabase.auth.verifyOtp({
                        token_hash: token,
                        type: 'email'
                    })

                    if (error) {
                        console.error('❌ Erreur de confirmation:', error)
                        setStatus('error')
                        setMessage('Erreur lors de la confirmation de votre email. Le lien a peut-être expiré.')
                        return
                    }

                    console.log('✅ Email confirmé avec succès:', data)
                    setStatus('success')
                    setMessage('Votre email a été confirmé avec succès ! Redirection en cours...')
                    
                    // Rediriger vers le dashboard après 2 secondes
                    setTimeout(() => {
                        navigate('/user/dashboard', { replace: true })
                    }, 2000)

                } else if (accessToken && refreshToken) {
                    // Connexion directe avec les tokens
                    const { data, error } = await supabase.auth.setSession({
                        access_token: accessToken,
                        refresh_token: refreshToken
                    })

                    if (error) {
                        console.error('❌ Erreur de session:', error)
                        setStatus('error')
                        setMessage('Erreur lors de la connexion automatique.')
                        return
                    }

                    console.log('✅ Session établie:', data)
                    setStatus('success')
                    setMessage('Connexion réussie ! Redirection en cours...')
                    
                    setTimeout(() => {
                        navigate('/user/dashboard', { replace: true })
                    }, 2000)

                } else {
                    // Aucun paramètre de confirmation trouvé
                    console.log('ℹ️ Aucun paramètre de confirmation, vérification de l\'utilisateur actuel')
                    
                    if (user) {
                        setStatus('success')
                        setMessage('Vous êtes déjà connecté ! Redirection en cours...')
                        setTimeout(() => {
                            navigate('/user/dashboard', { replace: true })
                        }, 1000)
                    } else {
                        setStatus('error')
                        setMessage('Aucune confirmation en attente. Vous pouvez vous connecter normalement.')
                    }
                }

            } catch (error) {
                console.error('💥 Erreur inattendue:', error)
                setStatus('error')
                setMessage('Une erreur inattendue s\'est produite.')
            }
        }

        // Attendre que l'auth soit chargé
        if (!authLoading) {
            handleEmailConfirmation()
        }
    }, [searchParams, navigate, user, authLoading])

    const handleReturnToAuth = () => {
        navigate('/auth', { replace: true })
    }

    const handleGoToDashboard = () => {
        navigate('/user/dashboard', { replace: true })
    }

    if (authLoading || status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <CardTitle className="flex items-center justify-center gap-2">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Confirmation en cours...
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                        <p className="text-gray-600">
                            Veuillez patienter pendant que nous confirmons votre inscription.
                        </p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="flex items-center justify-center gap-2">
                        {status === 'success' ? (
                            <>
                                <CheckCircle className="h-5 w-5 text-green-500" />
                                Confirmation réussie
                            </>
                        ) : (
                            <>
                                <XCircle className="h-5 w-5 text-red-500" />
                                Erreur de confirmation
                            </>
                        )}
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                    <p className={`${status === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                        {message}
                    </p>
                    
                    <div className="flex gap-2 justify-center">
                        {status === 'error' && (
                            <Button onClick={handleReturnToAuth} variant="outline">
                                Retour à la connexion
                            </Button>
                        )}
                        
                        {user && (
                            <Button onClick={handleGoToDashboard}>
                                Aller au dashboard
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default AuthConfirm
