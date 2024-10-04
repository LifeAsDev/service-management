import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/schemas/user";
import { compare } from "bcrypt";
import { JWT } from "next-auth/jwt";

const handler = NextAuth({
  callbacks: {
    async signIn({ user, account }) {
      return true;
    },

    async jwt({ token }) {
      try {
        const fetchUrl = `${process.env.NEXTAUTH_URL}/api/user/${token.sub}`;
        const res = await fetch(fetchUrl, {
          method: "GET",
          headers: { "Content-type": "application/json" },
        });
        if (res.ok) {
          const resData = await res.json();
          token = { ...token, ...resData.user };
        }
      } catch (error) {
        console.log(error);
      }
      return token;
    },

    async session({ session, user, token }) {
      session = { ...session, ...token };

      return session;
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        password: {
          label: "Password",
          type: "password",
        },
        email: {
          label: "Email",
          type: "text",
        },
        username: { label: "Username", type: "text" },
      },

      async authorize(credentials) {
        await connectMongoDB();
        const user = await User.findOne({
          username: credentials?.username,
        });

        if (!user) {
          throw new Error("Wrong credentials"); // Lanzar error si la contraseña es incorrecta
        }

        // Comparar la contraseña ingresada con la contraseña almacenada usando bcrypt
        const isPasswordValid = await compare(
          credentials?.password || "",
          user.password
        );

        if (isPasswordValid) {
          console.log({ user });
          return { id: user.id }; // Si la contraseña es válida, retorna el ID del usuario
        } else {
          console.log("Invalid Password");
          throw new Error("Wrong credentials"); // Lanzar error si la contraseña es incorrecta
        }
      },
    }),
  ],

  pages: {
    signIn: "/login",
    error: "/login",
  },

  session: {
    maxAge: 30 * 60 * 60,
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: 30 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
