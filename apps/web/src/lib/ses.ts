import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";

// No explicit access keys here on purpose: in production the Amplify compute
// role is granted ses:SendEmail directly (see docs/DEPLOYMENT.md), so the SDK
// picks up credentials from the environment automatically. Locally, the AWS
// CLI's default profile / env vars are used the same way.
const ses = new SESv2Client({ region: process.env.SES_REGION ?? "eu-west-2" });

export async function sendOtpEmail(toEmail: string, code: string) {
  const from = process.env.SES_FROM_EMAIL;
  if (!from) {
    throw new Error("SES_FROM_EMAIL is not set — cannot send verification emails.");
  }

  await ses.send(
    new SendEmailCommand({
      FromEmailAddress: from,
      Destination: { ToAddresses: [toEmail] },
      Content: {
        Simple: {
          Subject: { Data: `${code} is your Holiday Jug verification code` },
          Body: {
            Html: {
              Data: `
                <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
                  <h2 style="color: #0b7d75;">Verify your email</h2>
                  <p>Enter this code to finish creating your Holiday Jug account. It expires in 10 minutes.</p>
                  <p style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #0a3d3a; margin: 24px 0;">
                    ${code}
                  </p>
                  <p style="color:#666;font-size:13px;">If you didn't request this, you can safely ignore this email.</p>
                </div>
              `,
            },
            Text: {
              Data: `Your Holiday Jug verification code is: ${code}\n\nIt expires in 10 minutes. If you didn't request this, you can ignore this email.`,
            },
          },
        },
      },
    })
  );
}
