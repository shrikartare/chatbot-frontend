import React from "react";
import styles from "./ChatInput.module.css";

const ChatInput = ({ inputValue, onInputChange, onSubmitChat, isLoading, onStop }) => {
  const handleInputChange = (e) => {
    onInputChange(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !isLoading) {
      onSubmitChat();
    }
  };

  return (
    <div className={styles.chatInput}>
      <textarea
        className={styles.textarea}
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Type your message..."
        rows={3}
        disabled={isLoading}
      />
      <button
        className={styles.submitBtn}
        onClick={isLoading ? undefined : onSubmitChat}
        aria-label={isLoading ? "Loading" : "Send"}
        type="button"
        disabled={isLoading}
        style={isLoading ? { pointerEvents: "none" } : {}}
      >
        {isLoading ? (
          <span className={styles.loader} />
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 12h16M13 5l7 7-7 7" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </button>
    </div>
  );
};

export default ChatInput;
