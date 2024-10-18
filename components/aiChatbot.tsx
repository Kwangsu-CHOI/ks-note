import React, { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import ReactMarkdown from "react-markdown";
import { X, Send, RefreshCw } from "lucide-react";

interface AIChatbotProps {
  documentContent: string;
  onClose: () => void;
  messages: Array<{ role: string; content: string }>;
  setMessages: React.Dispatch<
    React.SetStateAction<Array<{ role: string; content: string }>>
  >;
  resetChat: () => void;
}

const AIChatbot: React.FC<AIChatbotProps> = ({
  documentContent,
  onClose,
  messages,
  setMessages,
  resetChat,
}) => {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          documentContent,
        }),
      });

      if (!response.ok) throw new Error("API request failed");

      const data = await response.json();
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "assistant", content: data.response },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: "assistant",
          content: "Sorry, an error occurred. Please try again.",
        },
      ]);
    }
  };

  return (
    <div className="fixed bottom-16 left-4 w-80 h-96 bg-card text-card-foreground rounded-lg shadow-lg flex flex-col z-[999999] ai-chatbot">
      <div className="flex justify-between items-center p-2 border-b border-border">
        <h3 className="font-bold text-foreground/70">Ask me anything 😉</h3>
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={resetChat}
            className="mr-2"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="flex-grow overflow-y-auto p-2 space-y-2">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[70%] p-2 rounded-lg ${msg.role === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}
            >
              {msg.role === "user" ? (
                msg.content
              ) : (
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-2 border-t border-border flex">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Ask AI..."
          className="flex-grow mr-2"
        />
        <Button
          onClick={sendMessage}
          size="icon"
          className="bg-primary text-primary-foreground"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default AIChatbot;
