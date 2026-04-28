import { redirect } from "next/navigation";

// Legacy login URL — moved to /center for providers (and /student / /admode for others).
export default function AuthRedirect() {
  redirect("/center");
}
