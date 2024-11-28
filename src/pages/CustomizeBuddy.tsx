import {
  InvalidateQueryFilters,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useEffect, useMemo, useReducer } from "react";

import toast from "react-hot-toast";
import AvatarPreviewMenu from "../components/AvatarPreviewMenu";
import PurchaseConfirmationModal from "../components/PurchaseConfirmationModal";
import { useSession } from "../contexts/SessionContext";
import { avatarDetails, customizationOption } from "../lib/types";
import { getCustomizationOptionsByCategoryWithOwnership } from "../supabase/customizationOptionsService";
import { Enums } from "../supabase/supabaseTypes";
import {
  buyOptionsAndSave,
  getCustomizationOptionsOwnership,
} from "../supabase/userCustomizationOwnershipService";
import {
  getUserCoinBalance,
  purchaseCustomizationOptions as purchaseCustomizationOptionsSupabase,
} from "../supabase/userService";
import createAvatarFromOptions, { avatarOptions } from "../util/createAvatar";

import isEqual from "lodash/isEqual";

type CustomizeBuddyState = {
  selectedCategory: Enums<"avatar_customization_categories">;
  originalAvatarOptions: customizationOption[];
  selectedAvatarOptions: customizationOption[]; //The main avatar is built from these configurations
  showPurchaseModal: boolean;
};

type Action =
  | { type: "INITIAL_AVATAR_LOAD"; payload: customizationOption[] }
  | {
      type: "CATEGORY_CHANGE";
      payload: Enums<"avatar_customization_categories">;
    }
  | { type: "EQUIP_ITEM"; payload: customizationOption }
  | { type: "TOGGLE_PURCHASE_MODAL" }
  | { type: "REMOVE_UNOWNED_ITEM"; payload: customizationOption }
  | { type: "RESET" }
  | { type: "DISCARD_ALL_UNOWNED_ITEMS" }
  | { type: "AFTER_SAVE_CHANGES" }
  | { type: "PURCHASE_SINGLE_ITEM"; payload: number };

const initialState: CustomizeBuddyState = {
  selectedCategory: "accessories",
  //use this for the purposes of comparison with the ever changing selectedAvatarOptions. The comparison will show which items are to be deactivated and activated and which items are to be purchased
  originalAvatarOptions: [],
  selectedAvatarOptions: [],
  showPurchaseModal: false,
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
    case "TOGGLE_PURCHASE_MODAL":
      return { ...state, showPurchaseModal: !state.showPurchaseModal };
    case "REMOVE_UNOWNED_ITEM": {
      const itemToRemove = action.payload;
      const newSelectedAvataOptions = state.selectedAvatarOptions.map(
        (selectedOption) => {
          // If the category selected matches the item to remove, replace it with the corresponding item from originalAvatarOptions
          if (selectedOption.category === itemToRemove.category) {
            return (
              state.originalAvatarOptions.find(
                (originalOption) =>
                  originalOption.category === itemToRemove.category,
              ) ?? selectedOption // Fallback to current option if no match found
            );
          }

          // Otherwise, keep the option unchanged
          return selectedOption;
        },
      );

      // Check if the unownedItems array is empty after removal
      const hasUnownedItems = newSelectedAvataOptions.some(
        (option) => !option.isOwned,
      );
      const hasUnsavedChanges = !isEqual(
        state.originalAvatarOptions,
        newSelectedAvataOptions,
      );

      return {
        ...state,
        selectedAvatarOptions: [...newSelectedAvataOptions],
        //If the cart has unowned items, continue showing purchase modal. However, if there are no unowned items, ask next question. If there are unsavedChanges, continue displaying purchase modal, otherwise display nothing
        showPurchaseModal: hasUnownedItems || hasUnsavedChanges,
      };
    }
    case "RESET":
      return {
        ...state,
        selectedAvatarOptions: [...state.originalAvatarOptions],
      };
    case "DISCARD_ALL_UNOWNED_ITEMS": {
      const filteredSelectedAvatar = state.selectedAvatarOptions.map(
        (selectedOption) => {
          //if the user does not own option c_i, find the replacement in the originalAvatarArray
          if (!selectedOption.isOwned) {
            return (
              state.originalAvatarOptions.find(
                (originalOption) =>
                  originalOption.category === selectedOption.category,
              ) ?? selectedOption
            );
            //If the user owns option c_i, then just leave it alone
          } else return selectedOption;
        },
      );

      return { ...state, selectedAvatarOptions: filteredSelectedAvatar };
    }
    case "PURCHASE_SINGLE_ITEM": {
      const idOfItemPurchased = action.payload;

      return {
        ...state,
        selectedAvatarOptions: state.selectedAvatarOptions.map((option) =>
          option.id === idOfItemPurchased
            ? { ...option, isOwned: true }
            : option,
        ),
      };
    }
    case "AFTER_SAVE_CHANGES":
      return {
        ...state,
        originalAvatarOptions: [...state.selectedAvatarOptions],
      };

    default:
      return state;
  }
}

function CustomizeBuddy() {
  //State and Derived state first
  const [
    {
      selectedAvatarOptions,
      selectedCategory,
      originalAvatarOptions,
      showPurchaseModal,
    },
    dispatch,
  ] = useReducer(reducer, initialState);

  const { session } = useSession();
  const queryClient = useQueryClient();
  const unownedItems = selectedAvatarOptions.filter(
    (option) => !option.isOwned,
  );

  const hasUnsavedChanges = useMemo(() => {
    return !isEqual(originalAvatarOptions, selectedAvatarOptions);
  }, [originalAvatarOptions, selectedAvatarOptions]);

  //Remote data fetching below
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
        return await getCustomizationOptionsByCategoryWithOwnership(
          session?.user.id as string,
          selectedCategory,
        );
      },
      staleTime: Infinity,
    },
  );

  const { data: coin_balance } = useQuery({
    queryKey: ["coin_balance"],
    queryFn: async () => await getUserCoinBalance(session?.user.id as string),
    staleTime: Infinity,
  });

  //This mutation function can be used to purchase an individual option or multiple options if the PurchaseModalWindow is open
  const { mutateAsync: purchaseCustomizationOptions } = useMutation({
    mutationFn: async (cartItems: customizationOption[]) => {
      return await purchaseCustomizationOptionsSupabase(
        cartItems,
        session?.user.id as string,
      );
    },
    onMutate: (cartItems) => {
      const totalCost = cartItems.reduce((sum, item) => sum + item.price, 0);
      if (totalCost > coin_balance) {
        throw new Error(
          "You don't have enough coins to complete this purchase",
        );
      }
      toast.loading("Loading...");
    },
    onSuccess: (data) => {
      toast.dismiss();

      const itemPurchasedId = data[0];
      //If the item purchased is an element of selectedAvatarOptions, then it needs to be updated so that the application knows that this option has been purchased.
      if (
        selectedAvatarOptions.find((option) => option.id === itemPurchasedId)
      ) {
        //dispatch update of selectedAvatar options
        dispatch({ type: "PURCHASE_SINGLE_ITEM", payload: itemPurchasedId });
      }
      queryClient.invalidateQueries([
        "coin_balance",
        "category_values",
      ] as InvalidateQueryFilters);
      toast.success("Succesfully Made Purchase");
    },
    onError: (error) => {
      toast.dismiss();
      toast.error(error.message);
    },
    networkMode: "always",
    retry: 2, // Retry a maximum of 3 times
    retryDelay: (attempt) =>
      Math.min(attempt > 1 ? 2 ** attempt * 1000 : 1000, 30 * 1000), // Exponential backoff up to 10 seconds
  });

  const { mutateAsync: handleSaveChangesMutation } = useMutation({
    mutationFn: async () => {
      return await buyOptionsAndSave(
        originalAvatarOptions,
        selectedAvatarOptions,
        session?.user.id as string,
      );
    },
    onMutate: () => {
      const totalCost = unownedItems.reduce((sum, item) => sum + item.price, 0);
      if (totalCost > coin_balance) {
        throw new Error(
          "You don't have enough coins to complete this purchase",
        );
      }
      toast.loading("Saving...");
    },
    onSuccess: (data) => {
      toast.dismiss();
      dispatch({ type: "AFTER_SAVE_CHANGES" });

      //if the purchase modal was openened when handleSaveChangesMutation function was executed, then a purchase was made
      if (showPurchaseModal) {
        dispatch({ type: "TOGGLE_PURCHASE_MODAL" });
      }
      queryClient.invalidateQueries([
        "coin_balance",
        "category_values",
      ] as InvalidateQueryFilters);
      toast.success(data);
    },
    onError: (error) => {
      toast.remove();
      toast.error(error.message);
    },
    networkMode: "always",
    retry: 2, // Retry a maximum of 3 times
    retryDelay: (attempt) =>
      Math.min(attempt > 1 ? 2 ** attempt * 1000 : 1000, 30 * 1000), // Exponential backoff up to 10 seconds
  });

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

  //Event handlers below
  const handleSelectCategory = (
    category: Enums<"avatar_customization_categories">,
  ) => dispatch({ type: "CATEGORY_CHANGE", payload: category });

  const handleEquip = (avatar: avatarDetails) => {
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
  const handleDiscardUnownedItem = (itemToRemove: customizationOption) => {
    dispatch({ type: "REMOVE_UNOWNED_ITEM", payload: itemToRemove });
  };

  //When user clicks on Save Changes in the Dashboard. Needs to be implemented with react query
  const handleSaveChanges = async () => {
    //Check if the user has any unowned items
    if (unownedItems.length > 0) {
      dispatch({ type: "TOGGLE_PURCHASE_MODAL" });
      return;
    }

    await handleSaveChangesMutation();
  };

  const handlePurchaseSingleItem = async (itemToBuy: customizationOption) =>
    await purchaseCustomizationOptions([itemToBuy]);
  const handleReset = () => dispatch({ type: "RESET" });

  const handleClose = () => dispatch({ type: "TOGGLE_PURCHASE_MODAL" });

  //If avatar is loading (fetching from supabase) or if userAvatar hasn't been created, then return loading message. This should only happen on the initial page load
  if (isLoadingAvatar || !userAvatar) return <div>Loading...</div>;

  return (
    <div className="relative mx-auto min-h-screen max-w-[960px]">
      {showPurchaseModal && (
        <PurchaseConfirmationModal
          items={unownedItems}
          onBuyAndSave={handleSaveChangesMutation}
          onDiscardItem={handleDiscardUnownedItem}
          onCancel={handleClose}
          hasUnsavedChanges={hasUnsavedChanges}
        />
      )}
      <h1>Customize your Buddy</h1>
      <p>{coin_balance}</p>
      <div className="flex flex-col items-center justify-center">
        <img src={userAvatar.toDataUri()} alt="User avatar" className="w-72" />
      </div>

      <div className="flex flex-col gap-1">
        {/* This button attempts to save the user changes to the database */}
        <button
          className={!hasUnsavedChanges ? "bg-gray-500" : "bg-red-300"}
          onClick={handleSaveChanges}
          disabled={!hasUnsavedChanges}
        >
          Save Changes
        </button>
        <button
          className={!hasUnsavedChanges ? "bg-gray-500" : "bg-red-300"}
          onClick={handleReset}
          disabled={!hasUnsavedChanges}
        >
          Reset
        </button>
      </div>
      <AvatarPreviewMenu
        onSelectCategory={handleSelectCategory}
        categoryValues={categoryValues as customizationOption[]}
        userAvatar={selectedAvatarOptions}
        selectedCategory={selectedCategory}
        onEquip={handleEquip}
        onPurchaseItem={handlePurchaseSingleItem}
      />
    </div>
  );
}

export default CustomizeBuddy;
