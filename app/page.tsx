'use client';

import { supabase } from '@/lib/supabaseClient';

export default function Home() {
  const login = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'http://localhost:3000/dashboard',
      },
    });

    if (error) {
      alert(error.message);
    }
  };

  return (
    <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <button onClick={login}>Sign in with Google</button>
    </div>
  );
}
