'use client';

import { supabase } from '@/lib/supabaseClient';

export default function Home() {
  const login = async () => {
    const redirectTo = `${window.location.origin}/dashboard`;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
      },
    });

    if (error) {
      alert(error.message);
    }
  };

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <button onClick={login}>Sign in with Google</button>
    </div>
  );
}
