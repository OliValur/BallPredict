import GameGuesses from "@/components/Guesses/GameGuesses";
import SeasonCountdown from "@/components/SeasonCountdown";
import { SignedIn, SignedOut, SignIn, useAuth } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center">
      <SeasonCountdown />
      <SignedIn>
        <GameGuesses />
      </SignedIn>
      <SignedOut>
        <div>
          <p>Please sign in to see your game guesses.</p>
          <SignIn />
        </div>
      </SignedOut>
    </div>
  );
}
