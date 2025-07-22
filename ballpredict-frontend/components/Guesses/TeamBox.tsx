import { getTeamLogoPath } from "@/utils/getTeamLogoPath";
import Image from "next/image";

export default function TeamBox({
  teamName,
  teamScore,
  isWinner,
  isGuess,
  isCorrect,
}: {
  teamName: string;
  teamScore: number | null;
  isWinner: boolean | null;
  isGuess?: boolean;
  isCorrect?: boolean | null;
}) {
  let borderColor = "border-gray-400";
  if (isGuess) {
    if (isCorrect === true) {
      borderColor = "border-green-500";
    } else if (isCorrect === false) {
      borderColor = "border-red-500";
    } else {
      borderColor = "border-blue-500";
    }
  }

  let bgColor = "bg-gray-700";
  if (isWinner === true) {
    bgColor = "bg-green-600";
  } else if (isWinner === false) {
    bgColor = "bg-red-600";
  } else if (isGuess) {
    bgColor = "bg-blue-600";
  }

  return (
    <div
      className={`flex flex-col items-center justify-center rounded-lg border-2 p-2 sm:p-3 text-white transition-all ${bgColor} ${borderColor}`}
    >
      <span className="text-center text-sm font-semibold sm:text-base">
        {teamName}
      </span>
      <Image
        src={getTeamLogoPath(teamName)}
        alt={teamName}
        width={40}
        height={40}
        className="my-2"
      />
      {teamScore !== null && (
        <span className="text-lg font-bold">{teamScore}</span>
      )}
      {isGuess && (
        <span className="mt-1 text-sm font-medium text-yellow-300 sm:text-base">
          {isCorrect === true
            ? "✅ Your Pick (Correct)"
            : isCorrect === false
            ? "❌ Your Pick"
            : "🟦 Your Pick"}
        </span>
      )}
    </div>
  );
}
