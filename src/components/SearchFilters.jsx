import { useMemo } from 'react';

const SOLVED_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'solved', label: 'Solved' },
  { value: 'unsolved', label: 'Unsolved' },
];

const DATE_PRESETS = [
  { value: 'all', label: 'Any time' },
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'Past week' },
  { value: 'month', label: 'Past month' },
  { value: 'quarter', label: 'Past 3 months' },
  { value: 'year', label: 'Past year' },
];

function getDateRange(preset) {
  const now = Date.now();
  switch (preset) {
    case 'today':
      return new Date(now - 86400000);
    case 'week':
      return new Date(now - 604800000);
    case 'month':
      return new Date(now - 2592000000);
    case 'quarter':
      return new Date(now - 7776000000);
    case 'year':
      return new Date(now - 31536000000);
    default:
      return null;
  }
}

export { getDateRange, DATE_PRESETS, SOLVED_OPTIONS };

export default function SearchFilters({
  tags,
  activeTag,
  onTagChange,
  solvedFilter,
  onSolvedChange,
  datePreset,
  onDatePresetChange,
}) {
  const sortedTags = useMemo(
    () => [...tags].sort((a, b) => a.localeCompare(b)),
    [tags]
  );

  return (
    <div className="podc-search-filters">
      <div className="podc-filter-group">
        <label className="podc-filter-label">Solved Status</label>
        <div className="podc-filter-chips">
          {SOLVED_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={`podc-chip ${solvedFilter === opt.value ? 'is-active' : ''}`}
              onClick={() => onSolvedChange(opt.value)}
            >
              {opt.value === 'solved' && (
                <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" aria-hidden="true">
                  <path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2Z" />
                </svg>
              )}
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="podc-filter-group">
        <label className="podc-filter-label">Date Range</label>
        <div className="podc-filter-chips">
          {DATE_PRESETS.map((preset) => (
            <button
              key={preset.value}
              type="button"
              className={`podc-chip ${datePreset === preset.value ? 'is-active' : ''}`}
              onClick={() => onDatePresetChange(preset.value)}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      <div className="podc-filter-group">
        <label className="podc-filter-label">Tags</label>
        <div className="podc-filter-chips podc-tag-chips">
          <button
            type="button"
            className={`podc-chip ${activeTag === null ? 'is-active' : ''}`}
            onClick={() => onTagChange(null)}
          >
            All Tags
          </button>
          {sortedTags.map((tag) => (
            <button
              key={tag}
              type="button"
              className={`podc-chip ${activeTag === tag ? 'is-active' : ''}`}
              onClick={() => onTagChange(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
