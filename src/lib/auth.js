import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Admin Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
        const adminPassword = process.env.ADMIN_PASSWORD?.trim();
        const submittedEmail = credentials?.email?.trim().toLowerCase();
        const submittedPassword = credentials?.password?.trim();

        if (!adminEmail || !adminPassword) {
          console.error("Admin auth is missing ADMIN_EMAIL or ADMIN_PASSWORD.");
          return null;
        }

        const isValidAdmin =
          submittedEmail === adminEmail &&
          submittedPassword === adminPassword;

        if (!isValidAdmin) {
          console.warn("Invalid admin login attempt:", {
            email: submittedEmail || "missing-email",
            emailMatched: submittedEmail === adminEmail,
            passwordMatched: submittedPassword === adminPassword,
          });
          return null;
        }

        return {
          id: "admin",
          name: "Admin",
          email: adminEmail,
          role: "admin",
        };
      },
    }),
  ],
  pages: {
    signIn: "/admin",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
      }

      return session;
    },
  },
};
