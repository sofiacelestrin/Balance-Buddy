import { twMerge } from "tailwind-merge";
import { avatarDetails, customizationOption } from "../lib/types";

type AvatarCardProps = {
  avatar: avatarDetails;
  onEquip: (avatar: avatarDetails) => void;
  onPurchaseItem: (itemToBuy: customizationOption) => Promise<void>;
};

function AvatarCard({ avatar, onEquip, onPurchaseItem }: AvatarCardProps) {
  const handlePurchaseOfItem = () =>
    onPurchaseItem({
      category: avatar.category,
      id: avatar.id,
      option_value: avatar.option_value,
      price: avatar.price,
      isOwned: false,
    });

  return (
    <li
      className={twMerge(
        "flex flex-col bg-blue-100 p-2",
        avatar.isSelected && "ring-4 ring-yellow-300",
      )}
    >
      <img src={avatar.avatar} className="w-24" alt={avatar.alt} />
      <div className="flex flex-grow flex-col justify-center bg-red-200">
        {/* Buy button only displays for items not owned by the user */}
        {!avatar.isOwned && <button onClick={handlePurchaseOfItem}>Buy</button>}
        {/* Equip button should appear only for unequipped items. */}
        {!avatar.isSelected && (
          <button onClick={() => onEquip(avatar)}>
            {!avatar.isOwned ? "Try on" : "Equip"}
          </button>
        )}
        {/* I think the price of an item can be displayed on the top right corner of the avatar card, inside of it. If not you can leave it at the bottom like it is now. I also suggest including the coin icon you used in the dashboard page in here, next to the price  */}
        {!avatar.isOwned && <p className="text-center">{avatar.price}</p>}
      </div>
    </li>
  );
}

export default AvatarCard;
