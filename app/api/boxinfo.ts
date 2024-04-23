import { NextApiRequest, NextApiResponse } from "next";

const BoxInfoApi = async (req:NextApiRequest, res:NextApiResponse) => {
  if (req.method === "GET") {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
  
    const { data: boxInfo, error } = await supabase.from("boxInfo").select("*");
    if (error) {
      return res.status(500).json({ error: error.message });

    }
    return res.status(200).json({ boxInfo });
  }
};

export default BoxInfoApi;