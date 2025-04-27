import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        try {
          await client.connect();
          const db = client.db("farmers_app");
          const user = await db.collection("users").findOne({ email: credentials.email });

          if (!user) {
            throw new Error("No user found with this email");
          }

          if (user.role === "farmer-admin" && user.status === "pending") {
            throw new Error("Your farmer account is pending approval");
          }

          const isValid = await bcrypt.compare(credentials.password, user.password);
          if (!isValid) {
            throw new Error("Invalid password");
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
            farmerId: user.farmerId,
            phone: user.phone, // Added to match previous session needs
          };
        } catch (error) {
          console.error("Authorize error:", error.message, error.stack);
          throw new Error(error.message || "Authentication failed");
        } finally {
          await client.close();
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.farmerId = token.farmerId;
        session.user.phone = token.phone; // Added to match previous profile fix
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.farmerId = user.farmerId;
        token.phone = user.phone; // Added to match previous profile fix
      }
      return token;
    },
    async redirect({ user, url }) {
      if (user) {
        if (user.role === "farmer-admin") {
          return "/farmer/dashboard";
        } else if (user.role === "admin-admin") {
          return "/admin/dashboard";
        }
      }
      return "/"; // Default redirect
    },
  },
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true, // Enable debug logs for local testing
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };