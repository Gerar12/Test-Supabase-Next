"use server";

import { supabaseServerClient } from "@/utils/supabaseServer";

const registerWithEmailAndPasword = async ({ email }: { email: string }) => {
  const supabase = await supabaseServerClient();

  try {
    const response = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: "http://localhost:3000",
      },
    });

    return JSON.stringify(response);
  } catch (error) {
    console.log(error);
  }
};

export { registerWithEmailAndPasword };
