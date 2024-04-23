import { createClient } from '@supabase/supabase-js';

export default async function useMapList() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const loadData = async () => {
    try {
      const { data, error } = await supabase.from('boxInfo').select('*');
      if (error) throw new Error();
      return data;
    } catch (err) {
      alert('데이터를 불러오지 못했습니다');
      return null;
    }
  };

  return loadData();
}
