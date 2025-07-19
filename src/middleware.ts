import { withAuth } from "next-auth/middleware";

export default withAuth(() => {}, {
  pages: { signIn: "/login" },
  callbacks: {
    authorized: ({ token }) => !!token?.sub,
  },
});

export const config = {
  matcher: [
    "/create-debate/:path*",
    "/debate/:path*",
    "/people/:path*",
    "/profile/:path*",
    "/scoreboard/:path*",
  ],
};
