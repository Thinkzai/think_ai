const MODERATION_KEY = 'thinkz_moderation';

const delay = (ms = 200) => new Promise((r) => setTimeout(r, ms));

function loadModerationQueue() {
  try {
    const raw = localStorage.getItem(MODERATION_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveModerationQueue(queue) {
  try {
    localStorage.setItem(MODERATION_KEY, JSON.stringify(queue));
  } catch {
    // ignore
  }
}

export const ModerationService = {
  async getFlaggedPosts() {
    await delay(150);
    return loadModerationQueue().filter((item) => item.status === 'pending');
  },

  async getAllModerationItems() {
    await delay(150);
    return loadModerationQueue();
  },

  async flagPost(postId, reason, reportedBy) {
    await delay(100);
    const queue = loadModerationQueue();
    const item = {
      id: `mod_${Date.now()}`,
      postId,
      reason,
      reportedBy,
      status: 'pending',
      createdAt: new Date().toISOString(),
      reviewedAt: null,
      reviewedBy: null,
      action: null,
    };
    queue.unshift(item);
    saveModerationQueue(queue);
    return item;
  },

  async approvePost(itemId, reviewerId) {
    await delay(150);
    const queue = loadModerationQueue();
    const item = queue.find((i) => i.id === itemId);
    if (!item) throw new Error('Moderation item not found');
    item.status = 'approved';
    item.reviewedAt = new Date().toISOString();
    item.reviewedBy = reviewerId;
    item.action = 'approved';
    saveModerationQueue(queue);
    return item;
  },

  async removePost(itemId, reviewerId) {
    await delay(150);
    const queue = loadModerationQueue();
    const item = queue.find((i) => i.id === itemId);
    if (!item) throw new Error('Moderation item not found');
    item.status = 'removed';
    item.reviewedAt = new Date().toISOString();
    item.reviewedBy = reviewerId;
    item.action = 'removed';
    saveModerationQueue(queue);
    return item;
  },

  async warnUser(itemId, reviewerId) {
    await delay(150);
    const queue = loadModerationQueue();
    const item = queue.find((i) => i.id === itemId);
    if (!item) throw new Error('Moderation item not found');
    item.status = 'warned';
    item.reviewedAt = new Date().toISOString();
    item.reviewedBy = reviewerId;
    item.action = 'warning_sent';
    saveModerationQueue(queue);
    return item;
  },

  async getStats() {
    await delay(100);
    const queue = loadModerationQueue();
    return {
      pending: queue.filter((i) => i.status === 'pending').length,
      approved: queue.filter((i) => i.status === 'approved').length,
      removed: queue.filter((i) => i.status === 'removed').length,
      warned: queue.filter((i) => i.status === 'warned').length,
      total: queue.length,
    };
  },

  initializeMockData(posts) {
    const existing = loadModerationQueue();
    if (existing.length > 0) return;

    const mockQueue = [
      {
        id: 'mod_1',
        postId: 'p4',
        reason: 'Off-topic content not related to CSS',
        reportedBy: 'u2',
        status: 'pending',
        createdAt: '2026-08-18T10:00:00Z',
        reviewedAt: null,
        reviewedBy: null,
        action: null,
      },
      {
        id: 'mod_2',
        postId: 'p7',
        reason: 'Duplicate question already asked',
        reportedBy: 'u3',
        status: 'pending',
        createdAt: '2026-08-19T08:30:00Z',
        reviewedAt: null,
        reviewedBy: null,
        action: null,
      },
      {
        id: 'mod_3',
        postId: 'p2',
        reason: 'Needs more context before answering',
        reportedBy: 'u1',
        status: 'approved',
        createdAt: '2026-08-17T14:20:00Z',
        reviewedAt: '2026-08-17T16:00:00Z',
        reviewedBy: 'u4',
        action: 'approved',
      },
    ];

    saveModerationQueue(mockQueue);
  },

  resetModeration() {
    try {
      localStorage.removeItem(MODERATION_KEY);
    } catch {
      // ignore
    }
  },
};
