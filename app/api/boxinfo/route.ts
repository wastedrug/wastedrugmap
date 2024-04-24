import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export  async function GET(
  request : Request
) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  if(request.method === 'GET') {
    const {data, error} = await supabase.from('boxInfo').select('*');

    if(error){
      return NextResponse.json({error: '데이터를 불러오지 못했습니다'}, {status : 500});

    }
    return NextResponse.json({data},{status: 200});
  }
}




