import React, { useState } from 'react';
import { Button } from "./ui/button";
import AIChatbot from "./aiChatbot";
import Image from 'next/image';

interface AIChatProps {
  documentContent: string | undefined;
}

const AIChat: React.FC<AIChatProps> = ({ documentContent }) => {
  const [showAIChat, setShowAIChat] = useState(false);

  return (
    <>
      <Button
        className="fixed left-4 bottom-4 rounded-full p-2 bg-primary hover:bg-secondary transition-colors duration-200 shadow-lg hover:shadow-xl z-[999999]"
        onClick={() => setShowAIChat(!showAIChat)}
      >
        <Image 
            src="/gemini.svg" 
            alt="AI"
            width={32}
            height={32}
            className="w-6 h-5 md:w-6 md:h-6" // 아이콘 크기 조절
          />
      </Button>
      {showAIChat && (
        <AIChatbot
          documentContent={documentContent!}
          onClose={() => setShowAIChat(false)}
        />
      )}
    </>
  );
};

export default AIChat;