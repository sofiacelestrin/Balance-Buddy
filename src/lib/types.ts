import { Enums, Tables } from "../supabase/supabaseTypes";

export type customizationOption = Tables<"customization_options"> & {
  isOwned: boolean;
};
export type avatarDetails = {
  avatar: string;
  alt: string;
  isSelected: customizationOption | undefined;
  category: Enums<"avatar_customization_categories">;
  id: number;
  option_value: string;
  price: number;
  isOwned: boolean;
};
