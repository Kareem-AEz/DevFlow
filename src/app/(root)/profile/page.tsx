import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

import { ROUTES } from "@/constants/routes";

export default async function ProfileRedirect() {
  const session = await auth();

  // If user is not authenticated, redirect to sign-in
  if (!session?.user?.id) {
    redirect(ROUTES.SIGN_IN);
  }

  // If user is authenticated, redirect to their profile page
  redirect(ROUTES.PROFILE(session.user.id));
}
