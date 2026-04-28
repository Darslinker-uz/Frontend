import { redirect } from "next/navigation";

// Legacy dashboard URL — moved to /center (login) and /center/home (dashboard).
export default function DashboardLegacyRedirect() {
  redirect("/center/home");
}
