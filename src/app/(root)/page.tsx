import { signOut } from "@/lib/auth";

import ROUTES from "@/constants/routes";

export default async function Home() {
  return (
    <>
      <h1 className="h1-bold">Hello Inter</h1>
      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: ROUTES.SIGN_IN });
        }}
        className="mt-96 px-10"
      >
        <button>Logout</button>
      </form>
    </>
  );
}
