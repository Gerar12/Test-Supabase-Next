import { supabaseServerClient } from "@/utils/supabaseServer";

const getUserImage = async (imagePath: string) => {
  const supabase = await supabaseServerClient();

  const {
    data: { publicUrl },
  } = supabase.storage.from("images").getPublicUrl(imagePath);

  return publicUrl;
};

export { getUserImage };
