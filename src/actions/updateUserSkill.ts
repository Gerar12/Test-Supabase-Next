"use server";

import { supabaseServerClient } from "@/utils/supabaseServer";

const updateSkill = async (userId: string, skill: string): Promise<void> => {
  const supabase = await supabaseServerClient();
  const {} = await supabase.rpc("add_skill", {});
};

export { updateSkill };
