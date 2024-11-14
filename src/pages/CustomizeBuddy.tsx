import { avataaars } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useSession } from "../contexts/SessionContext";
import { getCustomizationOptionsByCategory } from "../supabase/customizationOptionsService";
import { getCustomizationOptionsOwnership } from "../supabase/userCustomizationOwnershipService";

const categories = [
  "accessories",
  "accessoriesColor",
  "backgroundColor",
  "backgroundType",
  "clothesColor",
  "clothing",
  "clothingGraphic",
  "eyebrows",
  "eyes",
  "facialHair",
  "facialHairColor",
  "hairColor",
  "hatColor",
  "mouth",
  "nose",
  "skinColor",
  "top",
];

function CustomizeBuddy() {
  //If you need the current session, use the useSession hook
  const { session } = useSession();
  const [selectedCategory, setSelectedCategory] = useState("backgroundColor");

  const { isPending: isLoadingAvatar, data: avatarOptions } = useQuery({
    queryKey: ["user_avatar"],
    queryFn: () => getCustomizationOptionsOwnership(session?.user.id as string),
  });

  const { isPending: isLoadingCategoryValues, data: categoryValues } = useQuery(
    {
      queryKey: ["category_values", selectedCategory],
      queryFn: async () => {
        console.log(
          "Fetch customizations by category where category = " +
            selectedCategory,
        );
        return await getCustomizationOptionsByCategory(selectedCategory);
      },
    },
  );

  const userAvatar = useMemo(() => {
    if (isLoadingAvatar) return null;
    const options = avatarOptions?.reduce(
      (avatarOptions, option) => {
        const category = option?.category as string;
        const optionValue = option?.option_value as string;
        avatarOptions[category] = optionValue;
        return avatarOptions;
      },
      {} as Record<string, string>,
    );

    return createAvatar(avataaars, {
      accessories: [`${options.accessories}`],
      //exclude the # at the beginning
      backgroundColor: [options.backgroundColor.slice(1)],
      accessoriesProbability: options.accessories ? 100 : 0,
      accessoriesColor: [options.accessoriesColor.slice(1)],
      clothesColor: [options.clothesColor.slice(1)],
      clothing: [`${options.clothing}`],
      clothingGraphic: [`${options.clothingGraphic}`],
      eyebrows: [`${options.eyebrows}`],
      eyes: [`${options.eyes}`],
      facialHair: [`${options.facialHair}`],
      facialHairProbability: options.facialHair ? 100 : 0,
      facialHairColor: [`${options.facialHairColor.slice(1)}`],
      hairColor: [options.hairColor.slice(1)],
      hatColor: [options.hatColor.slice(1)],
      mouth: [`${options.mouth}`],
      nose: [`${options.nose}`],
      skinColor: [options.skinColor.slice(1)],
      top: [`${options.top}`],
      topProbability: options.top ? 100 : 0,
    });
  }, [avatarOptions, isLoadingAvatar]);

  if (isLoadingAvatar) return <p>Loading Avatar</p>;

  if (!isLoadingCategoryValues) {
    const avatarPreviews = categoryValues?.map((value) =>
      createAvatar(avataaars, {
        accessories: [`${options.accessories}`],
        //exclude the # at the beginning
        backgroundColor: [options.backgroundColor.slice(1)],
        accessoriesProbability: options.accessories ? 100 : 0,
        accessoriesColor: [options.accessoriesColor.slice(1)],
        clothesColor: [options.clothesColor.slice(1)],
        clothing: [`${options.clothing}`],
        clothingGraphic: [`${options.clothingGraphic}`],
        eyebrows: [`${options.eyebrows}`],
        eyes: [`${options.eyes}`],
        facialHair: [`${options.facialHair}`],
        facialHairProbability: options.facialHair ? 100 : 0,
        facialHairColor: [`${options.facialHairColor.slice(1)}`],
        hairColor: [options.hairColor.slice(1)],
        hatColor: [options.hatColor.slice(1)],
        mouth: [`${options.mouth}`],
        nose: [`${options.nose}`],
        skinColor: [options.skinColor.slice(1)],
        top: [`${options.top}`],
        topProbability: options.top ? 100 : 0,
      }),
    );
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-[960px] flex-col items-center">
      Customize your Buddy
      <img src={userAvatar.toDataUri()} alt="User avatar" className="w-24" />
      <div className="w-full pt-[50%]">
        <div className="custom-scrollbar flex w-full gap-4 overflow-x-scroll text-xs">
          {categories.map((category) => (
            <button
              className="bg-gray-100 p-2 shadow-xl hover:bg-gray-400"
              key={category}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
        <div className="h-80 bg-blue-900"></div>
      </div>
    </div>
  );
}

export default CustomizeBuddy;
