import React, { useState } from "react";
import { API_BASE_URL } from "../../apiConfig";
import styles from "./ChatContainer.module.css";
import ChatInput from "../ChatInput/ChatInput";


const ChatContainer = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const controllerRef = React.useRef(null);

  const onInputChange = (inputValue) => {
    setInput(inputValue);
  };

  const onSubmitChat = async () => {
    if (!input.trim() || isLoading) return;
    const question = input;
    setMessages([...messages, { content: question, role: "user" }]);
    setInput("");
    setIsLoading(true);
    controllerRef.current = new AbortController();
    try {
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: question,
          messages
        }),
        signal: controllerRef.current.signal,
      });
      const results = await response.json();
      setMessages([
        ...messages,
        { content: question, role: "user" },
        { content: results.answer, role: "assistant" },
      ]);
      setInput("");
    } catch (error) {
      if (error.name !== "AbortError") {
        console.log("error", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onStop = () => {
    if (controllerRef.current) {
      controllerRef.current.abort();
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className={styles.chatContainer}>
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
            onSubmitChat={onSubmitChat}
            onInputChange={onInputChange}
            isLoading={isLoading}
            onStop={onStop}
          />
        </div>
      </div>
    </>
  );
};

export default ChatContainer;
