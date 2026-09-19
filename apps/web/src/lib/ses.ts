import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";

// No explicit access keys here on purpose: in production the Amplify compute
// role is granted ses:SendEmail directly (see docs/DEPLOYMENT.md), so the SDK
// picks up credentials from the environment automatically. Locally, the AWS
// CLI's default profile / env vars are used the same way.
const ses = new SESv2Client({ region: process.env.SES_REGION ?? "eu-west-2" });

export async function sendVerificationEmail(toEmail: string, signInUrl: string) {
  const from = process.env.SES_FROM_EMAIL;
  if (!from) {
    throw new Error("SES_FROM_EMAIL is not set — cannot send sign-in emails.");
  }

  await ses.send(
    new SendEmailCommand({
      FromEmailAddress: from,
      Destination: { ToAddresses: [toEmail] },
      Content: {
        Simple: {
          Subject: { Data: "Sign in to Holiday Jug" },
          Body: {
            Html: {
              Data: `
                <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
                  <h2 style="color: #0b7d75;">Sign in to Holiday Jug</h2>
                  <p>Click the button below to sign in. This link expires in 15 minutes and can only be used once.</p>
                  <p>
                    <a href="${signInUrl}"
                       style="display:inline-block;background:#0b7d75;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:bold;">
                      Sign in
                    </a>
                  </p>
                  <p style="color:#666;font-size:13px;">If you didn't request this, you can safely ignore this email.</p>
                </div>
              `,
            },
            Text: {
              Data: `Sign in to Holiday Jug: ${signInUrl}\n\nThis link expires in 15 minutes and can only be used once. If you didn't request this, you can ignore this email.`,
            },
          },
        },
      },
    })
  );
}
