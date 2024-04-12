import { createClient } from '@supabase/supabase-js';

export default async function Notes() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  await supabase.auth.getUser();
  const session = supabase.auth.getSession();
  console.log('session', session);

  const { data: notes, error } = await supabase.from('notes').select('*');

  console.log('notes', notes);

  return <pre>{JSON.stringify(notes, null, 2)}</pre>;
}
