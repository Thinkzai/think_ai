import { useState } from "react";
import PropTypes from "prop-types";

function PollPanel({ isHost, onCreatePoll, onVote, activePoll }) {
  const [showCreate, setShowCreate] = useState(false);
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);

  const handleCreate = () => {
    if (!question.trim() || options.filter((o) => o.trim()).length < 2) return;
    onCreatePoll({ question: question.trim(), options: options.filter((o) => o.trim()) });
    setQuestion("");
    setOptions(["", ""]);
    setShowCreate(false);
  };

  const handleVote = (pollId, idx) => {
    if (hasVoted) return;
    setSelectedOption(idx);
    setHasVoted(true);
    onVote(pollId, idx);
  };

  const addOption = () => { if (options.length < 6) setOptions([...options, ""]); };
  const removeOption = (i) => { if (options.length > 2) setOptions(options.filter((_, idx) => idx !== i)); };
  const updateOption = (i, v) => { const u = [...options]; u[i] = v; setOptions(u); };

  const poll = activePoll;

  return (
    <div className="p-4" data-testid="poll-panel">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-semibold text-white">Live Poll</h3>
        {isHost && (
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="text-[10px] px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition-colors"
          >
            {showCreate ? "Cancel" : "+ New Poll"}
          </button>
        )}
      </div>

      {showCreate && (
        <div className="mb-3 p-3 rounded-xl bg-gray-800/40 border border-gray-700">
          <input
            type="text" value={question} onChange={(e) => setQuestion(e.target.value)}
            placeholder="Enter your question..."
            className="w-full bg-gray-900/60 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 mb-2"
            aria-label="Poll question"
          />
          <div className="space-y-1.5 mb-2">
            {options.map((opt, i) => (
              <div key={i} className="flex items-center gap-2">
                <input type="text" value={opt} onChange={(e) => updateOption(i, e.target.value)}
                  placeholder={`Option ${i + 1}`}
                  className="flex-1 bg-gray-900/60 border border-gray-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50"
                  aria-label={`Poll option ${i + 1}`}
                />
                {options.length > 2 && (
                  <button onClick={() => removeOption(i)} className="p-1 text-gray-500 hover:text-red-400 transition-colors" aria-label={`Remove option ${i + 1}`}>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={addOption} disabled={options.length >= 6}
              className="text-[10px] px-2.5 py-1 rounded-lg bg-gray-700/60 text-gray-300 hover:bg-gray-600/60 disabled:opacity-40 transition-colors">
              + Option
            </button>
            <button onClick={handleCreate} disabled={!question.trim() || options.filter((o) => o.trim()).length < 2}
              className="text-[10px] px-3 py-1 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 disabled:opacity-40 transition-colors ml-auto">
              Launch
            </button>
          </div>
        </div>
      )}

      {poll ? (
        <div className="p-3 rounded-xl bg-gray-800/30 border border-gray-700/50">
          <div className="flex items-center gap-1.5 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-[10px] font-medium text-green-400">Active Poll</span>
          </div>
          <p className="text-xs font-medium text-white mb-3">{poll.question}</p>
          <div className="space-y-1.5">
            {poll.options.map((opt, i) => (
              <button key={i} onClick={() => handleVote(poll.id, i)} disabled={hasVoted}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all ${
                  hasVoted && selectedOption === i
                    ? "bg-cyan-500/20 border border-cyan-500/40 text-cyan-300"
                    : hasVoted ? "bg-gray-800/40 border border-gray-700/50 text-gray-400"
                    : "bg-gray-800/40 border border-gray-700/50 text-gray-300 hover:bg-gray-700/40"
                }`}>
                <div className="flex items-center justify-between">
                  <span>{opt}</span>
                  {hasVoted && selectedOption === i && <span className="text-[10px] text-gray-500">Your vote</span>}
                </div>
                {hasVoted && (
                  <div className="mt-1 h-1 rounded-full bg-gray-700 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500 transition-all duration-500"
                      style={{ width: `${selectedOption === i ? 45 : i === 0 ? 10 : i === 1 ? 35 : 10}%` }} />
                  </div>
                )}
              </button>
            ))}
          </div>
          {hasVoted && <p className="text-[10px] text-gray-500 mt-2 text-center">12 votes total</p>}
        </div>
      ) : (
        <div className="flex items-center justify-center h-20 rounded-xl bg-gray-800/20 border border-gray-700/30">
          <p className="text-gray-500 text-xs">No active poll</p>
        </div>
      )}
    </div>
  );
}

PollPanel.propTypes = {
  isHost: PropTypes.bool.isRequired,
  onCreatePoll: PropTypes.func.isRequired,
  onVote: PropTypes.func.isRequired,
  activePoll: PropTypes.shape({
    id: PropTypes.string.isRequired,
    question: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(PropTypes.string).isRequired,
  }),
};

export default PollPanel;
