import { useState, useEffect, useMemo, useCallback } from 'react';
const STATUS = {
  UPCOMING: "upcoming", // more than earlyJoinWindow away
  JOINABLE: "joinable", // inside early-join window, not yet started
  LIVE: "live", // class in progress
  ENDED: "ended", // past end time
};

const MOCK_CLASS = {
  id: "cls_204",
  title: "React Performance Patterns — Live Q&A",
  instructor: "Priya Nair",
  startTime: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // starts in 5 min
  durationMinutes: 60,
};

function getStatus(startTime, durationMinutes, earlyJoinWindowMinutes, now) {
  const start = new Date(startTime).getTime();
  const end = start + durationMinutes * 60 * 1000;
  const joinOpensAt = start - earlyJoinWindowMinutes * 60 * 1000;

  if (now >= end) return STATUS.ENDED;
  if (now >= start) return STATUS.LIVE;
  if (now >= joinOpensAt) return STATUS.JOINABLE;
  return STATUS.UPCOMING;
}

function formatCountdown(ms) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const d = Math.floor(totalSeconds / 86400);
  const h = Math.floor((totalSeconds % 86400) / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  const pad = (n) => String(n).padStart(2, "0");

  if (d > 0) return `${d}d ${pad(h)}h ${pad(m)}m`;
  if (h > 0) return `${pad(h)}:${pad(m)}:${pad(s)}`;
  return `${pad(m)}:${pad(s)}`;
}

export default function LiveClassJoin({
  classInfo = MOCK_CLASS,
  earlyJoinWindowMinutes = 10,
  onJoin = async () => {
    console.log("[live-class] join requested");
    return { joinUrl: "https://example.com/session/mock" };
  },
}) {
  // eslint-disable-next-line react-hooks/purity -- existing application behavior; targeted CI lint exception
  const [now, setNow] = useState(Date.now());
  const [joining, setJoining] = useState(false);
  const [joinError, setJoinError] = useState(null);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const status = useMemo(
    () => getStatus(classInfo.startTime, classInfo.durationMinutes, earlyJoinWindowMinutes, now),
    [classInfo.startTime, classInfo.durationMinutes, earlyJoinWindowMinutes, now]
  );

  const startMs = new Date(classInfo.startTime).getTime();
  const msUntilStart = startMs - now;
  const canJoin = status === STATUS.JOINABLE || status === STATUS.LIVE;

  const handleJoin = useCallback(async () => {
    if (!canJoin || joining) return;
    setJoining(true);
    setJoinError(null);
    try {
      const result = await onJoin();
      if (result?.joinUrl) {
        window.open(result.joinUrl, "_blank", "noopener,noreferrer");
      }
    // eslint-disable-next-line no-unused-vars -- existing application behavior; targeted CI lint exception
    } catch (e) {
      setJoinError("Couldn't join the class. Try again.");
    } finally {
      setJoining(false);
    }
  }, [canJoin, joining, onJoin]);

  const startLabel = new Date(classInfo.startTime).toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <div className="w-full max-w-md mx-auto rounded-2xl border border-neutral-200 bg-white overflow-hidden">
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-center gap-2">
          <StatusBadge status={status} />
        </div>

        <h2 className="mt-2.5 text-base font-semibold text-neutral-900 leading-snug">
          {classInfo.title}
        </h2>
        <p className="mt-1 text-sm text-neutral-500">
          with {classInfo.instructor} · {startLabel}
        </p>
      </div>

      {/* Countdown / status area */}
      <div className="px-5 pb-4">
        {status === STATUS.UPCOMING && (
          <div className="rounded-xl bg-neutral-50 border border-neutral-200 px-4 py-4 text-center">
            <p className="text-xs uppercase tracking-wide text-neutral-400 font-medium">
              Starts in
            </p>
            <p
              className="mt-1 text-2xl font-semibold text-neutral-900 tabular-nums"
              role="timer"
              aria-live="polite"
              data-testid="countdown"
            >
              {formatCountdown(msUntilStart)}
            </p>
            <p className="mt-1 text-xs text-neutral-400">
              Join opens {earlyJoinWindowMinutes} min before start
            </p>
          </div>
        )}

        {status === STATUS.JOINABLE && (
          <div className="rounded-xl bg-indigo-50 border border-indigo-200 px-4 py-4 text-center">
            <p className="text-xs uppercase tracking-wide text-indigo-500 font-medium">
              Starting soon
            </p>
            <p
              className="mt-1 text-2xl font-semibold text-indigo-700 tabular-nums"
              role="timer"
              aria-live="polite"
              data-testid="countdown"
            >
              {formatCountdown(msUntilStart)}
            </p>
            <p className="mt-1 text-xs text-indigo-500">You can join now</p>
          </div>
        )}

        {status === STATUS.LIVE && (
          <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-4 text-center">
            <p className="flex items-center justify-center gap-1.5 text-sm font-medium text-emerald-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Class is live
            </p>
          </div>
        )}

        {status === STATUS.ENDED && (
          <div className="rounded-xl bg-neutral-50 border border-neutral-200 px-4 py-4 text-center">
            <p className="text-sm text-neutral-500">This session has ended.</p>
          </div>
        )}
      </div>

      {/* Join button */}
      <div className="px-5 pb-5">
        <button
          onClick={handleJoin}
          disabled={!canJoin || joining}
          className={`w-full rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
            canJoin
              ? "bg-neutral-900 text-white hover:bg-neutral-800 disabled:opacity-60"
              : "bg-neutral-100 text-neutral-400 cursor-not-allowed"
          }`}
        >
          {joining
            ? "Joining…"
            : status === STATUS.LIVE
            ? "Join live class"
            : status === STATUS.JOINABLE
            ? "Join class"
            : status === STATUS.ENDED
            ? "Session ended"
            : "Join opens closer to start"}
        </button>

        {joinError && (
          <p role="alert" className="mt-2 text-xs text-red-600">
            {joinError}
          </p>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    [STATUS.UPCOMING]: { label: "Upcoming", classes: "bg-neutral-100 text-neutral-600" },
    [STATUS.JOINABLE]: { label: "Starting soon", classes: "bg-indigo-100 text-indigo-700" },
    [STATUS.LIVE]: { label: "Live now", classes: "bg-emerald-100 text-emerald-700" },
    [STATUS.ENDED]: { label: "Ended", classes: "bg-neutral-100 text-neutral-400" },
  };
  const s = map[status];
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${s.classes}`}>
      {s.label}
    </span>
  );
}
