import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ req, token }) => {
      const pathname = req.nextUrl.pathname;
      if (pathname === "/" && token?.role === "admin-admin") {
        return false; // Redirect to /admin/dashboard
      }
      if (pathname.startsWith("/farmer/dashboard")) {
        return token?.role === "farmer-admin";
      }
      if (pathname.startsWith("/admin/dashboard")) {
        return token?.role === "admin-admin";
      }
      if (pathname.startsWith("/cart") || pathname.startsWith("/checkout")) {
        return token?.role === "buyer";
      }
      return !!token;
    },
  },
  pages: {
    signIn: "/auth/signin",
    newUser: "/auth/signup",
    error: "/auth/error",
    redirect: ({ user }) => (user?.role === "admin-admin" ? "/admin/dashboard" : "/"),
  },
});

export const config = {
  matcher: ["/", "/farmer/dashboard/:path*", "/admin/dashboard/:path*", "/cart", "/checkout"],
};