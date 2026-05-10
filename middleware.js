import { withAuth } from "next-auth/middleware";

export default withAuth({
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    authorized: ({ token }) => {
      const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
      const tokenEmail = token?.email?.trim().toLowerCase();

      return token?.role === "admin" || tokenEmail === adminEmail;
    },
  },
  pages: {
    signIn: "/admin",
  },
});

export const config = {
  matcher: ["/dashboard/:path*"],
};
