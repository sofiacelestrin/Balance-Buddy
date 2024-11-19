import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import AvatarPreviewMenu from "../components/AvatarPreviewMenu";
import { useSession } from "../contexts/SessionContext";
import { getCustomizationOptionsByCategory } from "../supabase/customizationOptionsService";
import { getCustomizationOptionsOwnership } from "../supabase/userCustomizationOwnershipService";
import createAvatarFromOptions, { avatarOptions } from "../util/createAvatar";
import { Tables } from "../supabase/supabaseTypes";

function CustomizeBuddy() {
  //If you need the current session, use the useSession hook
  const { session } = useSession();
  const [selectedCategory, setSelectedCategory] = useState("backgroundColor");
  const [avatarOptions, setAvatarOptions] = useState<avatarOptions | null>(
    null,
  );

  //fetch the user's current avatar options. This fetch request only happens once
  const { isPending: isLoadingAvatar, data: fetchedAvatarOptions } = useQuery({
    queryKey: ["user_avatar"],
    queryFn: async () => {
      const options = await getCustomizationOptionsOwnership(
        session?.user.id as string,
      );

      //Parse the results that come from supabase into an avatarOptions object that can be passed to the utility function createAvatarFromOptions that creates an avatar
      const parsedOptions: avatarOptions = options?.reduce(
        (optionsObject, option) => {
          const category = option?.category as string;
          const optionValue = option?.option_value as string;
          optionsObject[category] = optionValue;
          return optionsObject;
        },
        {},
      );

      return parsedOptions;
    },
    staleTime: Infinity,
  });

  //fetch the category options whenever the selectedCategory value changes
  const { isPending: isLoadingCategoryValues, data: categoryValues } = useQuery(
    {
      queryKey: ["category_values", selectedCategory],
      queryFn: async () => {
        const options =
          await getCustomizationOptionsByCategory(selectedCategory);

        return options;
      },
      staleTime: Infinity,
    },
  );

  //Once the user's avatar data comes from supabase, we save the result to the saveAvatarOptions state. This useEffect should only execute once! From here on out, the avatarOptions object will be updated only from the client side
  useEffect(() => {
    if (fetchedAvatarOptions) {
      setAvatarOptions(fetchedAvatarOptions);
    }
  }, [fetchedAvatarOptions]);

  //The avatarOptions object will be set once from the data originating from supabase and from thereafter, on the client side
  const userAvatar = useMemo(() => {
    if (!avatarOptions) return null;

    return createAvatarFromOptions(avatarOptions);
  }, [avatarOptions]);

  //If avatar is loading (fetching from supabase) or if userAvatar hasn't been created, then return loading message. This should only happen on the initial page load
  if (isLoadingAvatar || !userAvatar) return <div>Loading...</div>;

  return (
    <div className="mx-auto flex min-h-screen max-w-[960px] flex-col items-center">
      <h1>Customize your Buddy</h1>
      <img src={userAvatar.toDataUri()} alt="User avatar" className="w-24" />
      <AvatarPreviewMenu
        onSelectCategory={setSelectedCategory}
        categoryValues={categoryValues as Tables<"customization_options">[]}
        userAvatar={avatarOptions}
      />
    </div>
  );
}

export default CustomizeBuddy;
