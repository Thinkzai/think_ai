const PREF_KEY = 'thinkz_notification_prefs';

const delay = (ms = 200) => new Promise((r) => setTimeout(r, ms));

const DEFAULT_PREFS = {
  email: { enabled: true, frequency: 'instant' },
  inApp: { enabled: true, frequency: 'instant' },
  sms: { enabled: false, frequency: 'daily' },
};

function loadPrefs() {
  try {
    const raw = localStorage.getItem(PREF_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_PREFS, ...parsed };
    }
  } catch {
    // ignore
  }
  return { ...DEFAULT_PREFS };
}

function savePrefs(prefs) {
  try {
    localStorage.setItem(PREF_KEY, JSON.stringify(prefs));
  } catch {
    // ignore
  }
}

export const NotificationApi = {
  async getPreferences() {
    await delay(150);
    return loadPrefs();
  },

  async updatePreferences(partial) {
    await delay(200);
    const current = loadPrefs();
    const updated = {
      email: { ...current.email, ...(partial.email || {}) },
      inApp: { ...current.inApp, ...(partial.inApp || {}) },
      sms: { ...current.sms, ...(partial.sms || {}) },
    };
    savePrefs(updated);
    return updated;
  },

  async updateChannel(channel, settings) {
    await delay(150);
    const current = loadPrefs();
    if (!current[channel]) {
      throw new Error(`Unknown channel: ${channel}`);
    }
    current[channel] = { ...current[channel], ...settings };
    savePrefs(current);
    return current;
  },

  async resetPreferences() {
    await delay(100);
    savePrefs(DEFAULT_PREFS);
    return { ...DEFAULT_PREFS };
  },
};

export function resetNotificationPrefs() {
  try {
    localStorage.removeItem(PREF_KEY);
  } catch {
    // ignore
  }
}
