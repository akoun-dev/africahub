
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface QuoteNotificationRequest {
  quoteRequest: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    country: string;
    city?: string;
    insurance_type: string;
    specific_data: any;
  };
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { quoteRequest }: QuoteNotificationRequest = await req.json();
    console.log("Processing quote notification for:", quoteRequest.id);

    const insuranceTypeText = {
      auto: 'Assurance Auto',
      home: 'Assurance Habitation',
      health: 'Assurance Santé',
      micro: 'Micro-assurance'
    }[quoteRequest.insurance_type] || quoteRequest.insurance_type;

    // Send confirmation email to client
    const clientEmailResponse = await resend.emails.send({
      from: "AssurCompare <noreply@assurcompare.com>",
      to: [quoteRequest.email],
      subject: `Confirmation de votre demande de devis - ${insuranceTypeText}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
          <div style="background: linear-gradient(135deg, #2E8B57, #32CD32); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">AssurCompare</h1>
            <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Votre partenaire assurance en Afrique</p>
          </div>
          
          <div style="padding: 30px; background: white;">
            <h2 style="color: #2E8B57; margin-bottom: 20px;">Bonjour ${quoteRequest.first_name} ${quoteRequest.last_name},</h2>
            
            <p style="font-size: 16px; line-height: 1.6; color: #333;">
              Nous avons bien reçu votre demande de devis pour une <strong>${insuranceTypeText}</strong>.
            </p>
            
            <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #2E8B57;">
              <h3 style="margin: 0 0 15px 0; color: #2E8B57; font-size: 18px;">📋 Récapitulatif de votre demande</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #555;">Type d'assurance:</td>
                  <td style="padding: 8px 0; color: #333;">${insuranceTypeText}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #555;">Pays:</td>
                  <td style="padding: 8px 0; color: #333;">${quoteRequest.country}</td>
                </tr>
                ${quoteRequest.city ? `
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #555;">Ville:</td>
                  <td style="padding: 8px 0; color: #333;">${quoteRequest.city}</td>
                </tr>
                ` : ''}
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #555;">Numéro de demande:</td>
                  <td style="padding: 8px 0; color: #333;">#${quoteRequest.id.substring(0, 8).toUpperCase()}</td>
                </tr>
              </table>
            </div>
            
            <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 25px 0;">
              <h3 style="margin: 0 0 15px 0; color: #2E8B57;">🚀 Prochaines étapes</h3>
              <ol style="margin: 0; padding-left: 20px; color: #333;">
                <li style="margin-bottom: 8px;">Notre équipe d'experts analyse votre profil</li>
                <li style="margin-bottom: 8px;">Nous préparons votre devis personnalisé</li>
                <li style="margin-bottom: 8px;">Vous recevrez votre devis sous <strong>24 heures</strong> par email</li>
              </ol>
            </div>
            
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; border-radius: 8px; margin: 25px 0;">
              <h3 style="margin: 0 0 15px 0; color: #856404;">💡 Le saviez-vous ?</h3>
              <p style="margin: 0; color: #856404;">
                AssurCompare compare plus de 50 offres d'assurance pour vous garantir le meilleur rapport qualité-prix adapté au marché africain.
              </p>
            </div>
            
            <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px;">
              <h3 style="color: #2E8B57; margin-bottom: 15px;">📞 Besoin d'aide ?</h3>
              <p style="margin-bottom: 15px; color: #333;">Notre équipe est à votre disposition :</p>
              <div style="background: #f8f9fa; padding: 15px; border-radius: 6px;">
                <p style="margin: 5px 0; color: #333;">📧 <strong>Email:</strong> support@assurcompare.com</p>
                <p style="margin: 5px 0; color: #333;">📞 <strong>Téléphone:</strong> +225 XX XX XX XX</p>
                <p style="margin: 5px 0; color: #333;">🕒 <strong>Horaires:</strong> Lundi - Vendredi, 8h - 18h</p>
              </div>
            </div>
            
            <div style="background: linear-gradient(135deg, #2E8B57, #32CD32); color: white; padding: 20px; border-radius: 8px; text-align: center; margin: 30px 0;">
              <h3 style="margin: 0 0 10px 0;">🙏 Merci de votre confiance !</h3>
              <p style="margin: 0; font-size: 14px;">
                Ensemble, protégeons votre avenir avec les meilleures solutions d'assurance.
              </p>
            </div>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; text-align: center; color: #666; border-radius: 0 0 8px 8px;">
            <p style="margin: 0; font-size: 12px;">
              Cet email a été envoyé par AssurCompare suite à votre demande de devis.<br>
              © 2024 AssurCompare - Tous droits réservés
            </p>
          </div>
        </div>
      `,
    });

    console.log("Client email sent:", clientEmailResponse.data?.id);

    // Send internal notification email
    const internalEmailResponse = await resend.emails.send({
      from: "AssurCompare System <system@assurcompare.com>",
      to: ["admin@assurcompare.com"],
      subject: `🔔 Nouvelle demande de devis - ${insuranceTypeText} - ${quoteRequest.country}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto;">
          <div style="background: #1a202c; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
            <h2 style="margin: 0; color: #4fd1c7;">🚨 Nouvelle demande de devis reçue</h2>
            <p style="margin: 10px 0 0 0; color: #a0aec0;">
              Demande reçue le ${new Date().toLocaleString('fr-FR')}
            </p>
          </div>
          
          <div style="background: white; padding: 25px; border: 1px solid #e2e8f0;">
            <div style="display: grid; gap: 20px;">
              <div style="background: #f7fafc; padding: 20px; border-radius: 8px; border-left: 4px solid #4fd1c7;">
                <h3 style="margin: 0 0 15px 0; color: #2d3748;">👤 Informations client</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #4a5568; width: 150px;">Nom complet:</td>
                    <td style="padding: 8px 0; color: #2d3748;">${quoteRequest.first_name} ${quoteRequest.last_name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #4a5568;">Email:</td>
                    <td style="padding: 8px 0; color: #2d3748;">
                      <a href="mailto:${quoteRequest.email}" style="color: #4299e1; text-decoration: none;">
                        ${quoteRequest.email}
                      </a>
                    </td>
                  </tr>
                  ${quoteRequest.phone ? `
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #4a5568;">Téléphone:</td>
                    <td style="padding: 8px 0; color: #2d3748;">
                      <a href="tel:${quoteRequest.phone}" style="color: #4299e1; text-decoration: none;">
                        ${quoteRequest.phone}
                      </a>
                    </td>
                  </tr>
                  ` : ''}
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #4a5568;">Localisation:</td>
                    <td style="padding: 8px 0; color: #2d3748;">${quoteRequest.country}${quoteRequest.city ? `, ${quoteRequest.city}` : ''}</td>
                  </tr>
                </table>
              </div>

              <div style="background: #fff5f5; padding: 20px; border-radius: 8px; border-left: 4px solid #f56565;">
                <h3 style="margin: 0 0 15px 0; color: #2d3748;">🛡️ Détails de l'assurance</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #4a5568; width: 150px;">Type:</td>
                    <td style="padding: 8px 0; color: #2d3748; font-weight: bold;">${insuranceTypeText}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #4a5568;">ID de demande:</td>
                    <td style="padding: 8px 0; color: #2d3748; font-family: monospace; background: #f7fafc; padding: 4px 8px; border-radius: 4px;">
                      ${quoteRequest.id}
                    </td>
                  </tr>
                </table>
              </div>

              ${Object.keys(quoteRequest.specific_data || {}).length > 0 ? `
              <div style="background: #f0fff4; padding: 20px; border-radius: 8px; border-left: 4px solid #48bb78;">
                <h3 style="margin: 0 0 15px 0; color: #2d3748;">📋 Données spécifiques</h3>
                <div style="background: #white; padding: 15px; border-radius: 6px; border: 1px solid #e2e8f0;">
                  <pre style="margin: 0; font-size: 13px; line-height: 1.5; color: #2d3748; overflow-x: auto; white-space: pre-wrap;">
${JSON.stringify(quoteRequest.specific_data, null, 2)}
                  </pre>
                </div>
              </div>
              ` : ''}
            </div>
          </div>
          
          <div style="background: #4299e1; color: white; padding: 20px; text-align: center; border-radius: 0 0 8px 8px;">
            <h3 style="margin: 0 0 10px 0;">⚡ Action requise</h3>
            <p style="margin: 0; font-size: 16px;">
              <strong>Préparer le devis dans les 24 heures</strong>
            </p>
            <p style="margin: 10px 0 0 0; font-size: 14px; opacity: 0.9;">
              Accédez au <a href="https://assurcompare.com/admin" style="color: white; text-decoration: underline;">tableau de bord admin</a> pour traiter cette demande
            </p>
          </div>
        </div>
      `,
    });

    console.log("Internal email sent:", internalEmailResponse.data?.id);

    // Create notification in database
    const { error: notificationError } = await supabase
      .from('notifications')
      .insert({
        type: 'quote_request',
        title: `Nouvelle demande ${insuranceTypeText}`,
        message: `${quoteRequest.first_name} ${quoteRequest.last_name} a demandé un devis pour ${insuranceTypeText}`,
        data: {
          quote_request_id: quoteRequest.id,
          insurance_type: quoteRequest.insurance_type,
          customer_name: `${quoteRequest.first_name} ${quoteRequest.last_name}`,
          customer_email: quoteRequest.email,
          country: quoteRequest.country
        },
        is_read: false
      });

    if (notificationError) {
      console.error("Error creating notification:", notificationError);
    } else {
      console.log("Notification created successfully");
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        clientEmailId: clientEmailResponse.data?.id,
        internalEmailId: internalEmailResponse.data?.id,
        message: "Emails sent and notification created successfully"
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in send-quote-notification function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        stack: error.stack 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
