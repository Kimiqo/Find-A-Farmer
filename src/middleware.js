import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ req, token }) => {
      const pathname = req.nextUrl.pathname;

      if (pathname.startsWith("/farmer/dashboard")) {
        return token?.role === "farmer-admin";
      }
      if (pathname.startsWith("/admin/dashboard")) {
        return token?.role === "admin-admin";
      }
      return !!token; // Require login for other protected routes
    },
  },
});

export const config = {
  matcher: ["/farmer/dashboard/:path*", "/admin/dashboard/:path*", "/cart", "/checkout"],
};