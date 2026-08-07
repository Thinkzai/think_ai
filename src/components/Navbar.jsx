export default function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <a className="navbar-brand" href="#/">
          <svg
            className="navbar-logo"
            viewBox="0 0 24 24"
            width="28"
            height="28"
            aria-hidden="true"
            fill="currentColor"
          >
            <path d="M12 2 3 7v10l9 5 9-5V7l-9-5Zm0 2.3 6.8 3.8L12 11.9 5.2 8.1 12 4.3ZM5 9.7l6 3.4v6.6l-6-3.3V9.7Zm14 0v6.7l-6 3.3v-6.6l6-3.4Z" />
          </svg>
          <span>Thinkz Community</span>
        </a>

        <nav className="navbar-links" aria-label="Primary">
          <a className="navbar-link" href="#/forum">
            Forum
          </a>
          <a className="navbar-link" href="#/questions">
            Questions
          </a>
          <a className="navbar-link" href="#/tags">
            Tags
          </a>
          <a className="navbar-link" href="#/profile">
            Profile
          </a>
        </nav>

        <button className="navbar-cta" type="button">
          Ask Question
        </button>
      </div>
    </header>
  );
}
