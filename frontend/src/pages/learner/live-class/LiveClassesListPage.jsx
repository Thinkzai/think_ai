import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchUpcomingClasses } from '../../../api/liveSessionApi';

export default function LiveClassesListPage() {
  const [classes, setClasses] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetchUpcomingClasses()
      .then((data) => {
        if (!cancelled) setClasses(data);
      })
      .catch((e) => {
        if (!cancelled) setError(e.message);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return <div className="p-6 text-sm text-red-600">{error}</div>;
  }
  if (!classes) {
    return <div className="p-6 text-sm text-neutral-400">Loading live classes…</div>;
  }
  if (classes.length === 0) {
    return <div className="p-6 text-sm text-neutral-400">No live classes scheduled right now.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-3">
      <h1 className="text-xl font-bold text-[var(--text-primary)] mb-4">Live Classes</h1>
      {classes.map((c) => (
        <Link
          key={c.id}
          to={`/learner/live/${c.id}`}
          className="block rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 hover:border-[var(--border-hover)] transition-colors"
        >
          <p className="text-sm font-semibold text-[var(--text-primary)]">{c.title}</p>
          <p className="mt-1 text-xs text-[var(--text-muted)]">
            with {c.instructor} · {new Date(c.startTime).toLocaleString(undefined, {
              weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
            })}
          </p>
        </Link>
      ))}
    </div>
  );
}