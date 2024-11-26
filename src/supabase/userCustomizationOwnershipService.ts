import { customizationOption } from "../lib/types";
import { getAllCustomizationOptions } from "./customizationOptionsService";
import { supabase } from "./supabase";
import { Enums, TablesInsert } from "./supabaseTypes";
import { purchaseCustomizationOptions } from "./userService";

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
        *
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

export async function customizeAvatar(
  originalAvatar: customizationOption[],
  newAvatar: customizationOption[],
  userId: string,
) {
  const deactiveIds: number[] = [];
  const activateIds: number[] = [];

  //check if avatars are the same. If so, there is no need to submit a request to supabase
  if (JSON.stringify(originalAvatar) === JSON.stringify(newAvatar)) return;
  const originalOptionsMap = originalAvatar.reduce((map, option) => {
    return map.set(option.category, {
      id: option.id,
      value: option.option_value,
    });
  }, new Map<Enums<"avatar_customization_categories">, { id: number; value: string }>());
  const newOptionsMap = newAvatar.reduce((map, option) => {
    return map.set(option.category, {
      id: option.id,
      value: option.option_value,
    });
  }, new Map<Enums<"avatar_customization_categories">, { id: number; value: string }>());

  originalOptionsMap.forEach((oldValue, key) => {
    //Making the assumption that every property in the originalAvatar exists in the newAvatar. This needs further testing
    const newOption = newOptionsMap.get(key);
    if (!newOption) {
      return;
    }

    //If a difference is detected in the value for a category, deactivate the option in the oldAvatar and activate the new opton in the newAvatar.
    if (oldValue.id !== newOption.id) {
      deactiveIds.push(oldValue.id);
      activateIds.push(newOption.id);
    }
  });

  const { error } = await supabase.rpc("update_avatar_options", {
    deactivate_ids: deactiveIds,
    activate_ids: activateIds,
    user_id_param: userId,
  });

  if (error) {
    throw new Error(error.message);
  }
}

/**
 * Function that purchases customization options if there are unowned items in the newAvatar present and saves the customization to supabase.
 * @param originalAvatar
 * @param newAvatar
 * @param userId
 * @returns
 */
export async function buyOptionsAndSave(
  originalAvatar: customizationOption[],
  newAvatar: customizationOption[],
  userId: string,
) {
  const unownedItems = newAvatar.filter((option) => !option.isOwned);
  let successMessage = "Successfully saved changes";
  if (unownedItems.length > 0) {
    //First, buy all items in the cart, if there are any.
    await purchaseCustomizationOptions(unownedItems, userId);
    successMessage = "Successfully purchased and saved changes";
  }
  await customizeAvatar(originalAvatar, newAvatar, userId);
  return successMessage;
}
