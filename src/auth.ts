import NextAuth, { AuthError, NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { JWT } from 'next-auth/jwt';

import apiServices from './services';
import { User as LoggedInUser } from './lib/types/user';

declare module 'next-auth' {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */

  interface JWT {
    access_token: string;
  }

  interface User {
    user: LoggedInUser;
    access_token: string;
    refresh_token: string;
  }

  interface Session {
    user: LoggedInUser;
    access_token: string;
  }
}

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT {
    id: string;
    access_token: string;
    refresh_token: string;
    user: LoggedInUser;
  }
}

export const authConfig = {
  providers: [
    Credentials({
      async authorize(credentials) {
        try {
          const params = {
            email: credentials.email,
            password: credentials.password,
          } as { email: string; password: string };
          const { data } = await apiServices.auth.signIn(params);

          return data;
        } catch (error: any) {
          throw new AuthError('Custom AuthError Error', {
            cause: { errorResponse: error?.data },
          });
        }
      },
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user }) {
      console.log('___jwt_callback')
      if (user) {
        token.id = user.id || '';
        token.access_token = user.access_token;
        token.refresh_token = user.refresh_token;
        token.user = user.user;
      }

      return token;
    },
    session({ session, token }) {
      if (token?.user) {
        (session.user as LoggedInUser) = token?.user;
      }

      if (token.access_token) {
        session.access_token = token.access_token;
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const privatePaths = ['/my-account'];
      const isPrivatePath = privatePaths.includes(nextUrl.pathname);

      if (!isLoggedIn && isPrivatePath)
        return Response.redirect(new URL('/', nextUrl));

      return true;
    },
  },
  debug: process.env.NODE_ENV !== 'production',
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
