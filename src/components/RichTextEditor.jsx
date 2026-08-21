import { useRef, useCallback, useState } from 'react';

const TOOLBAR_BUTTONS = [
  { id: 'bold', label: 'Bold', icon: 'B', tag: 'strong', shortcut: 'Ctrl+B' },
  { id: 'italic', label: 'Italic', icon: 'I', tag: 'em', shortcut: 'Ctrl+I' },
  { id: 'underline', label: 'Underline', icon: 'U', tag: 'u', shortcut: 'Ctrl+U' },
  { id: 'strike', label: 'Strikethrough', icon: 'S', tag: 's' },
  { id: 'code', label: 'Inline Code', icon: '<>', tag: 'code' },
];

const BLOCK_TYPES = [
  { id: 'paragraph', label: 'Paragraph', tag: 'p' },
  { id: 'heading', label: 'Heading', tag: 'h3' },
  { id: 'quote', label: 'Quote', tag: 'blockquote' },
  { id: 'codeblock', label: 'Code Block', tag: 'pre' },
  { id: 'list', label: 'Bullet List', tag: 'ul' },
  { id: 'ordered-list', label: 'Numbered List', tag: 'ol' },
];

function sanitizeHtml(html) {
  const allowed = new Set(['strong', 'em', 'u', 's', 'code', 'p', 'h3', 'blockquote', 'pre', 'ul', 'ol', 'li', 'br']);
  const temp = document.createElement('div');
  temp.innerHTML = html;

  function clean(node) {
    const children = [...node.childNodes];
    children.forEach((child) => {
      if (child.nodeType === 1) {
        const tag = child.tagName.toLowerCase();
        if (!allowed.has(tag)) {
          while (child.firstChild) {
            node.insertBefore(child.firstChild, child);
          }
          node.removeChild(child);
        } else {
          clean(child);
        }
      }
    });
  }

  clean(temp);
  return temp.innerHTML;
}

export default function RichTextEditor({ value, onChange, placeholder = 'Write your content here...', minHeight = 150 }) {
  const editorRef = useRef(null);
  const [activeFormats, setActiveFormats] = useState(new Set());
  const [showPreview, setShowPreview] = useState(false);

  const execCommand = useCallback((command, val = null) => {
    document.execCommand(command, false, val);
    editorRef.current?.focus();
    updateActiveFormats();
  }, []);

  const updateActiveFormats = useCallback(() => {
    const formats = new Set();
    if (document.queryCommandState('bold')) formats.add('bold');
    if (document.queryCommandState('italic')) formats.add('italic');
    if (document.queryCommandState('underline')) formats.add('underline');
    if (document.queryCommandState('strikeThrough')) formats.add('strike');
    setActiveFormats(formats);
  }, []);

  const handleToolbarAction = useCallback((button) => {
    switch (button.id) {
      case 'bold': execCommand('bold'); break;
      case 'italic': execCommand('italic'); break;
      case 'underline': execCommand('underline'); break;
      case 'strike': execCommand('strikeThrough'); break;
      case 'code': execCommand('insertHTML', '<code>Selection</code>'); break;
      default: break;
    }
  }, [execCommand]);

  const handleBlockType = useCallback((block) => {
    switch (block.id) {
      case 'paragraph': execCommand('formatBlock', '<p>'); break;
      case 'heading': execCommand('formatBlock', '<h3>'); break;
      case 'quote': execCommand('formatBlock', '<blockquote>'); break;
      case 'codeblock': execCommand('formatBlock', '<pre>'); break;
      case 'list': execCommand('insertUnorderedList'); break;
      case 'ordered-list': execCommand('insertOrderedList'); break;
      default: break;
    }
  }, [execCommand]);

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      const html = sanitizeHtml(editorRef.current.innerHTML);
      onChange?.(html);
    }
  }, [onChange]);

  const handleKeyDown = useCallback((e) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
        case 'b': e.preventDefault(); execCommand('bold'); break;
        case 'i': e.preventDefault(); execCommand('italic'); break;
        case 'u': e.preventDefault(); execCommand('underline'); break;
        default: break;
      }
    }
  }, [execCommand]);

  const handleInsertLink = useCallback(() => {
    const url = prompt('Enter URL:');
    if (url) {
      execCommand('createLink', url);
    }
  }, [execCommand]);

  const handleInsertImage = useCallback(() => {
    const url = prompt('Enter image URL:');
    if (url) {
      execCommand('insertImage', url);
    }
  }, [execCommand]);

  return (
    <div className="rich-editor">
      <div className="rich-editor-toolbar" role="toolbar" aria-label="Formatting options">
        <div className="rich-editor-toolbar-group">
          <select
            className="rich-editor-block-select"
            aria-label="Block type"
            onChange={(e) => {
              const block = BLOCK_TYPES.find((b) => b.id === e.target.value);
              if (block) handleBlockType(block);
            }}
          >
            {BLOCK_TYPES.map((block) => (
              <option key={block.id} value={block.id}>
                {block.label}
              </option>
            ))}
          </select>
        </div>

        <span className="rich-editor-divider" aria-hidden="true" />

        <div className="rich-editor-toolbar-group">
          {TOOLBAR_BUTTONS.map((btn) => (
            <button
              key={btn.id}
              type="button"
              className={`rich-editor-btn ${activeFormats.has(btn.id) ? 'is-active' : ''}`}
              aria-label={btn.label}
              aria-pressed={activeFormats.has(btn.id)}
              title={`${btn.label}${btn.shortcut ? ` (${btn.shortcut})` : ''}`}
              onClick={() => handleToolbarAction(btn)}
            >
              {btn.icon}
            </button>
          ))}
        </div>

        <span className="rich-editor-divider" aria-hidden="true" />

        <div className="rich-editor-toolbar-group">
          <button
            type="button"
            className="rich-editor-btn"
            aria-label="Insert link"
            title="Insert link"
            onClick={handleInsertLink}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
              <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z" />
            </svg>
          </button>
          <button
            type="button"
            className="rich-editor-btn"
            aria-label="Insert image"
            title="Insert image"
            onClick={handleInsertImage}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
              <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
            </svg>
          </button>
        </div>

        <span className="rich-editor-divider" aria-hidden="true" />

        <div className="rich-editor-toolbar-group">
          <button
            type="button"
            className={`rich-editor-btn rich-editor-preview-toggle ${showPreview ? 'is-active' : ''}`}
            aria-label="Toggle preview"
            aria-pressed={showPreview}
            onClick={() => setShowPreview(!showPreview)}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
              <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="rich-editor-body">
        {showPreview ? (
          <div
            className="rich-editor-preview"
            dangerouslySetInnerHTML={{ __html: value || '<p class="rich-editor-preview-empty">Nothing to preview.</p>' }}
          />
        ) : (
          <div
            ref={editorRef}
            className="rich-editor-content"
            contentEditable
            role="textbox"
            aria-multiline="true"
            aria-label="Content editor"
            style={{ minHeight }}
            data-placeholder={placeholder}
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            onSelect={updateActiveFormats}
            onClick={updateActiveFormats}
            dangerouslySetInnerHTML={{ __html: value }}
          />
        )}
      </div>

      <div className="rich-editor-footer">
        <span className="rich-editor-hint">
          Supports **bold**, *italic*, and markdown-style formatting.
        </span>
      </div>
    </div>
  );
}
