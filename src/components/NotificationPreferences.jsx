import { useEffect, useState, useCallback } from 'react';
import { NotificationApi } from '../services/notificationApi.js';
import PreferenceToggle from './PreferenceToggle.jsx';
import LoadingState from './LoadingState.jsx';

const CHANNELS = [
  {
    key: 'email',
    label: 'Email Notifications',
    description: 'Receive email alerts for forum activity, replies, and mentions.',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
        <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2Zm0 4-8 5-8-5V6l8 5 8-5v2Z" />
      </svg>
    ),
  },
  {
    key: 'inApp',
    label: 'In-App Notifications',
    description: 'Get real-time notifications within the application.',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
        <path d="M12 22c1.1 0 2-.9 2-2h-4a2 2 0 0 0 2 2Zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2Z" />
      </svg>
    ),
  },
  {
    key: 'sms',
    label: 'SMS Notifications',
    description: 'Receive text message alerts for critical updates.',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2Zm0 14H6l-2 2V4h16v12Z" />
      </svg>
    ),
  },
];

const FREQUENCIES = [
  { value: 'instant', label: 'Instant' },
  { value: 'daily', label: 'Daily digest' },
  { value: 'weekly', label: 'Weekly digest' },
  { value: 'never', label: 'Never' },
];

export default function NotificationPreferences() {
  const [prefs, setPrefs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let cancelled = false;
    NotificationApi.getPreferences()
      .then((p) => { if (!cancelled) setPrefs(p); })
      .catch((err) => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const handleToggle = useCallback(async (channel, enabled) => {
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const updated = await NotificationApi.updateChannel(channel, { enabled });
      setPrefs(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }, []);

  const handleFrequency = useCallback(async (channel, frequency) => {
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const updated = await NotificationApi.updateChannel(channel, { frequency });
      setPrefs(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }, []);

  const handleReset = useCallback(async () => {
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const defaults = await NotificationApi.resetPreferences();
      setPrefs(defaults);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }, []);

  if (loading) return <LoadingState message="Loading preferences\u2026" />;

  return (
    <div className="podc-notif-prefs">
      <div className="podc-prefs-header">
        <h2 className="podc-prefs-title">Notification Preferences</h2>
        <p className="podc-prefs-subtitle">Choose how you want to be notified about forum activity.</p>
      </div>

      {error && (
        <div className="podc-alert podc-alert-error" role="alert">
          {error}
        </div>
      )}

      {saved && (
        <div className="podc-alert podc-alert-success" role="status">
          Preferences saved successfully.
        </div>
      )}

      <div className="podc-channels-list">
        {CHANNELS.map((ch) => {
          const channelPrefs = prefs[ch.key] || { enabled: false, frequency: 'instant' };
          return (
            <div key={ch.key} className="podc-channel-card">
              <div className="podc-channel-header">
                <span className="podc-channel-icon">{ch.icon}</span>
                <PreferenceToggle
                  label={ch.label}
                  description={ch.description}
                  enabled={channelPrefs.enabled}
                  onChange={(val) => handleToggle(ch.key, val)}
                  disabled={saving}
                />
              </div>
              {channelPrefs.enabled && (
                <div className="podc-frequency-row">
                  <label className="podc-frequency-label" htmlFor={`freq-${ch.key}`}>
                    Delivery frequency
                  </label>
                  <select
                    id={`freq-${ch.key}`}
                    className="podc-frequency-select"
                    value={channelPrefs.frequency}
                    onChange={(e) => handleFrequency(ch.key, e.target.value)}
                    disabled={saving}
                  >
                    {FREQUENCIES.map((f) => (
                      <option key={f.value} value={f.value}>{f.label}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="podc-prefs-footer">
        <button
          className="podc-btn podc-btn-ghost"
          type="button"
          onClick={handleReset}
          disabled={saving}
        >
          Reset to defaults
        </button>
      </div>
    </div>
  );
}
