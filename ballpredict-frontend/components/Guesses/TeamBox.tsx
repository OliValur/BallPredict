import { getTeamLogoPath } from "@/utils/getTeamLogoPath";
import Image from "next/image";

export default function TeamBox({
  teamName,
  teamScore,
}: {
  teamName: string;
  teamScore: number | null;
}) {
  return (
    <div className="flex flex-col items-center space-y-2 min-w-0 flex-1">
      {/* Team Name */}
      <div className="text-center">
        <h3 className="font-bold text-sm leading-tight">{teamName}</h3>
      </div>

      {/* Team Logo */}
      <div className="relative group">
        <div className="w-12 h-12 rounded-lg overflow-hidden shadow-sm group-hover:shadow-md transition-shadow duration-200 bg-white dark:bg-slate-100 p-0.5">
          <Image
            src={getTeamLogoPath(teamName)}
            alt={`${teamName} logo`}
            width={48}
            height={48}
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* Team Score */}
      {teamScore !== null && (
        <div className="bg-slate-100 dark:bg-slate-700 rounded-md px-2 py-0.5 min-w-[1.5rem]">
          <span className="text-lg font-bold text-slate-900 dark:text-white">
            {teamScore}
          </span>
        </div>
      )}
    </div>
  );
}
