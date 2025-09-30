import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/backend/mongodbClient";
import connectMongoDB from "@/backend/mongodb";
import User from "@/backend/user";
import sendTelegramNotification from "@/utils/sendTelegramNotification";

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  events: {
    /**
     * Fires once when a new user is created by NextAuth (first-time signup).
     */
    createUser: async ({ user }) => {
      try {
        const name = user?.name || "Unknown";
        const email = user?.email || "unknown";
        const provider = "google"; // Only Google configured currently
        const env = process.env.NODE_ENV || "unknown";

        const message = `🆕 NEW USER\n\n👤 Name: ${name}\n📧 Email: ${email}\n🔑 Provider: ${provider}\n🌎 Env: ${env}`;

        await sendTelegramNotification({
          message,
          // Use dedicated registration bot token if provided, else default
          botToken: process.env.TELEGRAM_BOT_TOKEN_REGISTRATION || process.env.TELEGRAM_BOT_TOKEN,
          chatId: process.env.TELEGRAM_CHAT_ID,
        });
      } catch (error) {
        console.error("Error sending Telegram signup notification:", error);
      }
    },
  },
  callbacks: {
    jwt: async ({ token, user, account }) => {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (session?.user) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.image = token.image;
      }
      return session;
    },
    signIn: async ({ user, account, profile }) => {
      if (account.provider === "google") {
        // Ensure user has required fields
        if (!user.email) {
          return false;
        }
        
        // You can add additional validation here if needed
        return true;
      }
      return false;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: process.env.NODE_ENV === "development",
};

export default NextAuth(authOptions);