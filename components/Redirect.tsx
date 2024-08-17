"use client";  
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Redirect = () => {
  const router = useRouter();

  useEffect(() => {
    const mn = localStorage.getItem("mn");
    if (mn !== null) {
      router.push("/dashboard");
    }
  }, [router]);

  return null;  
};

export default Redirect;
