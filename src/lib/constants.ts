import { Enums } from "../supabase/supabaseTypes";

export const customizationCategories: Record<
  Enums<"avatar_customization_categories">,
  string
> = {
  backgroundColor: "Background Color",
  top: "Hair Style",
  hairColor: "Hair Color",
  facialHair: "Facial Hair",
  eyebrows: "Brows",
  eyes: "Eyes",
  mouth: "Expression",
  skinColor: "Complexion",
  accessories: "Eyewear",
  accessoriesColor: "Eyewear Color",
  clothing: "Outfit",
  clothingGraphic: "Outfit Design",
  clothesColor: "Outfit Color",
  facialHairColor: "Facial Hair Color",
  hatColor: "Headwear Color",
};
