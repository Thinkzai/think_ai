import { useEffect, useState } from 'react';
import { BookmarkService } from '../services/bookmarkService.js';

export default function BookmarkButton({ postId, onBookmarkChange }) {
  const [bookmarked, setBookmarked] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    BookmarkService.isBookmarked(postId).then((val) => {
      if (!cancelled) setBookmarked(val);
    });
    return () => { cancelled = true; };
  }, [postId]);

  const handleToggle = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const result = await BookmarkService.toggleBookmark(postId);
      setBookmarked(result.bookmarked);
      if (onBookmarkChange) onBookmarkChange(result);
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      className={`podc-bookmark-btn ${bookmarked ? 'is-bookmarked' : ''}`}
      type="button"
      disabled={busy}
      onClick={handleToggle}
      aria-label={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
      aria-pressed={bookmarked}
    >
      <svg viewBox="0 0 24 24" width="16" height="16" fill={bookmarked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M5 5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16l-7-3.5L5 21V5Z" />
      </svg>
      {bookmarked ? 'Bookmarked' : 'Bookmark'}
    </button>
  );
}
