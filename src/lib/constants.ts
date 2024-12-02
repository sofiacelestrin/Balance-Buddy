import { Enums } from "../supabase/supabaseTypes";

export const customizationCategories: Record<
  Enums<"avatar_customization_categories">,
  string
> = {
  backgroundColor: "Background Color",
  top: "Hair Style",
  hatColor: "Headwear Color",
  facialHair: "Facial Hair",
  eyebrows: "Brows",
  eyes: "Eyes",
  mouth: "Expression",
  skinColor: "Complexion",
  accessories: "Eyewear",
  accessoriesColor: "Eyewear Color",
  clothing: "Outfit",
  clothesColor: "Outfit Color",
  // clothingGraphic: "Outfit Design",
  // facialHairColor: "Facial Hair Color",
  // hairColor: "Hair Color",

};
