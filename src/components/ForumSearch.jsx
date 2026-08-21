const SEARCH_MODES = [
  { value: 'keyword', label: 'Keyword', icon: 'search' },
  { value: 'tag', label: 'Tag', icon: 'tag' },
  { value: 'author', label: 'Author', icon: 'person' },
];

const SEARCH_ICONS = {
  search: (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
      <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.79l5 4.99L20.49 19l-4.99-5Zm-6 0A4.5 4.5 0 1 1 14 9.5 4.5 4.5 0 0 1 9.5 14Z" />
    </svg>
  ),
  tag: (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
      <path d="M21.41 11.58l-9-9A2 2 0 0 0 11 2H4a2 2 0 0 0-2 2v7a2 2 0 0 0 .59 1.41l9 9a2 2 0 0 0 2.82 0l7-7a2 2 0 0 0 0-2.83zM5.5 7A1.5 1.5 0 1 1 7 5.5 1.5 1.5 0 0 1 5.5 7z" />
    </svg>
  ),
  person: (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4Zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4Z" />
    </svg>
  ),
};

function AuthorSuggestions({ authors, onSelect }) {
  if (authors.length === 0) return null;
  return (
    <div className="podc-author-suggestions">
      {authors.map((u) => (
        <button
          key={u.id}
          type="button"
          className="podc-author-suggestion-item"
          onClick={() => onSelect(u.username)}
        >
          <img src={u.avatar} alt="" className="podc-author-avatar" width="24" height="24" />
          <span className="podc-author-name">{u.displayName}</span>
          <span className="podc-author-handle">@{u.username}</span>
        </button>
      ))}
    </div>
  );
}

export default function ForumSearch({
  searchMode,
  onSearchModeChange,
  query,
  onQueryChange,
  authorFilter,
  onAuthorFilterChange,
  authorSuggestions,
}) {
  const inputLabel =
    searchMode === 'keyword'
      ? 'Search by keyword\u2026'
      : searchMode === 'tag'
        ? 'Search by tag\u2026'
        : 'Search by author name or username\u2026';

  const inputValue = searchMode === 'author' ? authorFilter : query;

  const handleInputChange = (e) => {
    if (searchMode === 'author') onAuthorFilterChange(e.target.value);
    else onQueryChange(e.target.value);
  };

  const handleModeChange = (mode) => {
    onSearchModeChange(mode);
    onQueryChange('');
    onAuthorFilterChange('');
  };

  return (
    <div className="podc-forum-search">
      <div className="podc-search-mode-tabs" role="tablist">
        {SEARCH_MODES.map((mode) => (
          <button
            key={mode.value}
            role="tab"
            aria-selected={searchMode === mode.value}
            className={`podc-search-tab ${searchMode === mode.value ? 'is-active' : ''}`}
            onClick={() => handleModeChange(mode.value)}
          >
            {SEARCH_ICONS[mode.icon]}
            {mode.label}
          </button>
        ))}
      </div>

      <label className="podc-search-box">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
          <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.79l5 4.99L20.49 19l-4.99-5Zm-6 0A4.5 4.5 0 1 1 14 9.5 4.5 4.5 0 0 1 9.5 14Z" />
        </svg>
        <input
          type="search"
          placeholder={inputLabel}
          value={inputValue}
          onChange={handleInputChange}
          aria-label={inputLabel}
        />
      </label>

      {searchMode === 'author' && authorFilter.length > 0 && (
        <AuthorSuggestions authors={authorSuggestions} onSelect={onAuthorFilterChange} />
      )}
    </div>
  );
}
