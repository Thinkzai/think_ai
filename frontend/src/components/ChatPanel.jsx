import { useState, useRef, useEffect, useCallback } from "react";
import ChatMessage from "./ChatMessage";

function ChatPanel({ messages, onSendMessage }) {
  const [inputValue, setInputValue] = useState("");
  const [moderatedIds, setModeratedIds] = useState(new Set());
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSend = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    onSendMessage(trimmed);
    setInputValue("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleModerate = (id) => setModeratedIds((prev) => new Set([...prev, id]));
  const handleRestore = (id) =>
    setModeratedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });

  const visible = messages.filter((m) => !moderatedIds.has(m.id));

  return (
    <div className="flex flex-col h-full" data-testid="chat-panel">
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2.5">
        {visible.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 text-xs text-center">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          visible.map((msg) => (
            <ChatMessage
              key={msg.id}
              message={msg}
              onModerate={() => handleModerate(msg.id)}
              onRestore={() => handleRestore(msg.id)}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="px-3 py-2 border-t border-gray-800">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-1 bg-gray-800/60 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-colors"
            aria-label="Chat message input"
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim()}
            aria-label="Send message"
            className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatPanel;
