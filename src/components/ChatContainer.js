import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ChatContainer.module.css";
import ChatInput from "./ChatInput/ChatInput";
import { LOCALES } from "../constants/locales";

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
    let results;
    if (!input.trim() || isLoading) return;
    const question = input;
    setMessages([...messages, { content: question, role: "user" }]);
    setInput("");
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/${locale}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: question,
          messages,
        }),
      });
      if (response.status === 200) {
        results = await response.json();
        setMessages([
          ...messages,
          { content: question, role: "user" },
          { content: results.answer, role: "assistant" },
        ]);
      }
     setInput("");
    } catch (error) {
      console.log("error", error);
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
                className={message?.role === "user" ? styles.userMessage : ""}
              >
                {message?.content}
              </div>
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
