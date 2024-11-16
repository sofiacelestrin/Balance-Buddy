import { Tables } from "../supabase/supabaseTypes";
import createAvatarFromOptions, { avatarOptions } from "../util/createAvatar";

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

type AvatarPreviewProps = {
  onSelectCategory: (category: string) => void;
  categoryValues: Tables<"customization_options">[];
  userAvatar: avatarOptions;
};

function AvatarPreviewMenu({
  onSelectCategory,
  categoryValues,
  userAvatar,
}: AvatarPreviewProps) {
  const avatarPreviews = categoryValues
    ? categoryValues.map((opt) => {
        return {
          key: `${opt.category}_${opt.option_value}`,
          avatar: createAvatarFromOptions({
            ...userAvatar,
            [opt.category]: opt.option_value,
          }).toDataUri(),
          alt: `Your avatar with ${opt.category} set to ${opt.option_value}`,
        };
      })
    : [];

  return (
    <div className="w-full">
      <div className="custom-scrollbar flex w-full gap-4 overflow-x-scroll text-xs">
        {categories.map((category) => (
          <button
            className="bg-gray-100 p-2 shadow-xl hover:bg-gray-400"
            key={category}
            onClick={() => onSelectCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <ul className="flex flex-wrap gap-2">
        {avatarPreviews.map((avatar) => (
          <li key={avatar.key}>
            <img src={avatar.avatar} className="w-24" alt={avatar.alt} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AvatarPreviewMenu;
