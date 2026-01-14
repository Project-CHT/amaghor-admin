import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import TwitterProvider from 'next-auth/providers/twitter';
import { authService } from '@/lib/services/auth.service';

// Helper function to check if required environment variables are set
const checkEnvironment = () => {
  const required = ['NEXTAUTH_SECRET'];
  const missing = required.filter(env => !process.env[env]);

  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  return missing.length === 0;
};

// Check environment on startup
checkEnvironment();

export const authOptions: NextAuthOptions = {
  // Use JWT strategy for session management
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // Use unique cookie names to prevent conflicts with other portals
  cookies: {
    sessionToken: {
      name: 'admin-next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
    callbackUrl: {
      name: 'admin-next-auth.callback-url',
      options: {
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
    csrfToken: {
      name: 'admin-next-auth.csrf-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },

  providers: [
    // Credentials Provider - authenticates against Go server
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            console.log('Missing email or password');
            return null;
          }

          // Authenticate against Go server API
          const response = await authService.login({
            email: credentials.email,
            password: credentials.password
          });

          console.log('Full login response:', JSON.stringify(response, null, 2));

          if (!response.success || !response.data) {
            console.log(`Authentication failed: ${response.error?.message || 'Unknown error'}`);
            return null;
          }

          const { user, accessToken, refreshToken } = response.data;

          if (!user) {
            console.log('Authentication failed: No user data in response');
            return null;
          }

          // Check for admin role access
          if (user.role !== 'admin' && user.role !== 'super_admin' && user.role !== 'manager') {
            console.log(`Access denied for user: ${user.email} with role: ${user.role}`);
            // return null; // Uncomment to strict role check
          }

          console.log(`Authentication successful for user: ${user.email} with role: ${user.role}`);

          // Return user with server tokens
          return {
            id: String(user.id), // Ensure ID is string
            email: user.email,
            name: user.name,
            image: user.image || null,
            role: user.role,
            accessToken: accessToken,
            refreshToken: refreshToken
          };
        } catch (error) {
          console.error('Authentication error:', error);
          return null;
        }
      }
    }),

    // Google Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),

    // Facebook Provider
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID || '',
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || '',
    }),

    // Twitter Provider
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID || '',
      clientSecret: process.env.TWITTER_CLIENT_SECRET || '',
      version: "2.0",
    }),
  ],

  callbacks: {
    async jwt({ token, user, account, trigger, session }) {
      try {
        // Initial sign in - store server tokens
        if (user) {
          token.id = user.id;
          token.role = user.role;
          token.email = user.email;
          token.name = user.name;
          token.picture = user.image;

          // Store Go server access token (from credentials login)
          if (user.accessToken) {
            token.accessToken = user.accessToken;
            token.refreshToken = user.refreshToken;
          }

          console.log(`JWT callback: Setting role ${user.role} for user ${user.email}`);
        }

        // Update session from client
        if (trigger === 'update' && session) {
          token = { ...token, ...session };
        }

        return token;
      } catch (error) {
        console.error('JWT callback error:', error);
        return token;
      }
    },

    async session({ session, token }) {
      try {
        if (token) {
          // Add custom fields to session
          session.user.id = token.id as string;
          session.user.role = token.role as string;
          session.user.email = token.email as string;
          session.user.name = token.name as string;
          session.user.image = token.picture as string;

          // Add server access token to session for API calls
          session.accessToken = token.accessToken as string;
          session.refreshToken = token.refreshToken as string;

          console.log(`Session callback: User ${session.user.email} has role ${session.user.role}`);
        }
        return session;
      } catch (error) {
        console.error('Session callback error:', error);
        return session;
      }
    },
  },

  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
  },

  secret: process.env.NEXTAUTH_SECRET,

  // Enable debug messages in development
  debug: process.env.NODE_ENV === 'development',
};
