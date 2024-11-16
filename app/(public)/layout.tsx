"use client";

import { useUser } from "@clerk/clerk-react";
import { AuthRedirect } from "@/components/auth-redirect";

const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    return null;
  }

  if (!isSignedIn) {
    return <AuthRedirect />;
  }

  return (
    <div className="h-full min-h-screen dark:bg-[#1f1f1f]">{children}</div>
  );
};

export default PublicLayout;
