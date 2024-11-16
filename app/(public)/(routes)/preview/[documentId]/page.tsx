"use client";

import { Cover } from "@/components/cover";
import Toolbar from "@/components/toolbar";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit, Check } from "lucide-react";
import AIChat from "@/components/aiChat";
import { useUser } from "@clerk/clerk-react";
import { AuthRedirect } from "@/components/auth-redirect";

interface DocumentIdPageProps {
  params: {
    documentId: Id<"documents">;
  };
}

const DocumentIdPage = ({ params }: DocumentIdPageProps) => {
  const { isSignedIn, isLoaded } = useUser();
  const [isEditing, setIsEditing] = useState(false);

  const Editor = useMemo(
    () => dynamic(() => import("@/components/editor"), { ssr: false }),
    []
  );

  const document = useQuery(api.documents.getById, {
    documentId: params.documentId,
  });

  const update = useMutation(api.documents.update);

  const onChange = (content: string) => {
    update({
      id: params.documentId,
      content,
    });
  };

  if (isLoaded && !isSignedIn) {
    return <AuthRedirect />;
  }

  if (document === undefined) {
    return (
      <div className="h-full min-h-screen dark:bg-[#1f1f1f]">
        <Cover.Skeleton />
        <div className="md:max-w-3xl lg:max-w-4xl mx-auto mt-10">
          <div className="space-y-4 pl-8 pt-4">
            <Skeleton className="h-14 w-[50%]" />
            <Skeleton className="h-4 w-[80%]" />
            <Skeleton className="h-4 w-[40%]" />
            <Skeleton className="h-4 w-[60%]" />
          </div>
        </div>
      </div>
    );
  }

  if (document === null || !document.isPublished || document.isArchived) {
    return <div>Document not found or not available</div>;
  }

  return (
    <div className="pb-40 min-h-screen dark:bg-[#1f1f1f] relative">
      <div className="absolute top-4 right-4 z-10">
        <Button
          onClick={() => setIsEditing(!isEditing)}
          variant="outline"
          size="sm"
        >
          {isEditing ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              Done
            </>
          ) : (
            <>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </>
          )}
        </Button>
      </div>
      <Cover preview url={document.coverImage} />
      <div className="md:max-w-3xl lg:max-w-4xl mx-auto">
        <Toolbar preview={!isEditing} initialData={document} />
        <Editor
          preview={!isEditing}
          onChange={onChange}
          initialContent={document.content}
          editable={isEditing}
        />
        <AIChat documentContent={document.content || ""} />
      </div>
    </div>
  );
};

export default DocumentIdPage;
