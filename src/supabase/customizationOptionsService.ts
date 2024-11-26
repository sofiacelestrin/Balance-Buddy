import { customizationOption } from "../pages/CustomizeBuddy";
import { supabase } from "./supabase";
import { Tables } from "./supabaseTypes";

export async function getAllCustomizationOptions() {
  const { data: customization_options, error } = await supabase
    .from("customization_options")
    .select("*");

  if (error) {
    throw new Error("Error fetching customization options " + error.message);
  }

  return customization_options;
}

export async function getCustomizationOptionsByCategory(category: string) {
  const { data: customization_options, error } = await supabase
    .from("customization_options")
    .select("*")
    .eq("category", category);

  if (error) {
    throw new Error(
      "Error fetching customization options by category " + error.message,
    );
  }

  return customization_options;
}
export async function getCustomizationOptionsByCategoryWithOwnership(
  userId: string,
  category: string,
): Promise<customizationOption[]> {
  const { data, error } = await supabase.rpc(
    "get_customization_options_by_category_with_ownership",
    {
      category_param: category,
      user_id_param: userId,
    },
  );

  if (error) {
    throw new Error(
      "Error fetching get_customization_options_by_category_with_ownership " +
        error.message,
    );
  }

  const parsedAndSortedData = data?.map((option) => ({
    category: option.category,
    price: option.price,
    option_value: option.option_value,
    id: option.id,
    isOwned: option.isowned,
  }));

  return parsedAndSortedData;
}
