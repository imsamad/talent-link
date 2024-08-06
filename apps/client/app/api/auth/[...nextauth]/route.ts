import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import * as bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prismaClient } from "@repo/db";

const handler = NextAuth({
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

        try {
          const user = await prismaClient.user.findFirst({ where: { email } });

          if (!user) return null;

          if (password && (await bcrypt.compare(password, user.password))) {
            const jwtToken = jwt.sign(
              { id: user.id },
              process.env.JWT_SECRET as string
            );

            return {
              email,
              id: user.id as string,
              username: user.username,
              jwtToken,
            };
          } else return null;
        } catch (err) {
          console.log("errerrerrerrerrerrerr: ", err);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    jwt: async (jwtProps) => {
      const { account, token, user, profile, session, trigger } = jwtProps;

      // @ts-ignore
      if (user?.jwtToken) token.jwtToken = user.jwtToken;
      if (user?.id) token.id = user.id;
      // @ts-ignore
      if (user?.username) token.username = user.username;

      // token and session as null -> in case of CredentialProvider

      return token;
    },
    async session(sessionProps: any) {
      const { session, token, user, newSession, trigger } = sessionProps;

      // token and session -> in case of CredentialProvider
      // token if strategry is jwt, and user if strategy is database
      //

      // Send properties to the client, like an access_token from a provider.
      session.user = session.user ?? {};

      session.user.jwtToken = token.jwtToken;
      session.user.id = token.id;
      session.user.username = token.username;

      return session;
    },
  },
});

export { handler as GET, handler as POST };
