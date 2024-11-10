import { getAllCustomizationOptions } from "./customizationOptionsService";
import { supabase } from "./supabase";
import { TablesInsert } from "./supabaseTypes";

export async function saveAvatar(
  avatarConfig: Record<string, unknown>,
  userId: string,
  avatarName: string,
) {
  const insertData: TablesInsert<"user_customization_ownership">[] = [];
  //Step 1: first fetch all customization options
  const customizationOptions = await getAllCustomizationOptions();

  //Step 2: Create a lookup map for faster access by category and option_value
  const customizationOptionsMap = customizationOptions.reduce((map, option) => {
    const key = `${option.category}_${option.option_value}`;
    map.set(key, option.id);
    return map;
  }, new Map<string, number>());

  // Step 3: Build the insertData array by looking up IDs from the map
  for (const [category, value] of Object.entries(avatarConfig)) {
    //Find the customizationOption tuple that matches the Record from the avatarConfig object. For example, if in the avatarConfig object, the Record is backgroundColor="e5e7eb", we want the tuple with id=46
    const result = customizationOptionsMap.get(`${category}_${value}`);

    if (result) {
      insertData.push({
        customization_id: result,
        user_id: userId,
        is_active: true,
      });
    }
  }

  // Step 4: Insert into user_customization_ownership and update user's avatar name
  const [{ error: insertError }, { error: updateError }] = await Promise.all([
    supabase.from("user_customization_ownership").insert(insertData),
    supabase.from("users").update({ avatar_name: avatarName }).eq("id", userId),
  ]);

  if (insertError || updateError) {
    const errorDetails = [
      insertError ? `Customization Insert Error: ${insertError.message}` : "",
      updateError ? `User Update Error: ${updateError.message}` : "",
    ]
      .filter(Boolean)
      .join(", ");
    throw new Error(`Unable to create avatar: ${errorDetails}`);
  }
}

export async function getCustomizationOptionsOwnership(userId: string) {
  const { data, error } = await supabase
    .from("user_customization_ownership")
    .select(
      `
      customization_options (
        category,
        option_value
      )
    `,
    )
    .eq("user_id", userId)
    .eq("is_active", true);

  const processedResult = data?.map((tuple) => tuple.customization_options);

  if (error) {
    console.error(
      "Error fetching customization options ownership:",
      error.message,
    );
    return null;
  }

  return processedResult;
}