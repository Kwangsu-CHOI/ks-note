import React, { useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Wand2 } from "lucide-react";
import { toast } from "sonner";

interface TemplateGeneratorProps {
  onTemplateGenerated: (content: string) => void;
}

const TemplateGenerator: React.FC<TemplateGeneratorProps> = ({
  onTemplateGenerated,
}) => {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const generateTemplate = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: `Create a markdown template for the following topic: ${prompt}`,
            },
          ],
          documentContent: "",
          isTemplate: true,
        }),
      });

      if (!response.ok) throw new Error("Failed to generate template");

      const data = await response.json();
      onTemplateGenerated(data.response);
      setOpen(false);
      toast.success("Template generated! 👍");
    } catch (error) {
      toast.error("Failed to generate template 😥");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant="ghost"
        size="icon"
        className="fixed right-4 bottom-5 rounded-full bg-primary hover:bg-secondary transition-colors duration-200 shadow-lg hover:shadow-xl"
      >
        <Wand2 className="h-5 w-5 text-primary-foreground" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate Template</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input
              placeholder="Enter the topic you want to create a template for."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button onClick={generateTemplate} disabled={isLoading || !prompt}>
              {isLoading ? "Generating..." : "Generate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TemplateGenerator;
