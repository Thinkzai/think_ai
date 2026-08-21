import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import ForumSearch from '../components/ForumSearch.jsx';

const defaultProps = {
  searchMode: 'keyword',
  onSearchModeChange: vi.fn(),
  query: '',
  onQueryChange: vi.fn(),
  authorFilter: '',
  onAuthorFilterChange: vi.fn(),
  authorSuggestions: [],
};

describe('ForumSearch', () => {
  it('renders three search mode tabs', () => {
    render(<ForumSearch {...defaultProps} />);
    expect(screen.getByRole('tab', { name: /keyword/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /tag/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /author/i })).toBeInTheDocument();
  });

  it('marks the active tab correctly', () => {
    render(<ForumSearch {...defaultProps} searchMode="tag" />);
    expect(screen.getByRole('tab', { name: /tag/i })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: /keyword/i })).toHaveAttribute('aria-selected', 'false');
  });

  it('calls onSearchModeChange when a tab is clicked', async () => {
    const user = userEvent.setup();
    const onSearchModeChange = vi.fn();
    render(<ForumSearch {...defaultProps} onSearchModeChange={onSearchModeChange} />);
    await user.click(screen.getByRole('tab', { name: /author/i }));
    expect(onSearchModeChange).toHaveBeenCalledWith('author');
  });

  it('displays keyword placeholder in keyword mode', () => {
    render(<ForumSearch {...defaultProps} />);
    expect(screen.getByPlaceholderText(/Search by keyword/)).toBeInTheDocument();
  });

  it('displays tag placeholder in tag mode', () => {
    render(<ForumSearch {...defaultProps} searchMode="tag" />);
    expect(screen.getByPlaceholderText(/Search by tag/)).toBeInTheDocument();
  });

  it('displays author placeholder in author mode', () => {
    render(<ForumSearch {...defaultProps} searchMode="author" />);
    expect(screen.getByPlaceholderText(/Search by author/)).toBeInTheDocument();
  });

  it('calls onQueryChange when typing in keyword mode', async () => {
    const user = userEvent.setup();
    const onQueryChange = vi.fn();
    render(<ForumSearch {...defaultProps} onQueryChange={onQueryChange} />);
    await user.type(screen.getByRole('searchbox'), 'react hooks');
    expect(onQueryChange).toHaveBeenCalled();
  });

  it('calls onAuthorFilterChange when typing in author mode', async () => {
    const user = userEvent.setup();
    const onAuthorFilterChange = vi.fn();
    render(
      <ForumSearch
        {...defaultProps}
        searchMode="author"
        onAuthorFilterChange={onAuthorFilterChange}
      />
    );
    await user.type(screen.getByRole('searchbox'), 'alex');
    expect(onAuthorFilterChange).toHaveBeenCalled();
  });

  it('shows author suggestions when in author mode with filter text', () => {
    const suggestions = [
      { id: 'u1', username: 'alex', displayName: 'Alex', avatar: '', role: 'Dev' },
    ];
    render(
      <ForumSearch
        {...defaultProps}
        searchMode="author"
        authorFilter="al"
        authorSuggestions={suggestions}
      />
    );
    expect(screen.getByText('Alex')).toBeInTheDocument();
    expect(screen.getByText('@alex')).toBeInTheDocument();
  });

  it('clears query when switching search modes', async () => {
    const user = userEvent.setup();
    const onQueryChange = vi.fn();
    const onAuthorFilterChange = vi.fn();
    render(
      <ForumSearch
        {...defaultProps}
        searchMode="keyword"
        onQueryChange={onQueryChange}
        onAuthorFilterChange={onAuthorFilterChange}
      />
    );
    await user.click(screen.getByRole('tab', { name: /tag/i }));
    expect(onQueryChange).toHaveBeenCalledWith('');
    expect(onAuthorFilterChange).toHaveBeenCalledWith('');
  });
});
