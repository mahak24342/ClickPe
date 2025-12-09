"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";

type Message = { role: "user" | "assistant"; content: string };

interface Product {
  id: string;
  name: string;
  rate_apr: number;
  min_income: number;
  min_credit_score: number;
}

interface ProductChatProps {
  product?: Product; // optional to handle undefined
}

export function Chat({ product }: ProductChatProps) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to the bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || !product) return;

    const userMsg: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3000/api/ai/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
       body: JSON.stringify({
  productId: product.id,
  product,  // 🔥 SEND FULL PRODUCT OBJECT
  message: userMsg.content,
  history: [...messages, userMsg]
})
      });

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.answer },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Something went wrong." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!product) {
    return <div>Loading product...</div>;
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button>Ask About Product</Button>
      </SheetTrigger>

      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>{product.name}</SheetTitle>
          <div className="flex gap-2 mt-1 flex-wrap">
            <Badge>APR: {product.rate_apr}%</Badge>
            <Badge>Min Income: ₹{product.min_income}</Badge>
            <Badge>Credit Score: {product.min_credit_score}</Badge>
          </div>
        </SheetHeader>

        <div className="flex flex-col space-y-2 mt-4 h-[60vh] overflow-y-auto border p-2 rounded">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`p-2 rounded max-w-xs break-words ${
                msg.role === "user"
                  ? "bg-blue-100 self-end"
                  : "bg-gray-100 self-start"
              }`}
            >
              {msg.content}
            </div>
          ))}
          {loading && (
            <div className="text-sm text-muted-foreground">AI is typing...</div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="mt-4 flex gap-2">
          <Input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question..."
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />
          <Button onClick={sendMessage} disabled={loading}>
            Send
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
