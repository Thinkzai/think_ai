import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ToastProvider } from '../components/Toast.jsx';
import ModerationDashboard from '../components/ModerationDashboard.jsx';

vi.mock('../services/forumApi.js', () => ({
  ForumApi: {
    getPosts: vi.fn(),
    getUsers: vi.fn(),
    getTags: vi.fn(),
  },
}));

vi.mock('../services/moderationService.js', () => ({
  ModerationService: {
    getAllModerationItems: vi.fn(),
    getStats: vi.fn(),
    approvePost: vi.fn(),
    removePost: vi.fn(),
    warnUser: vi.fn(),
    initializeMockData: vi.fn(),
  },
}));

import { ForumApi } from '../services/forumApi.js';
import { ModerationService } from '../services/moderationService.js';

const mockPosts = [
  { id: 'p4', authorId: 'u4', title: 'Test Post', content: 'Test content', tags: ['React'], upvotes: 5, downvotes: 0, views: 100, replies: 2, isSolved: false, isPinned: false, createdAt: '2026-08-05T09:12:00Z' },
];

const mockUsers = [
  { id: 'u1', username: 'alice', displayName: 'Alice', avatar: '', role: 'Dev' },
  { id: 'u4', username: 'mia', displayName: 'Mia', avatar: '', role: 'Dev' },
];

const mockItems = [
  { id: 'mod_1', postId: 'p4', reason: 'Off-topic', reportedBy: 'u1', status: 'pending', createdAt: '2026-08-18T10:00:00Z', reviewedAt: null, reviewedBy: null, action: null },
];

const mockStats = { pending: 1, approved: 0, removed: 0, warned: 0, total: 1 };

function renderDashboard() {
  return render(
    <ToastProvider>
      <ModerationDashboard />
    </ToastProvider>
  );
}

describe('ModerationDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    ForumApi.getPosts.mockResolvedValue(mockPosts);
    ForumApi.getUsers.mockResolvedValue(mockUsers);
    ForumApi.getTags.mockResolvedValue([]);
    ModerationService.getAllModerationItems.mockResolvedValue(mockItems);
    ModerationService.getStats.mockResolvedValue(mockStats);
    ModerationService.approvePost.mockResolvedValue({ ...mockItems[0], status: 'approved' });
    ModerationService.removePost.mockResolvedValue({ ...mockItems[0], status: 'removed' });
    ModerationService.warnUser.mockResolvedValue({ ...mockItems[0], status: 'warned' });
  });

  it('renders the dashboard title', async () => {
    renderDashboard();
    expect(screen.getByText('Moderation Dashboard')).toBeInTheDocument();
    expect(screen.getByText(/Review flagged content/)).toBeInTheDocument();
  });

  it('shows loading state initially', () => {
    renderDashboard();
    expect(screen.getByText(/Loading moderation queue/)).toBeInTheDocument();
  });

  it('renders stats after loading', async () => {
    renderDashboard();
    await waitFor(() => {
      expect(screen.getAllByText('Pending').length).toBeGreaterThanOrEqual(1);
    });
    expect(screen.getAllByText('Approved').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Removed').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Total').length).toBeGreaterThanOrEqual(1);
  });

  it('renders moderation items after loading', async () => {
    renderDashboard();
    await waitFor(() => {
      expect(screen.getByTestId('mod-item')).toBeInTheDocument();
    });
    expect(screen.getByText('Off-topic')).toBeInTheDocument();
    expect(screen.getByText('Test Post')).toBeInTheDocument();
  });

  it('renders filter buttons', async () => {
    renderDashboard();
    await waitFor(() => {
      expect(screen.getAllByText('Pending').length).toBeGreaterThanOrEqual(1);
    });
    expect(screen.getByRole('button', { name: /approved/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /removed/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /all/i })).toBeInTheDocument();
  });

  it('renders action buttons for pending items', async () => {
    renderDashboard();
    await waitFor(() => {
      expect(screen.getByTestId('mod-item')).toBeInTheDocument();
    });
    expect(screen.getByRole('button', { name: /approve$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /warn user/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /remove$/i })).toBeInTheDocument();
  });

  it('calls approvePost when approve button is clicked', async () => {
    const user = userEvent.setup();
    renderDashboard();
    await waitFor(() => {
      expect(screen.getByTestId('mod-item')).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /approve$/i }));
    expect(ModerationService.approvePost).toHaveBeenCalledWith('mod_1', 'u4');
  });

  it('shows link to view the reported post', async () => {
    renderDashboard();
    await waitFor(() => {
      expect(screen.getByRole('link', { name: 'View Post' })).toHaveAttribute('href', '#/post/p4');
    });
  });

  it('shows empty state when no items match filter', async () => {
    ModerationService.getAllModerationItems.mockResolvedValue([
      { ...mockItems[0], status: 'approved' },
    ]);
    ModerationService.getStats.mockResolvedValue({ pending: 0, approved: 1, removed: 0, warned: 0, total: 1 });
    renderDashboard();
    await waitFor(() => {
      expect(screen.getByText('No pending items.')).toBeInTheDocument();
    });
  });
});
