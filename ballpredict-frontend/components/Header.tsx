import Link from "next/link";
import React from "react";

type HeaderProps = {
  children?: React.ReactNode;
};

export default function Header({ children }: HeaderProps) {
  return (
    <header className="flex flex-row justify-between items-center p-4 bg-nflred text-white">
      <h1 className="text-xl font-bold">NFL Guessr 🏈</h1>
      <nav>
        <ul className="flex space-x-4">
          <Link href="/" className="hover:text-gray-300" prefetch={true}>
            <li>Home</li>
          </Link>
          <Link
            href="/leaderboard"
            className="hover:text-gray-300"
            prefetch={true}
          >
            <li>Leaderboard</li>
          </Link>
          <Link href="/leagues" className="hover:text-gray-300" prefetch={true}>
            <li>League</li>
          </Link>
          <Link
            href="/season_predictions"
            className="hover:text-gray-300"
            prefetch={true}
          >
            <li>Season Predictions</li>
          </Link>
        </ul>
      </nav>
      <div className="flex items-center space-x-4">{children}</div>
    </header>
  );
}
