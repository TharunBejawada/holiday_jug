import { SSMClient, GetParametersByPathCommand } from "@aws-sdk/client-ssm";

// AWS Amplify Hosting's SSR compute does not reliably pass Console-configured
// environment variables into the deployed runtime (confirmed empirically —
// process.env is empty of every custom var at request time, even though the
// same values are visible via the Amplify API). As a workaround, secrets are
// stored in SSM Parameter Store under /holidayjug/* and fetched here once per
// cold start, then written into process.env so the rest of the app can keep
// reading process.env.X exactly as it would locally.
let bootstrapped: Promise<void> | null = null;

async function loadFromSSM(): Promise<void> {
  if (process.env.DATABASE_URL) return; // already set locally, or Amplify starts working natively
  if (!process.env.AWS_LAMBDA_FUNCTION_NAME && !process.env.AWS_EXECUTION_ENV) return; // not running in Lambda-like compute

  const region = process.env.AWS_REGION ?? "eu-west-2";
  const client = new SSMClient({ region });

  let nextToken: string | undefined;
  do {
    const res = await client.send(
      new GetParametersByPathCommand({
        Path: "/holidayjug/",
        WithDecryption: true,
        NextToken: nextToken,
      })
    );
    for (const p of res.Parameters ?? []) {
      if (!p.Name || p.Value === undefined) continue;
      const key = p.Name.replace("/holidayjug/", "");
      if (process.env[key] === undefined) {
        process.env[key] = p.Value;
      }
    }
    nextToken = res.NextToken;
  } while (nextToken);
}

export function ensureEnvLoaded(): Promise<void> {
  if (!bootstrapped) {
    bootstrapped = loadFromSSM();
  }
  return bootstrapped;
}
