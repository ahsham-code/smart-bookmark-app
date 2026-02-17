'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [bookmarks, setBookmarks] = useState<any[]>([]);

  // ✅ wait for client mount (fix hydration)
  useEffect(() => {
  setMounted(true);
  loadBookmarks();

  const channel = supabase
    .channel('bookmarks-changes')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'bookmarks' },
      () => {
        loadBookmarks();
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, []);


  const loadBookmarks = async () => {
    const { data } = await supabase
      .from('bookmarks')
      .select('*')
      .order('created_at', { ascending: false });

    setBookmarks(data || []);
  };

  const addBookmark = async () => {
    if (!title || !url) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    await supabase.from('bookmarks').insert({
      title,
      url,
      user_id: user.id,
    });

    setTitle('');
    setUrl('');
    loadBookmarks();
  };

  // ⛔ prevent server/client mismatch
  if (!mounted) {
    return null;
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>My Bookmarks</h1>

      <div style={{ marginTop: 20 }}>
        <input
          placeholder="Bookmark title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ marginRight: 10 }}
        />

        <input
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{ marginRight: 10 }}
        />

        <button onClick={addBookmark}>Add</button>
      </div>

      <ul style={{ marginTop: 30 }}>
  {bookmarks.map((b) => (
    <li key={b.id} style={{ marginBottom: 10 }}>
      <a href={b.url} target="_blank" rel="noreferrer">
        {b.title}
      </a>

      <button
        style={{ marginLeft: 10 }}
        onClick={async () => {
          await supabase
            .from('bookmarks')
            .delete()
            .eq('id', b.id);
        }}
      >
        ❌
      </button>
    </li>
  ))}
</ul>

    </div>
  );
}
