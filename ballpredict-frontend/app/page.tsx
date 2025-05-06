import Link from "next/link";
import GameGuesses from "@/components/GameGuesses";

export default function Home() {
  return (
    <div>
      Hæ
      <Link href="/guess">Gues</Link>
      <GameGuesses />
    </div>
  );
}
