import { twMerge } from "tailwind-merge";
import { Enums } from "../supabase/supabaseTypes";
import createAvatarFromOptions, { avatarOptions } from "../util/createAvatar";
import { avatarDetails, customizationOption } from "../lib/types";
import AvatarCard from "./AvatarCard";
import { customizationCategories } from "../lib/constants";

/**
 * Sometimes, some customization options cannot be customized. For example, the eyepatch cannot be changed in color or the user cannot modify the hat color if they don't have a hat on
 * @param avatarPreviews
 *
 *
 */
function detectNonCustomizableCategory(
  avatarPreviews: avatarDetails[],
): boolean {
  const uniqueAvatars = new Set(
    avatarPreviews.map((preview) => preview.avatar),
  );
  return uniqueAvatars.size === 1; // True if all avatars are identical
}

const customizationCategoriesList = Object.entries(customizationCategories) as [
  Enums<"avatar_customization_categories">,
  string,
][];

type AvatarPreviewProps = {
  onSelectCategory: (
    category: Enums<"avatar_customization_categories">,
  ) => void;
  //All the different category values for the selected category
  categoryValues: customizationOption[];
  //The selected avatar values. This is what the main avatar is based on
  userAvatar: customizationOption[];
  selectedCategory: Enums<"avatar_customization_categories">;
  onEquip: (avatar: avatarDetails) => void;
  onPurchaseItem: (itemToBuy: customizationOption) => Promise<void>;
};

function AvatarPreviewMenu({
  onSelectCategory,
  categoryValues,
  userAvatar,
  onEquip,
  selectedCategory,
  onPurchaseItem,
}: AvatarPreviewProps) {
  const parsedOptions = {} as avatarOptions;
  for (const customization of userAvatar) {
    parsedOptions[customization?.category] = customization?.option_value;
  }

  //For each customization option (c_i) for the selected category, display an avatar preview with that customization option (c_i)
  const avatarPreviews: avatarDetails[] = categoryValues
    ? categoryValues.map((opt) => {
        return {
          ...opt,
          avatar: createAvatarFromOptions({
            ...parsedOptions,
            [opt.category]: opt.option_value,
          }).toDataUri(),
          alt: `Your avatar with ${opt.category} set to ${opt.option_value}`,
          //If the id of the current option is present in the userAvatar, then it is currently selected and it should be distinguished from the rest
          isSelected: userAvatar.find(
            (selectedOption) => selectedOption.id === opt.id,
          ),
        };
      })
    : [];

  const isNonCustomizable = detectNonCustomizableCategory(avatarPreviews);
  const sortedAvatarOptions = avatarPreviews.sort((a, b) => a.id - b.id);

  return (
    <div className="w-full">
      <div className="custom-scrollbar flex w-full gap-4 overflow-x-scroll text-xs">
        {customizationCategoriesList.map(([category, uiLabel]) => (
          <button
            className={twMerge(
              "rounded bg-blue-500 p-2 text-lg font-semibold text-white shadow-xl hover:bg-blue-600",
              category === selectedCategory && "bg-blue-600",
            )}
            key={category}
            onClick={() => onSelectCategory(category)}
          >
            {uiLabel}
          </button>
        ))}
      </div>

      <ul className="flex flex-wrap justify-center gap-2">
        {!isNonCustomizable ? (
          sortedAvatarOptions.map((avatar) => (
            <AvatarCard
              key={avatar.id}
              avatar={avatar}
              onEquip={onEquip}
              onPurchaseItem={onPurchaseItem}
            />
          ))
        ) : (
          <p>No customization options available for the current selection</p>
        )}
      </ul>
    </div>
  );
}

export default AvatarPreviewMenu;
