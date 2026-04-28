import { redirect } from "next/navigation";

// Legacy admin auth URL — moved to /admode.
export default function AdminAuthRedirect() {
  redirect("/admode");
}
