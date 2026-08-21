import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import SearchFilters, { getDateRange } from '../components/SearchFilters.jsx';

const defaultProps = {
  tags: ['React', 'Java', 'CSS'],
  activeTag: null,
  onTagChange: vi.fn(),
  solvedFilter: 'all',
  onSolvedChange: vi.fn(),
  datePreset: 'all',
  onDatePresetChange: vi.fn(),
};

describe('SearchFilters', () => {
  it('renders solved status chips', () => {
    render(<SearchFilters {...defaultProps} />);
    expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Solved' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Unsolved' })).toBeInTheDocument();
  });

  it('renders date preset chips', () => {
    render(<SearchFilters {...defaultProps} />);
    expect(screen.getByRole('button', { name: 'Any time' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Today' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Past week' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Past month' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Past 3 months' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Past year' })).toBeInTheDocument();
  });

  it('renders tag chips including All Tags', () => {
    render(<SearchFilters {...defaultProps} />);
    expect(screen.getByRole('button', { name: 'All Tags' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'CSS' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Java' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'React' })).toBeInTheDocument();
  });

  it('marks active solved filter', () => {
    render(<SearchFilters {...defaultProps} solvedFilter="solved" />);
    const solvedBtn = screen.getByRole('button', { name: 'Solved' });
    expect(solvedBtn.className).toContain('is-active');
  });

  it('marks active date preset', () => {
    render(<SearchFilters {...defaultProps} datePreset="week" />);
    const weekBtn = screen.getByRole('button', { name: 'Past week' });
    expect(weekBtn.className).toContain('is-active');
  });

  it('marks active tag', () => {
    render(<SearchFilters {...defaultProps} activeTag="React" />);
    const reactBtn = screen.getByRole('button', { name: 'React' });
    expect(reactBtn.className).toContain('is-active');
  });

  it('calls onSolvedChange when solved chip is clicked', async () => {
    const user = userEvent.setup();
    const onSolvedChange = vi.fn();
    render(<SearchFilters {...defaultProps} onSolvedChange={onSolvedChange} />);
    await user.click(screen.getByRole('button', { name: 'Unsolved' }));
    expect(onSolvedChange).toHaveBeenCalledWith('unsolved');
  });

  it('calls onDatePresetChange when date chip is clicked', async () => {
    const user = userEvent.setup();
    const onDatePresetChange = vi.fn();
    render(<SearchFilters {...defaultProps} onDatePresetChange={onDatePresetChange} />);
    await user.click(screen.getByRole('button', { name: 'Past month' }));
    expect(onDatePresetChange).toHaveBeenCalledWith('month');
  });

  it('calls onTagChange when tag chip is clicked', async () => {
    const user = userEvent.setup();
    const onTagChange = vi.fn();
    render(<SearchFilters {...defaultProps} onTagChange={onTagChange} />);
    await user.click(screen.getByRole('button', { name: 'Java' }));
    expect(onTagChange).toHaveBeenCalledWith('Java');
  });

  it('calls onTagChange(null) when All Tags is clicked', async () => {
    const user = userEvent.setup();
    const onTagChange = vi.fn();
    render(<SearchFilters {...defaultProps} onTagChange={onTagChange} />);
    await user.click(screen.getByRole('button', { name: 'All Tags' }));
    expect(onTagChange).toHaveBeenCalledWith(null);
  });
});

describe('getDateRange', () => {
  it('returns null for "all"', () => {
    expect(getDateRange('all')).toBeNull();
  });

  it('returns a Date for each preset', () => {
    ['today', 'week', 'month', 'quarter', 'year'].forEach((preset) => {
      const result = getDateRange(preset);
      expect(result).toBeInstanceOf(Date);
    });
  });

  it('returns progressively older dates', () => {
    const today = getDateRange('today');
    const week = getDateRange('week');
    const month = getDateRange('month');
    expect(today.getTime()).toBeGreaterThan(week.getTime());
    expect(week.getTime()).toBeGreaterThan(month.getTime());
  });
});
