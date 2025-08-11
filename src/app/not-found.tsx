import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="background-light850_dark100 flex min-h-screen items-center justify-center">
      <div className="flex w-full flex-col items-center justify-center px-6">
        <>
          <Image
            src="/images/dark-error.png"
            alt="Page not found illustration"
            width={270}
            height={200}
            priority
            className="hidden h-auto w-auto object-contain dark:block"
          />
          <Image
            src="/images/light-error.png"
            alt="Page not found illustration"
            width={270}
            height={200}
            priority
            className="block h-auto w-auto object-contain dark:hidden"
          />
        </>

        <h2 className="h2-bold text-dark200_light900 mt-8">Page Not Found</h2>

        <p className="body-regular text-dark500_light700 my-3.5 max-w-md text-center">
          Oops! The page you're looking for seems to have wandered off into the
          digital wilderness. Let's get you back to familiar territory.
        </p>

        <Link href="/">
          <Button className="primary-gradient paragraph-medium text-light-900 mt-5 rounded-lg px-4 py-3">
            Return Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
