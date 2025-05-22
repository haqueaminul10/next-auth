import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Home() {
  const { data: session, status } = useSession();
  console.log(`📌 ~ Home ~ session:`, session);

  const router = useRouter();

  if (status === 'loading') {
    return (
      <div className='flex justify-center items-center h-screen'>
        Loading...
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-100'>
      <nav className='bg-blue-600 text-white p-4'>
        <div className='container mx-auto flex justify-between items-center'>
          <Link href='/' className='text-xl font-bold'>
            MyApp
          </Link>
          <div>
            {session ? (
              <>
                <Link href='/dashboard' className='mr-4 hover:underline'>
                  Dashboard
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/login' })}
                  className='bg-red-500 px-4 py-2 rounded hover:bg-red-600'
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href='/login' className='mr-4 hover:underline'>
                  Login
                </Link>
                <Link href='/register' className='hover:underline'>
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
      <div className='container mx-auto mt-8 text-center'>
        <h1 className='text-3xl font-bold mb-4'>Welcome to MyApp</h1>
        <p className='text-lg'>
          {session?.user?.email
            ? `Hello, ${session.user.email}!`
            : session
            ? `Session loaded, but no email found. Session: ${JSON.stringify(
                session
              )}`
            : 'Please log in or register to access the dashboard.'}
        </p>
      </div>
    </div>
  );
}
