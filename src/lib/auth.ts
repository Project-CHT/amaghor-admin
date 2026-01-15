import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { authService } from "@/lib/services/auth.service";
import { authConfig } from "./auth.config";

export const { auth, handlers, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Authenticate against Go server API
          const response = await authService.login({
            email: credentials.email as string,
            password: credentials.password as string
          });

          if (!response.success || !response.data) {
            console.log(`Authentication failed: ${response.error?.message || 'Unknown error'}`);
            return null;
          }

          const { user, accessToken, refreshToken } = response.data;

          if (!user) {
            console.log('Authentication failed: No user data in response');
            return null;
          }

          // Extract role name if it's an object (backend returns object sometimes)
          const roleName = typeof user.role === 'object' && user.role !== null
            ? (user.role as any).name
            : user.role;

          console.log(`[Auth] User: ${user.email}, Role: ${roleName}`);

          // Check for admin role access
          // Ensure we strictly block non-admins
          const allowedRoles = ['admin', 'super_admin', 'manager'];
          if (!allowedRoles.includes(roleName)) {
            console.log(`Access denied for user: ${user.email} with role: ${roleName}`);
            // Return null to prevent login
            return null;
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: roleName,
            image: user.image,
            accessToken,
            refreshToken
          };
        } catch (error) {
          console.error('Authentication error:', error);
          return null;
        }
      }
    })
  ],
});
