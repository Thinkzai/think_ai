import { useState } from "react";
import PropTypes from "prop-types";

function ChatMessage({ message, onModerate, onRestore }) {
  const [showMenu, setShowMenu] = useState(false);

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="group flex items-start gap-2" data-testid="chat-message">
      {message.avatar ? (
        <img src={message.avatar} alt={message.senderName} className="w-7 h-7 rounded-full object-cover flex-shrink-0 mt-0.5" />
      ) : (
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0 mt-0.5">
          {getInitials(message.senderName)}
        </div>
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-white">{message.senderName || "Anonymous"}</span>
          <span className="text-[10px] text-gray-500">{formatTime(message.timestamp)}</span>
        </div>
        <p className="text-[13px] text-gray-300 mt-0.5 break-words">{message.content}</p>
      </div>

      <div className="relative flex-shrink-0">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-gray-700/50 text-gray-500 hover:text-gray-300 transition-all"
          aria-label="Message options"
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01" />
          </svg>
        </button>

        {showMenu && (
          <div className="absolute right-0 top-7 z-10 w-36 bg-[#1a2332] border border-gray-700 rounded-lg shadow-lg py-1">
            {message.isModerated ? (
              <button
                onClick={() => { onRestore(); setShowMenu(false); }}
                className="w-full text-left px-3 py-1.5 text-xs text-green-400 hover:bg-gray-800/60"
              >
                Restore Message
              </button>
            ) : (
              <button
                onClick={() => { onModerate(); setShowMenu(false); }}
                className="w-full text-left px-3 py-1.5 text-xs text-red-400 hover:bg-gray-800/60"
              >
                Hide Message
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

ChatMessage.propTypes = {
  message: PropTypes.shape({
    id: PropTypes.string.isRequired,
    senderName: PropTypes.string,
    content: PropTypes.string.isRequired,
    timestamp: PropTypes.string,
    avatar: PropTypes.string,
    isModerated: PropTypes.bool,
  }).isRequired,
  onModerate: PropTypes.func.isRequired,
  onRestore: PropTypes.func.isRequired,
};

export default ChatMessage;
