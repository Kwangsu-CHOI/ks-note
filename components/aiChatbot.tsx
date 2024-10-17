import React, { useRef, useState } from 'react';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import ReactMarkdown from 'react-markdown';
import { Send, X } from 'lucide-react';

interface AIChatbotProps {
  documentContent: string;
  onClose: () => void;
}

const AIChatbot: React.FC<AIChatbotProps> = ({ documentContent, onClose }) => {
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages, documentContent }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "API 요청 실패");
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setMessages([...newMessages, { role: "assistant", content: data.response }]);
    } catch (error) {
      console.error("채팅 에러:", error);
      setMessages([...newMessages, { role: "assistant", content: "Something went wrong 😢" }]);
    }
  };

  return (
    <div className="fixed bottom-16 left-4 w-80 h-96 bg-card text-card-foreground rounded-lg shadow-lg flex flex-col z-[999999]">
      <div className="flex justify-between items-center p-2 border-b border-border">
        <h3 className="font-bold text-foreground">Ask AI</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex-grow overflow-y-auto p-2 space-y-2">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[70%] p-2 rounded-lg ${msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>
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
        <Button onClick={sendMessage} size="icon" className="bg-muted/80 text-primary hover:text-primary-foreground">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default AIChatbot;