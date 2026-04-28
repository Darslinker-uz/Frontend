import { redirect } from "next/navigation";

// Legacy admin URL — moved to /admode (login) and /admode/home (dashboard).
export default function AdminLegacyRedirect() {
  redirect("/admode/home");
}
