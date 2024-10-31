import NextAuth, { CredentialsSignin } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "./utilities/db";
import { User } from "./models/User";
import { compare, hash } from "bcryptjs";

export const auth = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 2 * 60 * 60,
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "jb@gmail.com" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        console.log(credentials);
        try {
          const email = credentials.email;
          const password = credentials.password;

          if (!email || !password) {
            throw new CredentialsSignin("Please provide both email & password");
          }

          await connectDB();

          const user = await User.findOne({ email }).select(
            "+password +role +name +email"
          );

          if (!user) {
            throw new Error("Invalid email or password");
          }

          if (!user.password) {
            throw new Error("Invalid email or password");
          }

          const isMatched = await compare(password, user.password);

          if (!isMatched) {
            throw new Error("Password did not matched");
          }

          const userData = {
            name: user.name,
            email: user.email,
            role: user.role,
          };

          return userData;
        } catch (error) {
          throw new Error(error);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.sub && token?.role) {
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.role = token.role;
      }
      return session;
    },
  },
};
