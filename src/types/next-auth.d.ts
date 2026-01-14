import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        accessToken?: string
        refreshToken?: string
        user: {
            id: string
            role: string
            email: string
            name: string
            image?: string | null
        } & DefaultSession["user"]
    }

    interface User {
        id: string
        role: string
        accessToken?: string
        refreshToken?: string
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id?: string
        role?: string
        accessToken?: string
        refreshToken?: string
        provider?: string
        providerAccountId?: string
    }
}
