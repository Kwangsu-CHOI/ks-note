"use client";

import AIChat from "@/components/aiChat";
import { Cover } from "@/components/cover";
import TemplateGenerator from "@/components/templateGenerator";

import Toolbar from "@/components/toolbar";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";

interface DocumentIdPageProps {
  params: {
    documentId: Id<"documents">;
  };
}

const DocumentIdPage = ({ params }: DocumentIdPageProps) => {
  const Editor = useMemo(
    () => dynamic(() => import("@/components/editor"), { ssr: false }),
    []
  );
  const document = useQuery(api.documents.getById, {
    documentId: params.documentId,
  });

  const update = useMutation(api.documents.update);

  const [content, setContent] = useState<string | undefined>(document?.content);
  const [editorKey, setEditorKey] = useState<number>(0);

  useEffect(() => {
    if (document?.content) {
      setContent(document.content);
    }
  }, [document?.content]);

  const onChange = (value: string) => {
    setContent(value);
    update({
      id: params.documentId,
      content: value,
    });
  };

  if (document === undefined) {
    return (
      <div>
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

  if (document === null) {
    return <div>not found</div>;
  }

  return (
    <div className="pb-40">
      <Cover url={document.coverImage} />
      <div className="md:max-w-3xl lg:max-w-4xl mx-auto">
        <Toolbar initialData={document} />
        <Editor key={editorKey} onChange={onChange} initialContent={content} />
      </div>
      <TemplateGenerator
        onTemplateGenerated={(template) => {
          const newContent = content ? `${content}\n\n${template}` : template;
          setContent(newContent);
          onChange(newContent);
          setEditorKey((prev) => prev + 1);
        }}
      />
      <AIChat documentContent={document.content || ""} />
    </div>
  );
};
export default DocumentIdPage;
