import { createClient } from '@supabase/supabase-js';

export default async function getBoxInfo() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  await supabase.auth.getUser();
  const session = supabase.auth.getSession();

  const { data: boxInfo, error } = await supabase.from('boxInfo').select('*');
  return <pre>{JSON.stringify(boxInfo, null, 2)}</pre>;
}
