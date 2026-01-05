import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

declare module "next-auth" {
  interface Session {
    accessToken: string;
  }
  interface JWT {
    accessToken: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "openid email profile https://www.googleapis.com/auth/youtube",
        },
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, account, user }) {
      if (account && user) {
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
        token.accessToken = account.access_token;
      }

      return token;
    },
    async session({ session, token }) {
      session.user!.email = token.email as string;
      session.user!.name = token.name as string;
      session.user!.image = token.picture as string;
      session.accessToken = token.accessToken as string;

      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
