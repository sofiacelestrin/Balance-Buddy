import { twMerge } from "tailwind-merge";
import { avatarDetails } from "../lib/types";

type AvatarCardProps = {
  avatar: avatarDetails;
  onEquip: (avatar: avatarDetails) => void;
};

function AvatarCard({ avatar, onEquip }: AvatarCardProps) {
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
        {!avatar.isOwned && <button>Buy</button>}
        {/* Equip button should appear only for unequipped items. */}
        {!avatar.isSelected && (
          <button onClick={() => onEquip(avatar)}>
            {!avatar.isOwned ? "Try on" : "Equip"}
          </button>
        )}
      </div>
    </li>
  );
}

export default AvatarCard;
