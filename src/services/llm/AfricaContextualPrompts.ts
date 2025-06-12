
interface CountryInfo {
  country: string;
  region: string;
  primary_language: string;
  insurance_context: any;
}

interface ContextualPrompt {
  systemPrompt: string;
  culturalContext: string;
  insuranceSpecifics: string;
  regulatoryNotes: string;
}

export class AfricaContextualPrompts {
  static generatePrompt(countryInfo: CountryInfo, requestType: string): ContextualPrompt {
    return {
      systemPrompt: `You are an AI assistant specialized in insurance for ${countryInfo.country}.`,
      culturalContext: `Operating in ${countryInfo.region} Africa context`,
      insuranceSpecifics: `Focus on ${requestType} insurance products`,
      regulatoryNotes: `Follow ${countryInfo.country} insurance regulations`
    };
  }
}
