import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]/route';

export default async function Home() {
  const session = await getServerSession(authOptions);
  
  // If user is authenticated, redirect to dashboard
  if (session) {
    redirect('/dashboard');
  }
  
  // If not authenticated, redirect to login
  redirect('/login');
}