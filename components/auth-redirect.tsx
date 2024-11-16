"use client";

import { Button } from "@/components/ui/button";
import { SignInButton } from "@clerk/clerk-react";
import { usePathname } from "next/navigation";
import Image from "next/image";

export const AuthRedirect = () => {
  const pathname = usePathname();

  return (
    <div className="h-full flex flex-col items-center justify-center space-y-4">
      <Image
        src="/empty-dark.png"
        height="300"
        width="300"
        alt="empty"
        className="hidden dark:block"
      />
      <Image
        src="/empty-light.png"
        height="300"
        width="300"
        alt="empty"
        className="dark:hidden"
      />
      <h2 className="text-lg font-medium">
        Please log in first to view this document.
      </h2>
      <SignInButton mode="modal" forceRedirectUrl={pathname}>
        <Button>Login here</Button>
      </SignInButton>
    </div>
  );
};
