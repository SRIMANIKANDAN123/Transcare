import { useEffect, useRef, useState } from "react";
import "./chatbot.css";

const API_URL = "http://127.0.0.1:8001/chat";

type Message = {
  role: "user" | "assistant";
  content: string;
};

function formatBotMessage(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/^\s*\*\s+(.*)$/gm, "• $1")
    .replace(/\n/g, "<br>");
}

export function TransCareChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm the Trans Care Assistant. How can I help you today?",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const conversationIdRef = useRef<string>(crypto.randomUUID());

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen) {
      textareaRef.current?.focus();
    }
  }, [isOpen]);

  function adjustTextareaHeight() {
    const textarea = textareaRef.current;

    if (!textarea) {
      return;
    }

    textarea.style.height = "auto";

    const maxHeight = 120;

    textarea.style.height = `${Math.min(
      textarea.scrollHeight,
      maxHeight,
    )}px`;

    textarea.style.overflowY =
      textarea.scrollHeight > maxHeight ? "auto" : "hidden";
  }

  async function sendMessage() {
    const trimmedMessage = message.trim();

    if (!trimmedMessage || isSending) {
      return;
    }

    setMessages((current) => [
      ...current,
      {
        role: "user",
        content: trimmedMessage,
      },
    ]);

    setMessage("");

    if (textareaRef.current) {
      textareaRef.current.style.height = "42px";
      textareaRef.current.style.overflowY = "hidden";
    }

    setIsSending(true);
    setIsTyping(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: trimmedMessage,
          conversationId: conversationIdRef.current,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      if (!response.body) {
        throw new Error("Streaming response is not supported.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      let assistantMessage = "";
      let firstChunkReceived = false;

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: "",
        },
      ]);

      while (true) {
        const { value, done } = await reader.read();

        if (done) {
          break;
        }

        const chunk = decoder.decode(value, {
          stream: true,
        });

        assistantMessage += chunk;

        if (!firstChunkReceived) {
          setIsTyping(false);
          firstChunkReceived = true;
        }

        setMessages((current) => {
          const updated = [...current];

          updated[updated.length - 1] = {
            role: "assistant",
            content: assistantMessage,
          };

          return updated;
        });
      }

      setIsTyping(false);
    } catch (error) {
      console.error("Chatbot error:", error);

      setIsTyping(false);

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            "Sorry, I couldn't connect to the Trans Care assistant. Please try again.",
        },
      ]);
    } finally {
      setIsSending(false);

      setTimeout(() => {
        textareaRef.current?.focus();
      }, 0);
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendMessage();
    }
  }

  return (
    <>
      {!isOpen && (
        <button
          type="button"
          className="transcare-chatbot-button"
          aria-label="Open Trans Care Assistant"
          onClick={() => setIsOpen(true)}
        >
          💬
        </button>
      )}

      <aside
        className={`transcare-chatbot-panel ${
          isOpen ? "transcare-chatbot-panel-open" : ""
        }`}
        aria-hidden={!isOpen}
      >
        <div className="transcare-chatbot-header">
          <div>
            <h2>Trans Care Assistant</h2>
            <span>Healthcare support assistant</span>
          </div>

          <button
            type="button"
            className="transcare-chatbot-close"
            aria-label="Close chatbot"
            onClick={() => setIsOpen(false)}
          >
            ×
          </button>
        </div>

        <div className="transcare-chatbot-messages">
          {messages.map((item, index) => (
            <div
              key={`${item.role}-${index}`}
              className={`transcare-chatbot-message ${
                item.role === "user"
                  ? "transcare-chatbot-user-message"
                  : "transcare-chatbot-bot-message"
              }`}
            >
              <div
                className="transcare-chatbot-message-content"
                {...(item.role === "assistant"
                  ? {
                      dangerouslySetInnerHTML: {
                        __html: formatBotMessage(item.content),
                      },
                    }
                  : {})}
              >
                {item.role === "user" ? item.content : null}
              </div>
            </div>
          ))}

          <div ref={messagesEndRef} />
        </div>

        {isTyping && (
          <div className="transcare-chatbot-typing">
            <span />
            <span />
            <span />
          </div>
        )}

        <div className="transcare-chatbot-input-area">
          <textarea
            ref={textareaRef}
            value={message}
            disabled={isSending}
            rows={1}
            placeholder="Type your message..."
            onChange={(event) => {
              setMessage(event.target.value);
              adjustTextareaHeight();
            }}
            onKeyDown={handleKeyDown}
          />

          <button
            type="button"
            disabled={isSending || !message.trim()}
            aria-label="Send message"
            onClick={() => void sendMessage()}
          >
            ➤
          </button>
        </div>
      </aside>
    </>
  );
}