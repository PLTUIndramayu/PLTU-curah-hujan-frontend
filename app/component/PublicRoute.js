'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PublicRoute({ children }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.replace('/dashboard'); 
    } else {
      setLoading(false);
    }
  }, [router]);

  return loading ? null : <>{children}</>;
}
