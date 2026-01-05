import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { google } from "googleapis";
import { getServerSession } from "next-auth";

export async function getYoutubeSdkObject() {
  const session = await getServerSession(authOptions);

  if (!session) return null;

  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: session.accessToken });

  return google.youtube({ version: "v3", auth: oauth2Client });
}
