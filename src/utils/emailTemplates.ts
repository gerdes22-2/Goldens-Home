export interface AdoptionApplicationData {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  location: string;
  experienceLevel: string;
  hasOtherPets: boolean;
  petDetails?: string;
  hasYard: boolean;
  yardFenced: boolean;
  workSetup: string;
  genderPreference: string;
  colorPreference?: string[];
  notes?: string;
  submittedAt?: string;
}

/**
 * Generates a highly polished, responsive HTML email template for adoption application confirmations,
 * styled with the Golden Paws Home gold-and-navy branding palette.
 */
export function generateAdopterConfirmationHtml(appData: AdoptionApplicationData): string {
  const coatColors = appData.colorPreference && appData.colorPreference.length > 0 
    ? appData.colorPreference.join(', ') 
    : 'No Preference';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Application Received - Golden Paws Home</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f1eb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #0d2244;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f1eb; padding: 20px 0;">
    <tr>
      <td align="center">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);">
          
          <!-- BRAND HEADER -->
          <tr>
            <td align="center" style="background-color: #0d2244; padding: 35px 20px; border-bottom: 4px solid #d4af37;">
              <table border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding-bottom: 12px;">
                    <!-- Elegant Logo Graphic/Emblem -->
                    <div style="width: 64px; height: 64px; background-color: #d4af37; border-radius: 50%; display: inline-block; text-align: center; line-height: 64px; font-size: 32px; box-shadow: 0 4px 10px rgba(0,0,0,0.3);">
                      🐾
                    </div>
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <h1 style="color: #ffffff; font-family: 'Playfair Display', Georgia, serif; font-size: 26px; font-weight: bold; margin: 0; letter-spacing: 1px; text-transform: uppercase;">
                      Golden Paws Home
                    </h1>
                    <p style="color: #d4af37; font-size: 13px; font-weight: 600; letter-spacing: 2px; margin: 5px 0 0 0; text-transform: uppercase;">
                      Valley Ranch Golden Retrievers
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- WELCOME STATEMENT -->
          <tr>
            <td style="padding: 40px 30px 20px 30px;">
              <h2 style="font-size: 22px; font-weight: 800; color: #0d2244; margin-top: 0; margin-bottom: 16px; text-align: center;">
                Application Received!
              </h2>
              <p style="font-size: 16px; line-height: 1.6; color: #4a5568; margin-top: 0; text-align: center;">
                Dear <strong>${appData.fullName}</strong>,<br>
                Thank you for applying to adopt a premium Golden Retriever puppy from our ranch! We have safely received your application and put you on our candidate tracking system.
              </p>
              <div style="background-color: #fdfbf7; border-left: 4px solid #d4af37; padding: 15px; margin: 25px 0; border-radius: 0 8px 8px 0;">
                <p style="margin: 0; font-size: 14px; color: #0d2244; line-height: 1.5;">
                  <strong>Application Reference ID:</strong> <span style="font-family: monospace; font-size: 15px; font-weight: bold; color: #b45309;">${appData.id}</span><br>
                  <strong>Status:</strong> <span style="display: inline-block; background-color: #fef3c7; color: #b45309; padding: 2px 8px; border-radius: 9999px; font-size: 12px; font-weight: bold; margin-top: 4px;">Under Breeder Review</span>
                </p>
              </div>
            </td>
          </tr>

          <!-- APPLICATION SUMMARY CARD -->
          <tr>
            <td style="padding: 0 30px 20px 30px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
                
                <!-- Section 1 Header -->
                <tr>
                  <td style="background-color: #fcfaf7; padding: 12px 16px; border-bottom: 1px solid #e2e8f0;">
                    <h3 style="margin: 0; font-size: 15px; font-weight: bold; color: #0d2244; text-transform: uppercase; letter-spacing: 0.5px;">
                      👤 Applicant Profile
                    </h3>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 16px; background-color: #ffffff;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="font-size: 14px; line-height: 1.6;">
                      <tr>
                        <td width="35%" style="color: #718096; font-weight: 600; padding-bottom: 8px;">Full Name:</td>
                        <td width="65%" style="color: #0d2244; font-weight: bold; padding-bottom: 8px;">${appData.fullName}</td>
                      </tr>
                      <tr>
                        <td style="color: #718096; font-weight: 600; padding-bottom: 8px;">Email Address:</td>
                        <td style="color: #0d2244; padding-bottom: 8px;"><a href="mailto:${appData.email}" style="color: #d4af37; text-decoration: none; font-weight: bold;">${appData.email}</a></td>
                      </tr>
                      <tr>
                        <td style="color: #718096; font-weight: 600; padding-bottom: 8px;">Phone Number:</td>
                        <td style="color: #0d2244; padding-bottom: 8px;">${appData.phone}</td>
                      </tr>
                      <tr>
                        <td style="color: #718096; font-weight: 600;">Location:</td>
                        <td style="color: #0d2244;">${appData.location}</td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Section 2 Header -->
                <tr>
                  <td style="background-color: #fcfaf7; padding: 12px 16px; border-top: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0;">
                    <h3 style="margin: 0; font-size: 15px; font-weight: bold; color: #0d2244; text-transform: uppercase; letter-spacing: 0.5px;">
                      🏡 Home Setup & Experience
                    </h3>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 16px; background-color: #ffffff;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="font-size: 14px; line-height: 1.6;">
                      <tr>
                        <td width="35%" style="color: #718096; font-weight: 600; padding-bottom: 8px;">Experience:</td>
                        <td width="65%" style="color: #0d2244; padding-bottom: 8px;">${appData.experienceLevel}</td>
                      </tr>
                      <tr>
                        <td style="color: #718096; font-weight: 600; padding-bottom: 8px;">Other Pets:</td>
                        <td style="color: #0d2244; padding-bottom: 8px;">${appData.hasOtherPets ? `Yes (${appData.petDetails || 'Details not specified'})` : 'No other pets'}</td>
                      </tr>
                      <tr>
                        <td style="color: #718096; font-weight: 600; padding-bottom: 8px;">Fenced Yard:</td>
                        <td style="color: #0d2244; padding-bottom: 8px;">${appData.hasYard ? (appData.yardFenced ? 'Yes, fully fenced' : 'Yes, but not fenced') : 'No yard'}</td>
                      </tr>
                      <tr>
                        <td style="color: #718096; font-weight: 600;">Work Setup:</td>
                        <td style="color: #0d2244;">${appData.workSetup}</td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Section 3 Header -->
                <tr>
                  <td style="background-color: #fcfaf7; padding: 12px 16px; border-top: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0;">
                    <h3 style="margin: 0; font-size: 15px; font-weight: bold; color: #0d2244; text-transform: uppercase; letter-spacing: 0.5px;">
                      💖 Preferences & Notes
                    </h3>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 16px; background-color: #ffffff;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="font-size: 14px; line-height: 1.6;">
                      <tr>
                        <td width="35%" style="color: #718096; font-weight: 600; padding-bottom: 8px;">Gender:</td>
                        <td width="65%" style="color: #0d2244; padding-bottom: 8px;">${appData.genderPreference}</td>
                      </tr>
                      <tr>
                        <td style="color: #718096; font-weight: 600; padding-bottom: 12px;">Coat Colors:</td>
                        <td style="color: #0d2244; padding-bottom: 12px;">${coatColors}</td>
                      </tr>
                      <tr>
                        <td colspan="2" style="color: #718096; font-weight: 600; padding-bottom: 6px;">Additional Notes:</td>
                      </tr>
                      <tr>
                        <td colspan="2" style="background-color: #f8fafc; padding: 12px; border: 1px solid #e2e8f0; border-radius: 6px; font-style: italic; color: #4a5568; font-size: 13px;">
                          ${appData.notes || 'No additional notes provided.'}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- NEXT STEPS / VALUE PROPS -->
          <tr>
            <td style="padding: 10px 30px 40px 30px;">
              <h3 style="font-size: 16px; font-weight: bold; color: #0d2244; margin-top: 0; margin-bottom: 16px; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px;">
                🐾 Next Steps in Our Process
              </h3>
              
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="font-size: 14px; line-height: 1.5; color: #4a5568;">
                <tr>
                  <td valign="top" style="padding-right: 12px; padding-bottom: 15px; font-size: 18px; color: #d4af37;">✔️</td>
                  <td style="padding-bottom: 15px;">
                    <strong>Application Review:</strong> Director Ciara Wallen will personally review your answers to ensure an ideal placement setup (typically 24-48 hours).
                  </td>
                </tr>
                <tr>
                  <td valign="top" style="padding-right: 12px; padding-bottom: 15px; font-size: 18px; color: #d4af37;">✔️</td>
                  <td style="padding-bottom: 15px;">
                    <strong>Direct Connection:</strong> Once qualified, we will send an approval notification and invite you to schedule a call or arrange a ranch visit.
                  </td>
                </tr>
                <tr>
                  <td valign="top" style="padding-right: 12px; font-size: 18px; color: #d4af37;">✔️</td>
                  <td>
                    <strong>Secure Reservation:</strong> You will be invited to submit a reservation deposit to lock in your priority spot on the active waitlist.
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- FOOTER BLOCK -->
          <tr>
            <td style="background-color: #0d2244; color: #a0aec0; padding: 30px; border-top: 4px solid #d4af37; text-align: center; font-size: 12px; line-height: 1.6; border-radius: 0 0 16px 16px;">
              <p style="margin: 0; color: #ffffff; font-weight: bold; font-size: 14px;">
                Golden Paws Home
              </p>
              <p style="margin: 5px 0 15px 0; color: #d4af37;">
                Director: Ciara Wallen | Valley Ranch Family Breeders
              </p>
              <p style="margin: 10px 0;">
                If you have any questions or need immediate support, please contact us directly at <br>
                <a href="mailto:goldenpupshome22@gmail.com" style="color: #d4af37; text-decoration: none; font-weight: bold;">goldenpupshome22@gmail.com</a>
              </p>
              <p style="margin: 20px 0 0 0; font-size: 11px; border-top: 1px solid #1a365d; padding-top: 15px;">
                This is a secure automated transmission. You are receiving this email because you submitted an adoption application on the official Golden Paws Home platform.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

/**
 * Generates a highly polished, branded email template for broadcasting waitlist updates.
 */
export function generateWaitlistNotificationHtml(fullName: string, messageBody: string): string {
  // Replace line breaks with HTML paragraphs
  const formattedBody = messageBody
    .split('\n')
    .filter(p => p.trim().length > 0)
    .map(p => `<p style="font-size: 15px; line-height: 1.6; color: #4a5568; margin-bottom: 14px;">${p}</p>`)
    .join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Golden Paws Home - Waitlist Update</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f1eb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #0d2244;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f1eb; padding: 20px 0;">
    <tr>
      <td align="center">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);">
          
          <!-- BRAND HEADER -->
          <tr>
            <td align="center" style="background-color: #0d2244; padding: 35px 20px; border-bottom: 4px solid #d4af37;">
              <table border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding-bottom: 12px;">
                    <!-- Elegant Logo Graphic/Emblem -->
                    <div style="width: 64px; height: 64px; background-color: #d4af37; border-radius: 50%; display: inline-block; text-align: center; line-height: 64px; font-size: 32px; box-shadow: 0 4px 10px rgba(0,0,0,0.3);">
                      🐾
                    </div>
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <h1 style="color: #ffffff; font-family: 'Playfair Display', Georgia, serif; font-size: 26px; font-weight: bold; margin: 0; letter-spacing: 1px; text-transform: uppercase;">
                      Golden Paws Home
                    </h1>
                    <p style="color: #d4af37; font-size: 13px; font-weight: 600; letter-spacing: 2px; margin: 5px 0 0 0; text-transform: uppercase;">
                      Valley Ranch Golden Retrievers
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- MAIN CONTENT -->
          <tr>
            <td style="padding: 40px 30px 30px 30px;">
              <h2 style="font-size: 20px; font-weight: 800; color: #0d2244; margin-top: 0; margin-bottom: 20px; border-bottom: 1px solid #e2e8f0; padding-bottom: 12px;">
                Exclusive Waitlist Update 🐾
              </h2>
              <p style="font-size: 16px; line-height: 1.5; color: #0d2244; margin-top: 0; margin-bottom: 16px;">
                Hello <strong>${fullName}</strong>,
              </p>
              
              <div style="margin-bottom: 25px;">
                ${formattedBody}
              </div>

              <div style="background-color: #fdfbf7; border: 1px solid #f3ebe1; padding: 20px; border-radius: 12px; margin-top: 30px; text-align: center;">
                <p style="margin: 0 0 10px 0; font-size: 13px; color: #718096; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                  Want to verify your current priority ranking?
                </p>
                <p style="margin: 0 0 16px 0; font-size: 14px; color: #0d2244; line-height: 1.5;">
                  You can search your chronological status standing and matching litter profiles on our live Waitlist Portal.
                </p>
                <a href="#waitlist" style="display: inline-block; background-color: #0d2244; color: #ffffff; text-decoration: none; font-weight: bold; font-size: 13px; padding: 12px 24px; border-radius: 8px; border: 1px solid #d4af37; transition: all 0.2s;">
                  VIEW MASTER WAITLIST BOARD &rarr;
                </a>
              </div>
            </td>
          </tr>

          <!-- FOOTER BLOCK -->
          <tr>
            <td style="background-color: #0d2244; color: #a0aec0; padding: 30px; border-top: 4px solid #d4af37; text-align: center; font-size: 12px; line-height: 1.6; border-radius: 0 0 16px 16px;">
              <p style="margin: 0; color: #ffffff; font-weight: bold; font-size: 14px;">
                Golden Paws Home
              </p>
              <p style="margin: 5px 0 15px 0; color: #d4af37;">
                Director: Ciara Wallen | Valley Ranch Family Breeders
              </p>
              <p style="margin: 10px 0;">
                If you have any questions or need immediate support, please contact us directly at <br>
                <a href="mailto:goldenpupshome22@gmail.com" style="color: #d4af37; text-decoration: none; font-weight: bold;">goldenpupshome22@gmail.com</a>
              </p>
              <p style="margin: 20px 0 0 0; font-size: 11px; border-top: 1px solid #1a365d; padding-top: 15px;">
                This transmission is sent exclusively to candidates currently secured in the Golden Paws Home Adoption Waitlist. If you wish to be removed, please reply directly.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}
