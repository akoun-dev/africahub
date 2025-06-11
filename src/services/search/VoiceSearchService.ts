
export interface VoiceSearchOptions {
  language: string;
  continuous: boolean;
  interimResults: boolean;
}

export interface VoiceSearchResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
}

export class VoiceSearchService {
  private recognition: any = null;
  private isSupported: boolean = false;

  constructor() {
    this.checkSupport();
    this.initializeRecognition();
  }

  private checkSupport(): void {
    this.isSupported = !!(
      (window as any).SpeechRecognition || 
      (window as any).webkitSpeechRecognition
    );
  }

  private initializeRecognition(): void {
    if (!this.isSupported) return;

    const SpeechRecognition = 
      (window as any).SpeechRecognition || 
      (window as any).webkitSpeechRecognition;

    this.recognition = new SpeechRecognition();
  }

  isVoiceSearchSupported(): boolean {
    return this.isSupported;
  }

  async startListening(
    options: Partial<VoiceSearchOptions> = {},
    onResult: (result: VoiceSearchResult) => void,
    onError: (error: string) => void
  ): Promise<void> {
    if (!this.isSupported || !this.recognition) {
      onError('La recherche vocale n\'est pas supportée sur ce navigateur');
      return;
    }

    // Configuration par défaut
    const config = {
      language: 'fr-FR',
      continuous: false,
      interimResults: true,
      ...options
    };

    this.recognition.lang = config.language;
    this.recognition.continuous = config.continuous;
    this.recognition.interimResults = config.interimResults;

    // Gestionnaires d'événements
    this.recognition.onresult = (event: any) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        onResult({
          transcript: result[0].transcript,
          confidence: result[0].confidence,
          isFinal: result.isFinal
        });
      }
    };

    this.recognition.onerror = (event: any) => {
      onError(`Erreur de reconnaissance vocale: ${event.error}`);
    };

    this.recognition.onend = () => {
      // La reconnaissance s'est arrêtée
    };

    try {
      this.recognition.start();
    } catch (error) {
      onError('Impossible de démarrer la reconnaissance vocale');
    }
  }

  stopListening(): void {
    if (this.recognition) {
      this.recognition.stop();
    }
  }

  // Méthodes utilitaires pour différentes langues
  static getSupportedLanguages(): Array<{ code: string; name: string }> {
    return [
      { code: 'fr-FR', name: 'Français (France)' },
      { code: 'en-US', name: 'English (US)' },
      { code: 'ar-SA', name: 'العربية' },
      { code: 'pt-BR', name: 'Português (Brasil)' },
      { code: 'sw-KE', name: 'Kiswahili' }
    ];
  }

  // Nettoyage et normalisation du texte vocal
  static normalizeVoiceInput(transcript: string): string {
    return transcript
      .toLowerCase()
      .trim()
      // Remplacer les chiffres écrits par des chiffres
      .replace(/un/g, '1')
      .replace(/deux/g, '2')
      .replace(/trois/g, '3')
      .replace(/quatre/g, '4')
      .replace(/cinq/g, '5')
      // Correction de fautes courantes
      .replace(/assurance/g, 'assurance')
      .replace(/téléphone/g, 'smartphone')
      .replace(/ordinateur/g, 'ordinateur');
  }
}
