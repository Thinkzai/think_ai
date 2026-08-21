import { useMemo, useRef, useState, useEffect } from 'react';
import { mockForumData } from '../data/mockForumData.js';
import ForumSearch from '../components/ForumSearch.jsx';
import SearchFilters from '../components/SearchFilters.jsx';
import SearchResults from '../components/SearchResults.jsx';
import NotificationPreferences from '../components/NotificationPreferences.jsx';
import LoadingState from '../components/LoadingState.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { getDateRange } from '../components/SearchFilters.jsx';

const TABS = [
  { id: 'search', label: 'Forum Search' },
  { id: 'notifications', label: 'Notification Preferences' },
];

export default function ForumFeatures() {
  const [activeTab, setActiveTab] = useState('search');
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [tags, setTags] = useState([]);

  const [searchMode, setSearchMode] = useState('keyword');
  const [query, setQuery] = useState('');
  const [authorFilter, setAuthorFilter] = useState('');
  const [activeTag, setActiveTag] = useState(null);
  const [solvedFilter, setSolvedFilter] = useState('all');
  const [datePreset, setDatePreset] = useState('all');

  const [searchTime, setSearchTime] = useState(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    const timer = setTimeout(() => {
      if (!mountedRef.current) return;
      setPosts(mockForumData.posts);
      setUsers(mockForumData.users);
      setTags(mockForumData.tags);
      setLoading(false);
    }, 300);
    return () => {
      mountedRef.current = false;
      clearTimeout(timer);
    };
  }, []);

  const userMap = useMemo(() => {
    const map = new Map();
    users.forEach((u) => map.set(u.id, u));
    return map;
  }, [users]);

  const authorSuggestions = useMemo(() => {
    if (searchMode !== 'author') return [];
    const au = authorFilter.trim().toLowerCase();
    if (au.length === 0) return users.slice(0, 5);
    return users.filter(
      (u) =>
        u.username.toLowerCase().includes(au) ||
        u.displayName.toLowerCase().includes(au)
    );
  }, [users, authorFilter, searchMode]);

  const filteredPosts = useMemo(() => {
    const start = performance.now();
    const q = query.trim().toLowerCase();
    const au = authorFilter.trim().toLowerCase();
    const dateRange = getDateRange(datePreset);

    const results = posts.filter((post) => {
      if (activeTag !== null && !post.tags.includes(activeTag)) return false;

      if (solvedFilter === 'solved' && !post.isSolved) return false;
      if (solvedFilter === 'unsolved' && post.isSolved) return false;

      if (dateRange) {
        const postDate = new Date(post.createdAt);
        if (postDate < dateRange) return false;
      }

      if (searchMode === 'keyword' && q.length > 0) {
        const matches =
          post.title.toLowerCase().includes(q) ||
          post.content.toLowerCase().includes(q) ||
          post.tags.some((tag) => tag.toLowerCase().includes(q));
        if (!matches) return false;
      } else if (searchMode === 'tag' && q.length > 0) {
        const matches = post.tags.some((tag) => tag.toLowerCase().includes(q));
        if (!matches) return false;
      } else if (searchMode === 'author' && au.length > 0) {
        const author = userMap.get(post.authorId);
        const matches =
          !!author &&
          (author.username.toLowerCase().includes(au) ||
            author.displayName.toLowerCase().includes(au));
        if (!matches) return false;
      }

      return true;
    });

    const end = performance.now();
    setSearchTime(Math.round(end - start));
    return results;
  }, [posts, activeTag, query, authorFilter, searchMode, solvedFilter, datePreset, userMap]);

  const handleReset = () => {
    setQuery('');
    setAuthorFilter('');
    setActiveTag(null);
    setSolvedFilter('all');
    setDatePreset('all');
    setSearchMode('keyword');
  };

  const hasActiveFilters = query || authorFilter || activeTag || solvedFilter !== 'all' || datePreset !== 'all';

  return (
    <div className="podc-forum-features">
      <div className="podc-tabs" role="tablist">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            className={`podc-tab ${activeTab === tab.id ? 'is-active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="podc-tab-panel">
        {activeTab === 'search' && (
          <div className="podc-search-panel">
            {loading ? (
              <LoadingState message="Loading 1000+ posts\u2026" />
            ) : (
              <>
                <ForumSearch
                  searchMode={searchMode}
                  onSearchModeChange={setSearchMode}
                  query={query}
                  onQueryChange={setQuery}
                  authorFilter={authorFilter}
                  onAuthorFilterChange={setAuthorFilter}
                  authorSuggestions={authorSuggestions}
                />

                <SearchFilters
                  tags={tags}
                  activeTag={activeTag}
                  onTagChange={setActiveTag}
                  solvedFilter={solvedFilter}
                  onSolvedChange={setSolvedFilter}
                  datePreset={datePreset}
                  onDatePresetChange={setDatePreset}
                />

                {filteredPosts.length === 0 ? (
                  <EmptyState
                    title="No posts match your filters."
                    hint="Try adjusting your search query or filters."
                    resetLabel="Reset all filters"
                    onReset={hasActiveFilters ? handleReset : undefined}
                  />
                ) : (
                  <SearchResults
                    results={filteredPosts.slice(0, 50)}
                    userMap={userMap}
                    totalCount={filteredPosts.length}
                    searchTime={searchTime}
                  />
                )}
              </>
            )}
          </div>
        )}

        {activeTab === 'notifications' && (
          <NotificationPreferences />
        )}
      </div>
    </div>
  );
}
