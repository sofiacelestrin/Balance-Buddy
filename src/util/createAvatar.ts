import { avataaars } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";

export type avatarOptions = {
  accessories?: string;
  backgroundColor: string;
  accessoriesColor?: string;
  clothesColor: string;
  clothing: string;
  clothingGraphic: string;
  eyebrows: string;
  eyes: string;
  facialHair?: string;
  facialHairColor?: string;
  hairColor: string;
  hatColor: string;
  mouth: string;
  nose: string;
  skinColor: string;
  top?: string;
};

export default function createAvatarFromOptions(avatar: avatarOptions) {
  return createAvatar(avataaars, {
    accessories: [`${avatar.accessories}`],
    //exclude the # at the beginning
    backgroundColor: [avatar.backgroundColor.slice(1)],
    accessoriesProbability: avatar.accessories ? 100 : 0,
    accessoriesColor: [avatar.accessoriesColor.slice(1)],
    clothesColor: [avatar.clothesColor.slice(1)],
    clothing: [`${avatar.clothing}`],
    clothingGraphic: [`${avatar.clothingGraphic}`],
    eyebrows: [`${avatar.eyebrows}`],
    eyes: [`${avatar.eyes}`],
    facialHair: [`${avatar.facialHair}`],
    facialHairProbability: avatar.facialHair ? 100 : 0,
    facialHairColor: [`${avatar.facialHairColor.slice(1)}`],
    hairColor: [avatar.hairColor.slice(1)],
    hatColor: [avatar.hatColor.slice(1)],
    mouth: [`${avatar.mouth}`],
    nose: [`${avatar.nose}`],
    skinColor: [avatar.skinColor.slice(1)],
    top: [`${avatar.top}`],
    topProbability: avatar.top ? 100 : 0,
  });
}
