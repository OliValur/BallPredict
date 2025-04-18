import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default async function PrivatePage() {
  const supabase = await createClient();

  const { data: sessionData, error: sessionError } =
    await supabase.auth.getSession();
  console.log(sessionData);

  if (sessionError || !sessionData.session?.user) {
    redirect("/login");
  }

  const user = sessionData.session.user;

  return <p>Hello {user.email}</p>;
}
