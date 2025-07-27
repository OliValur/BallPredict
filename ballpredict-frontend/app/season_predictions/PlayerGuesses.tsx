"use client";

import * as React from "react";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type PlayerData = {
  QB: string[];
  WR: string[];
  RB: string[];
};

type CategoryKey =
  | "mostPassingYards"
  | "mostReceivingYards"
  | "mostRushingYards";

interface PlayerGuessesProps {
  currentGuesses: Partial<Record<string, string>>;
  submitGuess: (category: string, guess: string) => void;
}

export default function PlayerGuesses({
  currentGuesses,
  submitGuess,
}: PlayerGuessesProps) {
  const [players, setPlayers] = React.useState<PlayerData | null>(null);
  const [loading, setLoading] = React.useState(true);

  const [selected, setSelected] = React.useState<Record<CategoryKey, string>>({
    mostPassingYards: currentGuesses.mostPassingYards ?? "",
    mostReceivingYards: currentGuesses.mostReceivingYards ?? "",
    mostRushingYards: currentGuesses.mostRushingYards ?? "",
  });

  const [open, setOpen] = React.useState<Record<CategoryKey, boolean>>({
    mostPassingYards: false,
    mostReceivingYards: false,
    mostRushingYards: false,
  });

  React.useEffect(() => {
    const load = async () => {
      const res = await fetch("/nfl_players.json");
      const data = await res.json();
      setPlayers(data);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!players) return <div>No players found</div>;

  const categories: { label: string; key: CategoryKey; data: string[] }[] = [
    { label: "Most Passing Yards", key: "mostPassingYards", data: players.QB },
    {
      label: "Most Receiving Yards",
      key: "mostReceivingYards",
      data: players.WR,
    },
    { label: "Most Rushing Yards", key: "mostRushingYards", data: players.RB },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
      {categories.map(({ label, key, data }) => (
        <div key={key} className="border p-4 rounded shadow bg-white">
          <h3 className="text-lg font-semibold mb-3">{label}</h3>

          <Popover
            open={open[key]}
            onOpenChange={(val) => setOpen((prev) => ({ ...prev, [key]: val }))}
          >
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open[key]}
                className="w-full justify-between"
              >
                {selected[key] || `Select player...`}
                <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Search players..." />
                <CommandList>
                  <CommandEmpty>No players found.</CommandEmpty>
                  <CommandGroup>
                    {data.map((player) => (
                      <CommandItem
                        key={player}
                        value={player}
                        onSelect={(val) => {
                          setSelected((prev) => ({ ...prev, [key]: val }));
                          setOpen((prev) => ({ ...prev, [key]: false }));
                        }}
                      >
                        <CheckIcon
                          className={cn(
                            "mr-2 h-4 w-4",
                            selected[key] === player
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {player}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          <Button
            className="mt-4 w-full"
            disabled={!selected[key]}
            onClick={() => submitGuess(key, selected[key])}
          >
            Submit
          </Button>
        </div>
      ))}
    </div>
  );
}
