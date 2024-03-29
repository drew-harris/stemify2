import NextAuth from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { getPrismaPool } from "../../../server_helpers/prismaPool";

const prisma = getPrismaPool();

export default NextAuth({
  // Configure one or more authentication providers
  secret: process.env.NEXT_AUTH_SECRET,
  strategy: "jwt",
  adapter: PrismaAdapter(prisma),
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
    }),
  ],
  updateAge: 96 * 60 * 60, // 96 hours
  callbacks: {
    async session({ session, user }) {
      session.user.level = user.level;
      session.user.id = user.id;
      return session;
    },
  },
});
