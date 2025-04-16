"use client"; // if you're using the Next.js App Router

import { useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";

export default function Home() {
  const { getToken } = useAuth();

  useEffect(() => {
    const getWeather = async () => {
      const token = await getToken({ template: "supabase" });
      const res = await fetch("http://localhost:5245/weatherforecast", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(token);
      const data = await res.json();
      console.log(data);
    };
    getWeather();
  }, [getToken]);

  return <div>Hæ</div>;
}
