import VoteButtons from './VoteButtons.jsx';
import UserProfile from './UserProfile.jsx';

function timeAgo(dateString) {
  const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
  const units = [
    { name: 'year', seconds: 31536000 },
    { name: 'month', seconds: 2592000 },
    { name: 'week', seconds: 604800 },
    { name: 'day', seconds: 86400 },
    { name: 'hour', seconds: 3600 },
    { name: 'minute', seconds: 60 },
  ];
  for (const unit of units) {
    const count = Math.floor(seconds / unit.seconds);
    if (count >= 1) {
      return `${count} ${unit.name}${count === 1 ? '' : 's'} ago`;
    }
  }
  return 'just now';
}

export default function ForumCard({ post, author, voting, onVote, onToggleSolved }) {
  const disabled = voting;

  return (
    <article className={post.isSolved ? 'forum-card is-solved' : 'forum-card'}>
      <div className="forum-card-main">
        <div className="forum-card-vote">
          <VoteButtons
            upvotes={post.upvotes}
            downvotes={post.downvotes}
            onVote={onVote}
            disabled={disabled}
          />
        </div>

        <div className="forum-card-content">
          <div className="forum-card-head">
            {post.isPinned && <span className="badge badge-pinned">Pinned</span>}
            {post.isSolved && (
              <span className="badge badge-solved">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
                  <path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2Z" />
                </svg>
                Solved
              </span>
            )}
          </div>

          <h3 className="forum-card-title">
            <a href={`#/post/${post.id}`}>{post.title}</a>
          </h3>

          <p className="forum-card-excerpt">{post.content}</p>

          <div className="forum-card-tags">
            {post.tags.map((tag) => (
              <a key={tag} className="tag-chip tag-chip-sm" href={`#/tag/${tag}`}>
                {tag}
              </a>
            ))}
          </div>

          <div className="forum-card-footer">
            <UserProfile user={author} />
            <div className="forum-card-meta">
              <span>{post.views.toLocaleString()} views</span>
              <span>{post.replies} replies</span>
              <span>{timeAgo(post.createdAt)}</span>
            </div>
          </div>

          <button
            className={post.isSolved ? 'solve-btn is-solved' : 'solve-btn'}
            type="button"
            disabled={disabled}
            onClick={onToggleSolved}
          >
            {post.isSolved ? 'Mark as Unsolved' : 'Mark as Solved'}
          </button>
        </div>
      </div>
    </article>
  );
}
