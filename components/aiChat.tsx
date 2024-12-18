import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import AIChatbot from "./aiChatbot";
import Image from "next/image";

interface AIChatProps {
  documentContent: string | undefined;
}

const AIChat: React.FC<AIChatProps> = ({ documentContent }) => {
  const [showAIChat, setShowAIChat] = useState(false);
  const [messages, setMessages] = useState<
    Array<{ role: string; content: string }>
  >([]);

  useEffect(() => {
    const savedMessages = localStorage.getItem("aiChatMessages");
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("aiChatMessages", JSON.stringify(messages));
  }, [messages]);

  const resetChat = () => {
    setMessages([]);
    localStorage.removeItem("aiChatMessages");
  };

  const toggleAIChat = () => {
    setShowAIChat((prev) => !prev);
  };

  return (
    <>
      <Button
        className="fixed left-4 bottom-4 rounded-full p-2 bg-primary hover:bg-secondary transition-all duration-200 shadow-lg hover:shadow-xl z-[999999] group flex items-center justify-center w-10 h-10"
        onClick={toggleAIChat}
      >
        <Image
          src="/gemini.svg"
          alt="AI"
          width={32}
          height={32}
          className="w-6 h-5 md:w-6 md:h-6"
        />
        <span className="absolute left-[120%] opacity-0 group-hover:opacity-100 whitespace-nowrap transition-all duration-200 z-[999999] text-primary-foreground group-hover:text-primary">
          AI Chat
        </span>
      </Button>
      {showAIChat && (
        <AIChatbot
          documentContent={documentContent!}
          onClose={() => setShowAIChat(false)}
          messages={messages}
          setMessages={setMessages}
          resetChat={resetChat}
        />
      )}
    </>
  );
};

export default AIChat;
