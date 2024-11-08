import { supabase } from "./supabase";

export async function getAllCustomizationOptions() {
  const { data: customization_options, error } = await supabase
    .from("customization_options")
    .select("*");

  if (error) {
    throw new Error("Error fetching customization options " + error.message);
  }

  return customization_options;
}
