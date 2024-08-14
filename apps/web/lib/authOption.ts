import CredentialsProvider from "next-auth/providers/credentials";
import * as bcrypt from "bcryptjs";
import { prismaClient } from "@repo/db";
import { AuthOptions } from "next-auth";
const VERCEL_DEPLOYMENT = !!process.env.VERCEL_URL;

export const authOption: AuthOptions = {
  cookies: {
    sessionToken: {
      name: `${VERCEL_DEPLOYMENT ? "__Secure-" : ""}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        // When working on localhost, the cookie domain must be omitted entirely (https://stackoverflow.com/a/1188145)
        domain: VERCEL_DEPLOYMENT
          ? `.${process.env.NEXT_PUBLIC_APP_DOMAIN}`
          : undefined,
        secure: VERCEL_DEPLOYMENT,
      },
    },
  },
  session: {
    strategy: "jwt",
    maxAge: parseInt(process.env.JWT_EXPIRE_IN_HR!, 10) * 60 * 60,
  },
  pages: {
    error: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any) {
        const email = credentials?.email;
        let password = credentials?.password;

        if (!email || !password) return null;

        try {
          const user = await prismaClient.user.findFirst({
            where: { email, emailVerified: { not: null } },
          });

          if (user && (await bcrypt.compare(password, user.password))) {
            return {
              email,
              id: user.id as string,
              username: user.username,
              role: "USER",
            };
          } else return null;
        } catch (err) {
          return null;
        }
      },
    }),
  ],

  callbacks: {
    jwt: async (jwtProps) => {
      // console.log("jwtProps: ", jwtProps);

      let { account, token, user, profile, session, trigger } = jwtProps;

      if (user?.id) token.id = user.id;
      if (user?.username) token.username = user.username;
      if (user?.role) token.role = user.role;
      if (!session) session = { ok: 1 };

      // token and session as null -> in case of CredentialProvider

      return token;
    },
    async session(sessionProps) {
      // console.log("sessionProps: ", sessionProps);
      const { session, token, user, newSession, trigger } = sessionProps;

      // token and session -> in case of CredentialProvider
      // token if strategry is jwt, and user if strategy is database
      //

      // Send properties to the client, like an access_token from a provider.
      session.user = session.user ?? {};

      session.user.id = token?.id! as string;
      session.user.username = token?.username! as string;
      // @ts-ignore
      session.user.role = token?.role;

      return session;
    },
  },
};
