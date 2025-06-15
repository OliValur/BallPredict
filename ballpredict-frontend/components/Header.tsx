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
          <Link href="/" className="hover:text-gray-300">
            <li>Home</li>
          </Link>
          <Link href="/myteam" className="hover:text-gray-300">
            <li>My Team</li>
          </Link>
          <Link href="/leaderboard" className="hover:text-gray-300">
            <li>Leaderboard</li>
          </Link>
          <Link href="/leagues" className="hover:text-gray-300">
            <li>League</li>
          </Link>
        </ul>
      </nav>
      <div className="flex items-center space-x-4">{children}</div>
    </header>
  );
}
