import { Enums } from "../supabase/supabaseTypes";

export const customizationCategories: Record<
  Enums<"avatar_customization_categories">,
  string
> = {
  accessories: "accessories",
  accessoriesColor: "accessories color",
  backgroundColor: "background color",
  clothesColor: "clothes color",
  clothing: "clothing",
  clothingGraphic: "clothing graphic",
  eyebrows: "eyebrows",
  eyes: "eyes",
  facialHair: "facial hair",
  facialHairColor: "facial hair color",
  hairColor: "hair color",
  hatColor: "hat color",
  mouth: "mouth",
  skinColor: "skin color",
  top: "top",
};
