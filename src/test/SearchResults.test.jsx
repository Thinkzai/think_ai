import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SearchResults from '../components/SearchResults.jsx';

const mockUserMap = new Map([
  ['u1', { id: 'u1', username: 'alex', displayName: 'Alex Rivera', avatar: '', role: 'Dev' }],
]);

const mockResults = [
  {
    id: 'p1',
    authorId: 'u1',
    title: 'React Hooks Deep Dive',
    content: 'A comprehensive guide to React hooks.',
    tags: ['React', 'Hooks'],
    upvotes: 42,
    downvotes: 3,
    views: 1200,
    replies: 8,
    isSolved: true,
    isPinned: false,
    createdAt: '2026-08-05T09:12:00Z',
  },
  {
    id: 'p2',
    authorId: 'u1',
    title: 'CSS Grid Patterns',
    content: 'Modern CSS grid layout techniques.',
    tags: ['CSS'],
    upvotes: 10,
    downvotes: 0,
    views: 300,
    replies: 2,
    isSolved: false,
    isPinned: true,
    createdAt: '2026-08-04T14:40:00Z',
  },
];

describe('SearchResults', () => {
  it('renders result count', () => {
    render(<SearchResults results={mockResults} userMap={mockUserMap} totalCount={2} searchTime={5} />);
    expect(screen.getByText(/2 results/)).toBeInTheDocument();
  });

  it('renders search time when provided', () => {
    render(<SearchResults results={mockResults} userMap={mockUserMap} totalCount={2} searchTime={5} />);
    expect(screen.getByText('(5ms)')).toBeInTheDocument();
  });

  it('renders post titles', () => {
    render(<SearchResults results={mockResults} userMap={mockUserMap} totalCount={2} searchTime={null} />);
    expect(screen.getByText('React Hooks Deep Dive')).toBeInTheDocument();
    expect(screen.getByText('CSS Grid Patterns')).toBeInTheDocument();
  });

  it('renders post excerpts', () => {
    render(<SearchResults results={mockResults} userMap={mockUserMap} totalCount={2} searchTime={null} />);
    expect(screen.getByText(/comprehensive guide/)).toBeInTheDocument();
    expect(screen.getByText(/Modern CSS grid/)).toBeInTheDocument();
  });

  it('renders tags as links', () => {
    render(<SearchResults results={mockResults} userMap={mockUserMap} totalCount={2} searchTime={null} />);
    expect(screen.getByRole('link', { name: 'React' })).toHaveAttribute('href', '#/tag/React');
    expect(screen.getByRole('link', { name: 'CSS' })).toHaveAttribute('href', '#/tag/CSS');
  });

  it('renders author name', () => {
    render(<SearchResults results={mockResults} userMap={mockUserMap} totalCount={2} searchTime={null} />);
    expect(screen.getAllByText('Alex Rivera').length).toBeGreaterThanOrEqual(1);
  });

  it('renders solved badge for solved posts', () => {
    render(<SearchResults results={mockResults} userMap={mockUserMap} totalCount={2} searchTime={null} />);
    expect(screen.getByText('Solved')).toBeInTheDocument();
  });

  it('renders pinned badge for pinned posts', () => {
    render(<SearchResults results={mockResults} userMap={mockUserMap} totalCount={2} searchTime={null} />);
    expect(screen.getByText('Pinned')).toBeInTheDocument();
  });

  it('returns null when results is empty', () => {
    const { container } = render(<SearchResults results={[]} userMap={mockUserMap} totalCount={0} searchTime={null} />);
    expect(container.innerHTML).toBe('');
  });

  it('renders bookmark buttons for each result', () => {
    render(<SearchResults results={mockResults} userMap={mockUserMap} totalCount={2} searchTime={null} />);
    const bookmarkBtns = screen.getAllByRole('button', { name: /bookmark/i });
    expect(bookmarkBtns.length).toBe(2);
  });
});
