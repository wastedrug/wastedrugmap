import { createClient } from '@supabase/supabase-js';

export default async function Notes() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  await supabase.auth.getUser();
  const session = supabase.auth.getSession();

  const { data: notes, error } = await supabase.from('notes').select('*');

  return <pre>{JSON.stringify(notes, null, 2)}</pre>;
}
