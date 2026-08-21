import BookmarkButton from './BookmarkButton.jsx';

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

function ResultCard({ post, author }) {
  return (
    <article className={`podc-result-card ${post.isSolved ? 'is-solved' : ''}`}>
      <div className="podc-result-header">
        {post.isPinned && <span className="podc-badge podc-badge-pinned">Pinned</span>}
        {post.isSolved && (
          <span className="podc-badge podc-badge-solved">
            <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" aria-hidden="true">
              <path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2Z" />
            </svg>
            Solved
          </span>
        )}
      </div>

      <h3 className="podc-result-title">
        <a href={`#/post/${post.id}`}>{post.title}</a>
      </h3>

      <p className="podc-result-excerpt">{post.content}</p>

      <div className="podc-result-tags">
        {post.tags.map((tag) => (
          <a key={tag} className="podc-tag-chip-sm" href={`#/tag/${tag}`}>
            {tag}
          </a>
        ))}
      </div>

      <div className="podc-result-footer">
        <div className="podc-result-author">
          {author && (
            <>
              <img src={author.avatar} alt="" className="podc-result-avatar" width="24" height="24" />
              <span className="podc-result-author-name">{author.displayName}</span>
            </>
          )}
        </div>
        <div className="podc-result-meta">
          <span>{post.upvotes - post.downvotes} votes</span>
          <span>{post.views.toLocaleString()} views</span>
          <span>{post.replies} replies</span>
          <span>{timeAgo(post.createdAt)}</span>
        </div>
        <BookmarkButton postId={post.id} />
      </div>
    </article>
  );
}

export default function SearchResults({ results, userMap, totalCount, searchTime }) {
  if (results.length === 0) return null;

  return (
    <div className="podc-search-results">
      <div className="podc-results-header">
        <span className="podc-results-count">
          {totalCount} result{totalCount === 1 ? '' : 's'}
          {searchTime !== null && <span className="podc-search-time"> ({searchTime}ms)</span>}
        </span>
      </div>
      <div className="podc-results-list">
        {results.map((post) => (
          <ResultCard key={post.id} post={post} author={userMap.get(post.authorId)} />
        ))}
      </div>
    </div>
  );
}
