import Link from "next/link";

export default function Header() {
  return (
    <header className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <h1 className="text-xl font-bold">My App</h1>
      <nav>
        <ul className="flex space-x-4">
          <Link href="/" className="hover:text-gray-300">
            <li>Home</li>
          </Link>
          <Link href="/profile" className="hover:text-gray-300">
            <li>Profile</li>
          </Link>
          <Link href="/settings" className="hover:text-gray-300">
            <li>Settings</li>
          </Link>
        </ul>
      </nav>
    </header>
  );
}
