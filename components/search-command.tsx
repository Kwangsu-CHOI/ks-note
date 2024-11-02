"use client";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { api } from "@/convex/_generated/api";
import { useSearch } from "@/hooks/use-search";
import { useUser } from "@clerk/clerk-react";
import { useQuery } from "convex/react";
import { File } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const SearchCommand = () => {
  const { user } = useUser();
  const router = useRouter();

  const [isMounted, setIsMounted] = useState(false);

  const documents = useQuery(api.documents.getSearch);

  const toggle = useSearch((store) => store.toggle);
  const isOpen = useSearch((store) => store.isOpen);
  const onClose = useSearch((store) => store.onClose);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const down = (e: KeyboardEvent) =>
      (e.ctrlKey || e.metaKey) && e.key === "k";

    const handler = (e: KeyboardEvent) => {
      if (down(e)) {
        toggle();
      }
    };

    const ignore = (e: KeyboardEvent) => {
      if (down(e)) {
        e.preventDefault();
      }
    };

    document.addEventListener("keyup", handler);
    document.addEventListener("keydown", ignore);

    return () => {
      document.removeEventListener("keyup", handler);
      document.removeEventListener("keydown", ignore);
    };
  }, [toggle]);

  const onSelect = (id: string) => {
	const documentId = id.split('-')[0]; // ID만 추출
	router.push(`/documents/${documentId}`);
	onClose();
  };

  if (!isMounted) {
    return null;
  }

  return (
    <CommandDialog open={isOpen} onOpenChange={onClose}>
      <CommandInput placeholder={`Search ${user?.fullName}'s note...`} />
      <CommandList>
        <CommandEmpty>No result found.</CommandEmpty>
        <CommandGroup heading="Documents">
          {documents?.map((document) => (
            <CommandItem
              key={document._id}
              value={`${document._id}-${document.title}`}
              title={document.title}
              onSelect={() => onSelect(`${document._id}-${document.title}`)}
            >
              {document.icon ? (
                <p className="mr-2 text-[18px]">{document.icon}</p>
              ) : (
                <File className="mr-2 h-4 w-4" />
              )}
              <span>{document.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};
