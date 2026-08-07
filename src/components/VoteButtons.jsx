export default function VoteButtons({ upvotes, downvotes, onVote, disabled }) {
  return (
    <div className="vote-buttons" aria-label="Post votes">
      <button
        className="vote-btn vote-up"
        type="button"
        aria-label="Upvote"
        title="Upvote"
        disabled={disabled}
        onClick={() => onVote('up')}
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
          <path d="M12 5 3.5 14.5h5V19h7v-4.5h5L12 5Z" />
        </svg>
        <span className="vote-count">{upvotes}</span>
      </button>
      <span className="vote-divider" aria-hidden="true" />
      <button
        className="vote-btn vote-down"
        type="button"
        aria-label="Downvote"
        title="Downvote"
        disabled={disabled}
        onClick={() => onVote('down')}
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
          <path d="M12 19 3.5 9.5h5v-4.5h7v4.5h5L12 19Z" />
        </svg>
        <span className="vote-count">{downvotes}</span>
      </button>
    </div>
  );
}
