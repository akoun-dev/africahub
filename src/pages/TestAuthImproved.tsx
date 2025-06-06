import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import AuthImproved from './AuthImproved';
import { EnhancedAuthProvider } from '@/contexts/EnhancedAuthContext';

/**
 * Page de test pour le nouveau formulaire d'authentification
 * Permet de tester l'inscription des utilisateurs et marchands avec tous les secteurs
 */
const TestAuthImproved: React.FC = () => {
  return (
    <Router>
      <EnhancedAuthProvider>
        <div className="min-h-screen">
          <Routes>
            <Route path="/" element={<AuthImproved />} />
            <Route path="/auth" element={<AuthImproved />} />
            
            {/* Pages de redirection après inscription */}
            <Route path="/user/dashboard" element={
              <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    🎉 Compte Utilisateur Créé !
                  </h1>
                  <p className="text-gray-600 mb-4">
                    Bienvenue sur AfricaHub ! Votre compte utilisateur a été créé avec succès.
                  </p>
                  <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded">
                    <p><strong>Type :</strong> Utilisateur</p>
                    <p><strong>Statut :</strong> Actif</p>
                    <p><strong>Accès :</strong> Comparaison de produits, avis, favoris</p>
                  </div>
                </div>
              </div>
            } />
            
            <Route path="/merchant/dashboard" element={
              <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100">
                <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
                  <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h2M7 7h10M7 11h10M7 15h10" />
                    </svg>
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    🏪 Compte Marchand Créé !
                  </h1>
                  <p className="text-gray-600 mb-4">
                    Votre compte marchand a été créé avec succès. Il est en cours de vérification.
                  </p>
                  <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded">
                    <p><strong>Type :</strong> Marchand</p>
                    <p><strong>Statut :</strong> En attente de vérification</p>
                    <p><strong>Prochaine étape :</strong> Vérification des documents</p>
                  </div>
                  <div className="mt-4 p-3 bg-blue-50 rounded text-sm text-blue-700">
                    <p><strong>📧 Email de confirmation envoyé</strong></p>
                    <p>Vérifiez votre boîte mail pour confirmer votre adresse email.</p>
                  </div>
                </div>
              </div>
            } />
          </Routes>
        </div>
        
        {/* Toast notifications */}
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#fff',
              color: '#2D4A6B',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '14px',
            },
          }}
        />
      </EnhancedAuthProvider>
    </Router>
  );
};

export default TestAuthImproved;
