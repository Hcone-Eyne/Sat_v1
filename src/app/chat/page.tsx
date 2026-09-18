"use client";

import { useState, useRef, useEffect } from "react";
import {
  Send,
  Bot,
  User,
  Satellite,
  MapPin,
  Clock,
  Sparkles,
  Copy,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

const initialMessages: Message[] = [
  {
    id: 1,
    role: "assistant",
    content:
      "Hello! I'm SatQuery AI, your satellite tracking assistant. I can help you with:\n\n- **Satellite information** - Ask about any satellite's orbit, status, or specifications\n- **Pass predictions** - Find when satellites will be visible from your location\n- **Tracking tips** - Get advice on the best viewing conditions\n- **Space facts** - Learn interesting details about space missions\n\nHow can I help you today?",
    timestamp: "14:30",
  },
];

const quickPrompts = [
  "Where is the ISS right now?",
  "When will Starlink pass overhead?",
  "Tell me about Hubble Telescope",
  "Best time to view satellites?",
];

const mockResponses: Record<string, string> = {
  iss: "The **International Space Station (ISS)** is currently orbiting at approximately **408 km** altitude, traveling at **27,600 km/h**.\n\n**Current Position:**\n- Latitude: 28.57° N\n- Longitude: 80.65° W\n- Passing over the southeastern United States\n\n**Next Visible Pass:**\nTomorrow at 6:12 AM EST, visible for 4 minutes from your location. It will appear in the northwest and travel to the southeast.\n\nWould you like me to set a reminder for this pass?",
  starlink:
    "**Starlink satellite pass predictions:**\n\nBased on your location, here are the next visible Starlink passes:\n\n| Date | Time | Duration | Visibility |\n|------|------|----------|------------|\n| Sep 18 | 5:45 AM | 6 min | Excellent |\n| Sep 19 | 6:10 AM | 5 min | Good |\n| Sep 20 | 5:30 AM | 7 min | Excellent |\n\n**Viewing Tips:**\n- Look towards the northwest\n- The satellite train is most visible 30-60 minutes before sunrise\n- No special equipment needed, just your eyes!",
  hubble:
    "**Hubble Space Telescope** 🔭\n\n**Quick Facts:**\n- **Launch Date:** April 24, 1990\n- **Orbit Altitude:** 547 km\n- **Orbital Speed:** 27,000 km/h\n- **Orbital Period:** 95-96 minutes\n\n**Current Status:** Active and operational\n\n**Notable Achievements:**\n- Over 1.5 million observations\n- Contributed to 19,000+ scientific papers\n- Helped determine the age of the universe (13.8 billion years)\n\nHubble makes approximately **15 orbits** around Earth per day. Would you like to track its current position?",
  best:
    "**Best Conditions for Satellite Viewing:**\n\n**Optimal Times:**\n- **30-60 min before sunrise** (morning passes)\n- **30-60 min after sunset** (evening passes)\n\n**Weather Requirements:**\n- Clear skies (no clouds)\n- Low humidity\n- Away from city lights when possible\n\n**What to Look For:**\n- Steady moving light (not blinking like aircraft)\n- Travels in a straight line across the sky\n- May fade in and out as it enters Earth's shadow\n\n**Tools:**\n- Use SatFinder's map view to track real-time positions\n- Enable notifications for pass alerts\n\nWould you like me to check the viewing conditions for tonight?",
};

function getAIResponse(query: string): string {
  const lower = query.toLowerCase();
  if (lower.includes("iss") || lower.includes("space station"))
    return mockResponses.iss;
  if (lower.includes("starlink") || lower.includes("spacex"))
    return mockResponses.starlink;
  if (lower.includes("hubble") || lower.includes("telescope"))
    return mockResponses.hubble;
  if (lower.includes("best") || lower.includes("view") || lower.includes("visible"))
    return mockResponses.best;
  return `That's a great question! Based on my analysis:\n\n**Your Query:** "${query}"\n\nI can provide detailed information about satellite tracking, orbital mechanics, and space observations. Try asking me about:\n\n- Specific satellites (ISS, Hubble, Starlink)\n- Pass predictions for your location\n- Best viewing conditions\n- Space facts and missions\n\nWould you like to know more about any of these topics?`;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(2);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    return () => {
      setIsTyping(false);
    };
  }, []);

  const handleSend = (text?: string) => {
    const query = text || input;
    if (!query.trim()) return;

    const userMessage: Message = {
      id: nextId.current++,
      role: "user",
      content: query,
      timestamp: new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const aiMessage: Message = {
        id: nextId.current++,
        role: "assistant",
        content: getAIResponse(query),
        timestamp: new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="h-14 border-b border-card-border bg-card-bg flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-foreground">SatQuery AI</h2>
              <p className="text-xs text-green-500">Online</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Satellite className="w-4 h-4 text-muted" />
            <span className="text-xs text-muted">Satellite Knowledge Base</span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 chat-scroll">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}
            >
              {msg.role === "assistant" && (
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
              <div
                className={`max-w-2xl rounded-2xl px-4 py-3 ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-card-bg border border-card-border text-foreground"
                }`}
              >
                <div className="text-sm whitespace-pre-wrap leading-relaxed">
                  {msg.content.split("**").map((part, i) =>
                    i % 2 === 1 ? (
                      <strong key={i}>{part}</strong>
                    ) : (
                      <span key={i}>{part}</span>
                    )
                  )}
                </div>
                <div
                  className={`flex items-center gap-2 mt-2 ${
                    msg.role === "user" ? "justify-end" : ""
                  }`}
                >
                  <span
                    className={`text-xs ${
                      msg.role === "user" ? "text-white/60" : "text-muted"
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                  {msg.role === "assistant" && (
                    <div className="flex items-center gap-1">
                      <button className="p-0.5 hover:bg-input-bg rounded">
                        <Copy className="w-3 h-3 text-muted" />
                      </button>
                      <button className="p-0.5 hover:bg-input-bg rounded">
                        <ThumbsUp className="w-3 h-3 text-muted" />
                      </button>
                      <button className="p-0.5 hover:bg-input-bg rounded">
                        <ThumbsDown className="w-3 h-3 text-muted" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              {msg.role === "user" && (
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-card-bg border border-card-border rounded-2xl px-4 py-3">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-muted rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-muted rounded-full animate-bounce [animation-delay:0.1s]" />
                  <div className="w-2 h-2 bg-muted rounded-full animate-bounce [animation-delay:0.2s]" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts */}
        <div className="px-6 py-2 flex gap-2 overflow-x-auto">
          {quickPrompts.map((prompt) => (
            <button
              key={prompt}
              onClick={() => handleSend(prompt)}
              className="px-4 py-2 bg-card-bg border border-card-border rounded-full text-xs text-muted hover:text-foreground hover:border-blue-300 transition-all whitespace-nowrap flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3" />
              {prompt}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-card-border bg-card-bg">
          <div className="flex items-center gap-3 max-w-4xl mx-auto">
            <div className="flex-1 flex items-center gap-2 bg-input-bg rounded-xl px-4 py-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask about satellites, orbits, pass times..."
                className="bg-transparent text-sm text-foreground placeholder:text-muted outline-none flex-1"
              />
            </div>
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isTyping}
              className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-80 border-l border-card-border bg-card-bg p-6 overflow-y-auto">
        <h3 className="text-sm font-bold text-foreground mb-4">
          Suggested Questions
        </h3>
        <div className="space-y-3 mb-8">
          {[
            "What's the current position of ISS?",
            "When is the next Starlink pass?",
            "Tell me about Mars missions",
            "How do satellites stay in orbit?",
            "What is orbital decay?",
          ].map((q) => (
            <button
              key={q}
              onClick={() => handleSend(q)}
              className="w-full text-left p-3 bg-input-bg rounded-lg text-sm text-muted hover:text-foreground hover:bg-background transition-colors"
            >
              {q}
            </button>
          ))}
        </div>

        <h3 className="text-sm font-bold text-foreground mb-4">
          Quick Stats
        </h3>
        <div className="space-y-3">
          {[
            { icon: Satellite, label: "Tracked Satellites", value: "12" },
            { icon: MapPin, label: "Saved Locations", value: "6" },
            { icon: Clock, label: "Tracking Hours", value: "47h" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex items-center gap-3 p-3 bg-input-bg rounded-lg"
            >
              <stat.icon className="w-5 h-5 text-blue-500" />
              <div className="flex-1">
                <p className="text-xs text-muted">{stat.label}</p>
                <p className="text-sm font-bold text-foreground">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
