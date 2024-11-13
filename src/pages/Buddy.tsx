import { createAvatar, Result } from "@dicebear/core";
import { avataaars } from "@dicebear/collection";

function Buddy({ avatarOptions, isLoadingAvatar }) {
  let userAvatar: Result;

  if (!isLoadingAvatar) {
    userAvatar = createAvatar(avataaars, {
      accessories: [`${avatarOptions.accessories}`],
      //exclude the # at the beginning
      backgroundColor: [avatarOptions.backgroundColor.slice(1)],
      accessoriesProbability: avatarOptions.accessories ? 100 : 0,
      accessoriesColor: [avatarOptions.accessoriesColor.slice(1)],
      clothesColor: [avatarOptions.clothesColor.slice(1)],
      clothing: [`${avatarOptions.clothing}`],
      clothingGraphic: [`${avatarOptions.clothingGraphic}`],
      eyebrows: [`${avatarOptions.eyebrows}`],
      eyes: [`${avatarOptions.eyes}`],
      facialHair: [`${avatarOptions.facialHair}`],
      facialHairProbability: avatarOptions.facialHair ? 100 : 0,
      facialHairColor: [`${avatarOptions.facialHairColor}`],
      hairColor: [avatarOptions.hairColor.slice(1)],
      hatColor: [avatarOptions.hatColor.slice(1)],
      mouth: [`${avatarOptions.mouth}`],
      nose: [`${avatarOptions.nose}`],
      skinColor: [avatarOptions.skinColor.slice(1)],
      top: [`${avatarOptions.top}`],
      topProbability: avatarOptions.top ? 100 : 0,
    });
  }

  return (
    <div className="mb-6 flex flex-col items-center rounded bg-white p-6 shadow-lg">
      <h2 className="mb-4 text-2xl font-bold">Buddy</h2>
      {/* Avatar Image */}
      {!isLoadingAvatar && (
        <img src={userAvatar.toDataUri()} alt="Buddy Avatar" className="w-28" />
      )}
      <div className="mt-4 flex flex-col items-center">
        {/* You can add the stats bars here */}
        <div className="mb-2 w-full max-w-xs">
          <h3 className="text-lg font-semibold">Happiness</h3>
          <div className="h-2 w-full rounded-full bg-gray-200">
            <div
              className="h-2 rounded-full bg-blue-500"
              style={{ width: "70%" }}
            ></div>
          </div>
        </div>
        <div className="mb-2 w-full max-w-xs">
          <h3 className="text-lg font-semibold">Self Actualization</h3>
          <div className="h-2 w-full rounded-full bg-gray-200">
            <div
              className="h-2 rounded-full bg-purple-500"
              style={{ width: "50%" }}
            ></div>
          </div>
        </div>
        <div className="mb-2 w-full max-w-xs">
          <h3 className="text-lg font-semibold">Connection</h3>
          <div className="h-2 w-full rounded-full bg-gray-200">
            <div
              className="h-2 rounded-full bg-red-500"
              style={{ width: "80%" }}
            ></div>
          </div>
        </div>
        <div className="mb-2 w-full max-w-xs">
          <h3 className="text-lg font-semibold">Growth</h3>
          <div className="h-2 w-full rounded-full bg-gray-200">
            <div
              className="h-2 rounded-full bg-green-500"
              style={{ width: "60%" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Buddy;
