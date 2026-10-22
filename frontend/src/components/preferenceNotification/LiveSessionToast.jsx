
import { Link } from 'react-router-dom';

/**
 * Live Session notification toast.
 *
 * Handles notifications for:
 * - session:started
 * - session:ended
 *
 * Supports session links and dismiss actions.
 */
export default function LiveSessionToast({ toast, onDismiss }) {
  if (!toast) return null;

  const {
    title = 'Live Session',
    message = 'A live session is available.',
    link,
    linkLabel = 'Open session',
  } = toast;

  return (
    <div
      data-testid="live-session-toast"
      role="alert"
      className="flex items-start gap-3 bg-slate-900 border border-slate-700 text-slate-100 p-4 rounded-xl shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-right-5 border-l-4 border-l-emerald-500"
    >
      <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 font-bold text-xs">
        {'▶'}
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-white">
          {title}
        </h4>

        <p className="text-xs text-slate-300 mt-0.5">
          {message}
        </p>

        {link && (
          <Link
            to={link}
            className="inline-block mt-2 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors"
          >
            {linkLabel}
          </Link>
        )}
      </div>

      {typeof onDismiss === 'function' && (
        <button
          type="button"
          onClick={onDismiss}
          className="text-slate-400 hover:text-white text-lg leading-none cursor-pointer"
          aria-label="Dismiss notification"
        >
          &times;
        </button>
      )}
    </div>
  );
}
