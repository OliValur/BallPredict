"use client"; // if you're using the Next.js App Router

import { useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";

export default function Home() {
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchToken = async () => {
      const token = await getToken({ template: "supabase" });
      console.log(token);
    };

    fetchToken();
  }, [getToken]);

  // make a request to

  return <div>Hæ</div>;
}
