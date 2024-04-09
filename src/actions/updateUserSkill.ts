"use server";

import { supabaseServerClient } from "@/utils/supabaseServer";

const updateSkill = async (userId: string, skill: string) => {
  const supabase = await supabaseServerClient();
  const { data: formResponse, error: formError } = await supabase.rpc(
    "add_skill",
    {
      user_id: userId,
      new_skill: skill,
    }
  );

  return [formResponse, formError];
};

export { updateSkill };
