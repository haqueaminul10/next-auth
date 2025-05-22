import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
const secret_key = 'klfndsknfdfnkdsflknsa';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'email', type: 'email' },
        password: { label: 'password', type: 'password' },
      },

      async authorize(credentials: any): Promise<any> {
        try {
          const response = await fetch('http://localhost:5000/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });
          if (!response.ok) {
            return null;
          }
          const user = await response.json();
          // user should have at least an email property
          if (!user || !user.email) {
            return null;
          }
          return user;
        } catch (err) {
          console.log(`📌 ~ authorize ~ err:`, err);
          return null;
        }
      },
    }),
  ],

  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.email = user.email as string;
        token.id = user.id;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.email = token.email as string;
        session.user.id = token.id as string;
        session.user.name = token.name;
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
  secret: secret_key,
};
export default NextAuth(authOptions);
