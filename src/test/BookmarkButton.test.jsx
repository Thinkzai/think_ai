import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import BookmarkButton from '../components/BookmarkButton.jsx';
import { BookmarkService } from '../services/bookmarkService.js';

describe('BookmarkButton', () => {
  it('renders unbookmarked state by default', async () => {
    render(<BookmarkButton postId="p1" />);
    expect(await screen.findByRole('button', { name: /add bookmark/i })).toBeInTheDocument();
  });

  it('renders bookmarked state when post is bookmarked', async () => {
    await BookmarkService.addBookmark('p1');
    render(<BookmarkButton postId="p1" />);
    expect(await screen.findByRole('button', { name: /remove bookmark/i })).toBeInTheDocument();
  });

  it('toggles bookmark state on click', async () => {
    const user = userEvent.setup();
    render(<BookmarkButton postId="p1" />);
    const btn = await screen.findByRole('button', { name: /add bookmark/i });
    await user.click(btn);
    expect(await screen.findByRole('button', { name: /remove bookmark/i })).toBeInTheDocument();
  });

  it('removes bookmark on second click', async () => {
    const user = userEvent.setup();
    await BookmarkService.addBookmark('p1');
    render(<BookmarkButton postId="p1" />);
    const btn = await screen.findByRole('button', { name: /remove bookmark/i });
    await user.click(btn);
    expect(await screen.findByRole('button', { name: /add bookmark/i })).toBeInTheDocument();
  });

  it('calls onBookmarkChange callback', async () => {
    const user = userEvent.setup();
    const onBookmarkChange = vi.fn();
    render(<BookmarkButton postId="p1" onBookmarkChange={onBookmarkChange} />);
    const btn = await screen.findByRole('button', { name: /add bookmark/i });
    await user.click(btn);
    await waitFor(() => {
      expect(onBookmarkChange).toHaveBeenCalledWith({ postId: 'p1', bookmarked: true });
    });
  });

  it('has aria-pressed attribute', async () => {
    render(<BookmarkButton postId="p1" />);
    const btn = await screen.findByRole('button', { name: /bookmark/i });
    expect(btn).toHaveAttribute('aria-pressed', 'false');
  });

  it('sets aria-pressed to true when bookmarked', async () => {
    await BookmarkService.addBookmark('p1');
    render(<BookmarkButton postId="p1" />);
    const btn = await screen.findByRole('button', { name: /remove bookmark/i });
    expect(btn).toHaveAttribute('aria-pressed', 'true');
  });

  it('persists bookmark across remounts (simulating logout/login)', async () => {
    const user = userEvent.setup();
    const { unmount } = render(<BookmarkButton postId="p99" />);
    const btn = await screen.findByRole('button', { name: /add bookmark/i });
    await user.click(btn);
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /remove bookmark/i })).toBeInTheDocument();
    });
    unmount();

    const { unmount: unmount2 } = render(<BookmarkButton postId="p99" />);
    expect(await screen.findByRole('button', { name: /remove bookmark/i })).toBeInTheDocument();
    unmount2();
  });
});
