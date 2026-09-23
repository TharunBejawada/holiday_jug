import NextAuth from "next-auth";
import { NextRequest } from "next/server";
import { getAuthOptions } from "@/lib/auth";

// authOptions is built fresh per request (not once at module load) so its
// secret/adapter always see the current process.env — see the comment on
// getAuthOptions for why that matters on Amplify's compute. NextAuth's App
// Router overload (req, context, options) exists exactly for this.
async function handler(req: NextRequest, ctx: { params: Promise<{ nextauth: string[] }> }) {
  const options = await getAuthOptions();
  return NextAuth(req, ctx, options);
}

export { handler as GET, handler as POST };
