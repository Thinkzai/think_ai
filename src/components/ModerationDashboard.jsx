import { useCallback, useEffect, useRef, useState } from 'react';
import { ModerationService } from '../services/moderationService.js';
import { ForumApi } from '../services/forumApi.js';
import { useToast } from './Toast.jsx';

function ModerationStats({ stats }) {
  return (
    <div className="mod-stats">
      <div className="mod-stat-card mod-stat-pending">
        <span className="mod-stat-value">{stats.pending}</span>
        <span className="mod-stat-label">Pending</span>
      </div>
      <div className="mod-stat-card mod-stat-approved">
        <span className="mod-stat-value">{stats.approved}</span>
        <span className="mod-stat-label">Approved</span>
      </div>
      <div className="mod-stat-card mod-stat-removed">
        <span className="mod-stat-value">{stats.removed}</span>
        <span className="mod-stat-label">Removed</span>
      </div>
      <div className="mod-stat-card mod-stat-total">
        <span className="mod-stat-value">{stats.total}</span>
        <span className="mod-stat-label">Total</span>
      </div>
    </div>
  );
}

function ModerationItem({ item, post, reporter, onAction }) {
  const [busy, setBusy] = useState(false);

  const handleAction = async (action) => {
    setBusy(true);
    try {
      await action();
    } finally {
      setBusy(false);
    }
  };

  return (
    <article className="mod-item" data-testid="mod-item">
      <div className="mod-item-header">
        <div className="mod-item-meta">
          <span className={`mod-status-badge mod-status-${item.status}`}>
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </span>
          <span className="mod-item-date">
            {new Date(item.createdAt).toLocaleDateString()}
          </span>
        </div>
        {item.postId && (
          <a className="mod-item-link" href={`#/post/${item.postId}`}>
            View Post
          </a>
        )}
      </div>

      <div className="mod-item-body">
        {post && (
          <div className="mod-item-post">
            <h3 className="mod-item-post-title">{post.title}</h3>
            <p className="mod-item-post-excerpt">{post.content}</p>
          </div>
        )}

        <div className="mod-item-reason">
          <strong>Reason:</strong> {item.reason}
        </div>

        {reporter && (
          <div className="mod-item-reporter">
            Reported by: <span className="mod-reporter-name">{reporter.displayName}</span>
          </div>
        )}
      </div>

      {item.status === 'pending' && (
        <div className="mod-item-actions">
          <button
            className="mod-action-btn mod-action-approve"
            type="button"
            disabled={busy}
            onClick={() => handleAction(() => onAction('approve', item.id))}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
              <path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2Z" />
            </svg>
            Approve
          </button>
          <button
            className="mod-action-btn mod-action-warn"
            type="button"
            disabled={busy}
            onClick={() => handleAction(() => onAction('warn', item.id))}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
              <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
            </svg>
            Warn User
          </button>
          <button
            className="mod-action-btn mod-action-remove"
            type="button"
            disabled={busy}
            onClick={() => handleAction(() => onAction('remove', item.id))}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
              <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
            </svg>
            Remove
          </button>
        </div>
      )}

      {item.status !== 'pending' && item.action && (
        <div className="mod-item-result">
          <span className="mod-result-label">Action taken:</span>
          <span className={`mod-result-value mod-result-${item.status}`}>
            {item.status === 'approved' && 'Content approved'}
            {item.status === 'removed' && 'Content removed'}
            {item.status === 'warned' && 'User warned'}
          </span>
        </div>
      )}
    </article>
  );
}

export default function ModerationDashboard() {
  const [items, setItems] = useState([]);
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ pending: 0, approved: 0, removed: 0, warned: 0, total: 0 });
  const [filter, setFilter] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mounted = useRef(true);
  const { toastSuccess, toastError } = useToast();

  const loadData = useCallback(async () => {
    if (!mounted.current) return;
    setLoading(true);
    setError(null);

    try {
      ModerationService.initializeMockData();
      const [itemsData, postsData, usersData, statsData] = await Promise.all([
        ModerationService.getAllModerationItems(),
        ForumApi.getPosts(),
        ForumApi.getUsers(),
        ModerationService.getStats(),
      ]);

      if (!mounted.current) return;
      setItems(itemsData);
      setPosts(postsData);
      setUsers(usersData);
      setStats(statsData);
    } catch (err) {
      if (!mounted.current) return;
      setError(err.message ?? 'Failed to load moderation data');
    } finally {
      if (mounted.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    mounted.current = true;
    loadData();
    return () => { mounted.current = false; };
  }, [loadData]);

  const handleAction = useCallback(async (action, itemId) => {
    const reviewerId = 'u4';
    try {
      if (action === 'approve') {
        await ModerationService.approvePost(itemId, reviewerId);
        toastSuccess('Post approved successfully');
      } else if (action === 'remove') {
        await ModerationService.removePost(itemId, reviewerId);
        toastSuccess('Post removed successfully');
      } else if (action === 'warn') {
        await ModerationService.warnUser(itemId, reviewerId);
        toastSuccess('User warned successfully');
      }
      await loadData();
    } catch (err) {
      toastError(err.message ?? 'Action failed');
    }
  }, [loadData, toastSuccess, toastError]);

  const filteredItems = filter === 'all'
    ? items
    : items.filter((item) => item.status === filter);

  const postById = new Map(posts.map((p) => [p.id, p]));
  const userById = new Map(users.map((u) => [u.id, u]));

  return (
    <div className="mod-page">
      <header className="mod-header">
        <h1 className="forum-title">Moderation Dashboard</h1>
        <p className="forum-subtitle">
          Review flagged content and take appropriate actions.
        </p>
      </header>

      <ModerationStats stats={stats} />

      <div className="mod-filter-bar">
        {['pending', 'approved', 'removed', 'all'].map((f) => (
          <button
            key={f}
            type="button"
            className={`mod-filter-btn ${filter === f ? 'is-active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
            {f === 'pending' && stats.pending > 0 && (
              <span className="mod-filter-count">{stats.pending}</span>
            )}
          </button>
        ))}
      </div>

      {error && (
        <div className="alert alert-error" role="alert">
          {error}
        </div>
      )}

      {loading ? (
        <div className="loading" role="status" aria-live="polite">
          <span className="spinner" aria-hidden="true" />
          <span>Loading moderation queue&#8230;</span>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="empty-state" role="status">
          <svg className="empty-state-icon" viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p className="empty-state-title">
            {filter === 'pending' ? 'No pending items.' : `No ${filter} items.`}
          </p>
          <p className="empty-state-hint">
            {filter === 'pending'
              ? 'All flagged content has been reviewed.'
              : 'Try selecting a different filter.'}
          </p>
        </div>
      ) : (
        <div className="mod-list">
          {filteredItems.map((item) => (
            <ModerationItem
              key={item.id}
              item={item}
              post={postById.get(item.postId)}
              reporter={userById.get(item.reportedBy)}
              onAction={handleAction}
            />
          ))}
        </div>
      )}
    </div>
  );
}
