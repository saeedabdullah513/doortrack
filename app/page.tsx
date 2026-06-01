import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await auth();
  if (!session) redirect("/login");
  if (session.user.role === "AGENT") redirect("/agent/dashboard");
  redirect("/admin/dashboard");
}
