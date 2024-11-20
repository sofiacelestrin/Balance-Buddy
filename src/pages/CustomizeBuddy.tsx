import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useReducer } from "react";
import AvatarPreviewMenu from "../components/AvatarPreviewMenu";
import { useSession } from "../contexts/SessionContext";
import { avatarDetails, customizationOption } from "../lib/types";
import { getCustomizationOptionsByCategoryWithOwnership } from "../supabase/customizationOptionsService";
import { Enums } from "../supabase/supabaseTypes";
import { getCustomizationOptionsOwnership } from "../supabase/userCustomizationOwnershipService";
import createAvatarFromOptions, { avatarOptions } from "../util/createAvatar";

type CustomizeBuddyState = {
  selectedCategory: Enums<"avatar_customization_categories">;
  originalAvatarOptions: customizationOption[];
  selectedAvatarOptions: customizationOption[]; //The main avatar is built from these configurations
};

type Action =
  | { type: "INITIAL_AVATAR_LOAD"; payload: customizationOption[] }
  | {
      type: "CATEGORY_CHANGE";
      payload: Enums<"avatar_customization_categories">;
    }
  | { type: "EQUIP_ITEM"; payload: customizationOption };

const initialState: CustomizeBuddyState = {
  selectedCategory: "backgroundColor",
  //use this for the purposes of comparison with the ever changing selectedAvatarOptions. The comparison will show which items are to be deactivated and activated and which items are to be purchased
  originalAvatarOptions: [],
  selectedAvatarOptions: [],
};

function reducer(
  state: CustomizeBuddyState,
  action: Action,
): CustomizeBuddyState {
  switch (action.type) {
    case "INITIAL_AVATAR_LOAD":
      return {
        ...state,
        selectedAvatarOptions: action.payload,
        originalAvatarOptions: action.payload,
      };
    case "CATEGORY_CHANGE":
      return { ...state, selectedCategory: action.payload };
    case "EQUIP_ITEM": {
      const itemToEquip: customizationOption = action.payload;
      return {
        ...state,
        selectedAvatarOptions: state.selectedAvatarOptions.map((option) =>
          option.category === itemToEquip.category ? itemToEquip : option,
        ),
      };
    }

    default:
      return state;
  }
}

function CustomizeBuddy() {
  //If you need the current session, use the useSession hook
  const [{ selectedAvatarOptions, selectedCategory }, dispatch] = useReducer(
    reducer,
    initialState,
  );
  const { session } = useSession();

  //fetch the user's current avatar options. This fetch request only happens once
  const { isPending: isLoadingAvatar, data: fetchedAvatarOptions } = useQuery({
    queryKey: ["user_avatar_customization"],
    queryFn: async () => {
      const data = await getCustomizationOptionsOwnership(
        session?.user.id as string,
      );
      return data?.map((option) => ({ ...option, isOwned: true }));
    },
    staleTime: Infinity,
  });

  //fetch the category options whenever the selectedCategory value changes
  const { isPending: isLoadingCategoryValues, data: categoryValues } = useQuery(
    {
      queryKey: ["category_values", selectedCategory],
      queryFn: async () => {
        const data = await getCustomizationOptionsByCategoryWithOwnership(
          session?.user.id as string,
          selectedCategory,
        );
        return data?.map((option) => ({
          category: option.category,
          price: option.price,
          option_value: option.option_value,
          id: option.id,
          isOwned: option.isowned,
        }));
      },
      staleTime: Infinity,
    },
  );

  //Once the user's avatar data comes from supabase, we save the result to the saveAvatarOptions state. This useEffect should only execute once! From here on out, the avatarOptions object will be updated only from the client side
  useEffect(() => {
    if (fetchedAvatarOptions) {
      dispatch({
        type: "INITIAL_AVATAR_LOAD",
        payload: fetchedAvatarOptions as customizationOption[],
      });
    }
  }, [fetchedAvatarOptions]);

  //The avatarOptions object will be set once from the data originating from supabase and from thereafter, on the client side
  const userAvatar = useMemo(() => {
    if (selectedAvatarOptions.length === 0) return null;

    const parsedOptions: avatarOptions = {};

    for (const customization of selectedAvatarOptions) {
      parsedOptions[customization?.category as string] =
        customization?.option_value;
    }

    return createAvatarFromOptions(parsedOptions);
  }, [selectedAvatarOptions]);

  const onSelectCategory = (
    category: Enums<"avatar_customization_categories">,
  ) => dispatch({ type: "CATEGORY_CHANGE", payload: category });

  const onEquip = (avatar: avatarDetails) => {
    dispatch({
      type: "EQUIP_ITEM",
      payload: {
        price: avatar.price,
        category: avatar.category,
        id: avatar.id,
        option_value: avatar.option_value,
        isOwned: avatar.isOwned,
      },
    });
  };

  //If avatar is loading (fetching from supabase) or if userAvatar hasn't been created, then return loading message. This should only happen on the initial page load
  if (isLoadingAvatar || !userAvatar) return <div>Loading...</div>;

  return (
    <div className="mx-auto min-h-screen max-w-[960px]">
      <h1>Customize your Buddy</h1>
      <div className="flex flex-col items-center justify-center">
        <img src={userAvatar.toDataUri()} alt="User avatar" className="w-72" />
      </div>
      <AvatarPreviewMenu
        onSelectCategory={onSelectCategory}
        categoryValues={categoryValues as customizationOption[]}
        userAvatar={selectedAvatarOptions}
        selectedCategory={selectedCategory}
        onEquip={onEquip}
      />
    </div>
  );
}

export default CustomizeBuddy;
