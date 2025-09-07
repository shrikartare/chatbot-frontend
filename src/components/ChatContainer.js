import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ChatContainer.module.css";
import ChatInput from "./ChatInput/ChatInput";
import { LOCALES } from "../constants/locales";
import { API_BASE_URL } from "../apiConfig";

const ChatContainer = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [locale, setLocale] = useState(LOCALES[0].value);

  const onInputChange = (inputValue) => {
    setInput(inputValue);
  };
const onSubmitChat = async () => {
  if (!input.trim() || isLoading) return;

  const question = input;
  setMessages([...messages, { content: question, role: "user" }]);
  setInput("");
  setIsLoading(true);

  try {
    const response = await fetch(`${API_BASE_URL}/${locale}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question,
        messages,
      }),
    });

    if (!response.ok || !response.body) {
      throw new Error("Streaming response failed");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");

    let partialMessage = "";

    // Add an assistant message placeholder we will keep updating
    setMessages((prev) => [
      ...prev,
      { content: "", role: "assistant" },
    ]);

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      partialMessage += chunk;

      // Update the last assistant message in state
      setMessages((prev) => {
        const updated = [...prev];
        const last = updated[updated.length - 1];
        if (last.role === "assistant") {
          last.content = partialMessage;
        }
        return updated;
      });
    }
  } catch (error) {
    console.error("❌ Streaming error:", error);
  } finally {
    setIsLoading(false);
  }
};


  const onLocaleChange = async (e) => {
    setInput("");
    setMessages([]);
    setLocale(e.target.value);
  };
  return (
    <>
      <div className={styles.chatContainer}>
        <div className={styles.chatLocaleBar}>
          <label
            className={styles.chatLocaleLabel}
            htmlFor="chat-locale-select"
          >
            Locale:
          </label>
          <select
            id="chat-locale-select"
            className={styles.chatLocaleSelect}
            value={locale}
            onChange={(e) => onLocaleChange(e)}
          >
            {LOCALES.map((loc) => (
              <option key={loc.value} value={loc.value}>
                {loc.label}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.chatMessageContainer}>
          {messages.map((message, index) => {
            return (
              <div
                key={index}
                className={message?.role === "user" ? styles.userMessage : styles.assistantMessage}
                dangerouslySetInnerHTML={{__html: message?.content}}
              ></div>
            );
          })}
        </div>
        <div className={styles.chatInputContainer}>
          <ChatInput
            inputValue={input}
            onSubmitChat={() => onSubmitChat(locale)}
            onInputChange={onInputChange}
            isLoading={isLoading}
          />
        </div>
      </div>
    </>
  );
};

export default ChatContainer;
