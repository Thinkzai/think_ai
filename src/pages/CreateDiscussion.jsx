import { useEffect, useState } from 'react';
import { ForumApi } from '../services/forumApi.js';
import { navigate } from '../services/router.js';
import { useToast } from '../components/Toast.jsx';
import RichTextEditor from '../components/RichTextEditor.jsx';

export default function CreateDiscussion() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [allTags, setAllTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const { toastSuccess, toastError } = useToast();

  useEffect(() => {
    let active = true;
    ForumApi.getTags().then((tags) => {
      if (active) setAllTags(tags);
    });
    return () => {
      active = false;
    };
  }, []);

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const post = await ForumApi.addPost({
        title,
        content,
        tags: selectedTags,
        authorId: 'u4',
      });
      toastSuccess('Discussion posted successfully!');
      navigate(`post/${post.id}`);
    } catch (err) {
      setError(err.message ?? 'Could not create your discussion');
      toastError(err.message ?? 'Could not create your discussion');
      setSubmitting(false);
    }
  };

  return (
    <div className="create-page">
      <a className="back-link" href="#/">
        &larr; Back to forum
      </a>

      <header className="create-header">
        <h1 className="forum-title">Ask a Question</h1>
        <p className="forum-subtitle">
          Share your problem with the community and get answers fast.
        </p>
      </header>

      {error && (
        <div className="alert alert-error" role="alert">
          {error}
        </div>
      )}

      <form className="create-form" onSubmit={handleSubmit}>
        <div className="field">
          <label className="field-label" htmlFor="create-title">
            Title
          </label>
          <input
            id="create-title"
            className="text-input"
            type="text"
            placeholder="Summarize your question in one line..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            maxLength={160}
          />
        </div>

        <div className="field">
          <label className="field-label" htmlFor="create-content">
            Details
          </label>
          <RichTextEditor
            value={content}
            onChange={setContent}
            placeholder="Describe the problem, what you tried, and expected vs. actual behavior..."
            minHeight={200}
          />
        </div>

        <div className="field">
          <span className="field-label">Tags</span>
          <div className="tag-chip-list">
            {allTags.map((tag) => (
              <button
                key={tag}
                type="button"
                className={selectedTags.includes(tag) ? 'tag-chip is-active' : 'tag-chip'}
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
          <p className="field-hint">
            Select at least one tag &mdash; {selectedTags.length} selected.
          </p>
        </div>

        <div className="create-actions">
          <button className="btn" type="submit" disabled={submitting}>
            {submitting ? 'Posting...' : 'Post Discussion'}
          </button>
          <a className="btn btn-ghost" href="#/">
            Cancel
          </a>
        </div>
      </form>
    </div>
  );
}
