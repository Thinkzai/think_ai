import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ForumApi } from '../services/forumApi.js';
import ForumCard from '../components/ForumCard.jsx';
import TagFilter from '../components/TagFilter.jsx';

function LoadingSpinner() {
  return (
    <div className="loading" role="status" aria-live="polite">
      <span className="spinner" aria-hidden="true" />
      <span>Loading forum posts…</span>
    </div>
  );
}

export default function CommunityForum() {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [tags, setTags] = useState([]);
  const [activeTag, setActiveTag] = useState(null);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [votingId, setVotingId] = useState(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    Promise.all([ForumApi.getPosts(), ForumApi.getUsers(), ForumApi.getTags()])
      .then(([postsData, usersData, tagsData]) => {
        if (!mounted.current) return;
        setPosts(postsData);
        setUsers(usersData);
        setTags(tagsData);
      })
      .catch((err) => {
        if (!mounted.current) return;
        setError(err.message ?? 'Failed to load forum data');
      })
      .finally(() => {
        if (mounted.current) setLoading(false);
      });

    return () => {
      mounted.current = false;
    };
  }, []);

  const userById = useMemo(() => {
    const map = new Map();
    users.forEach((u) => map.set(u.id, u));
    return map;
  }, [users]);

  const handleVote = useCallback(
    async (postId, direction) => {
      setVotingId(postId);
      setError(null);
      try {
        const updated = await ForumApi.votePost(postId, direction);
        setPosts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      } catch (err) {
        setError(err.message ?? 'Could not record your vote');
      } finally {
        setVotingId(null);
      }
    },
    []
  );

  const handleToggleSolved = useCallback(async (postId) => {
    setVotingId(postId);
    setError(null);
    try {
      const updated = await ForumApi.toggleSolved(postId);
      setPosts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    } catch (err) {
      setError(err.message ?? 'Could not update solved status');
    } finally {
      setVotingId(null);
    }
  }, []);

  const visiblePosts = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((post) => {
      const matchesTag = activeTag === null || post.tags.includes(activeTag);
      const matchesQuery =
        q.length === 0 ||
        post.title.toLowerCase().includes(q) ||
        post.content.toLowerCase().includes(q) ||
        post.tags.some((tag) => tag.toLowerCase().includes(q));
      return matchesTag && matchesQuery;
    });
  }, [posts, activeTag, query]);

  return (
    <div className="forum-page">
      <header className="forum-hero">
        <h1 className="forum-title">Community Forum</h1>
        <p className="forum-subtitle">
          Ask questions, share solutions, and upvote the answers that help.
        </p>
      </header>

      <div className="forum-search-row">
        <label className="search-box">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
            <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.79l5 4.99L20.49 19l-4.99-5Zm-6 0A4.5 4.5 0 1 1 14 9.5 4.5 4.5 0 0 1 9.5 14Z" />
          </svg>
          <input
            type="search"
            placeholder="Search posts by title, content, or tag…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search posts"
          />
        </label>
      </div>

      <TagFilter tags={tags} activeTag={activeTag} onSelect={setActiveTag} />

      {error && (
        <div className="alert alert-error" role="alert">
          {error}
        </div>
      )}

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="forum-list-header">
            <span className="forum-count">
              {visiblePosts.length} post{visiblePosts.length === 1 ? '' : 's'}
              {activeTag ? ` tagged “${activeTag}”` : ''}
            </span>
            <span className="forum-sort">Newest</span>
          </div>

          {visiblePosts.length === 0 ? (
            <div className="empty-state">
              <p>No posts match your filters. Try clearing the tag or search.</p>
              <button
                className="empty-reset"
                type="button"
                onClick={() => {
                  setActiveTag(null);
                  setQuery('');
                }}
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="forum-list">
              {visiblePosts.map((post) => (
                <ForumCard
                  key={post.id}
                  post={post}
                  author={userById.get(post.authorId)}
                  voting={votingId === post.id}
                  onVote={(direction) => handleVote(post.id, direction)}
                  onToggleSolved={() => handleToggleSolved(post.id)}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
