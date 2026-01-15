import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.accessToken = token.accessToken as string;
        session.refreshToken = token.refreshToken as string;
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const staticFiles = ['/_next', '/api', '/static', '/favicon.ico'];
      const isStatic = staticFiles.some((path) => nextUrl.pathname.startsWith(path));

      // Allow static files
      if (isStatic) return true;

      // Login page logic
      if (nextUrl.pathname === '/login') {
        // If logged in, redirect to dashboard
        if (isLoggedIn) {
          return Response.redirect(new URL('/dashboard', nextUrl));
        }
        // If not logged in, allow access to login page
        return true;
      }

      // Protected routes (everything else)
      // Note: We can be more specific if we have public pages
      if (!isLoggedIn) {
        return false; // Redirect to login
      }

      return true;
    },
  },
  providers: [], // Configured in auth.ts
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
} satisfies NextAuthConfig;
