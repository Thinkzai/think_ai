import { describe, it, expect, beforeEach } from 'vitest';
import { ModerationService } from '../services/moderationService.js';

describe('ModerationService', () => {
  beforeEach(() => {
    ModerationService.resetModeration();
  });

  it('initializes with mock data', async () => {
    ModerationService.initializeMockData();
    const items = await ModerationService.getAllModerationItems();
    expect(items.length).toBeGreaterThan(0);
  });

  it('does not re-initialize if data already exists', async () => {
    ModerationService.initializeMockData();
    ModerationService.initializeMockData();
    const items = await ModerationService.getAllModerationItems();
    expect(items.length).toBe(3);
  });

  it('returns only pending items for getFlaggedPosts', async () => {
    ModerationService.initializeMockData();
    const pending = await ModerationService.getFlaggedPosts();
    expect(pending.every((i) => i.status === 'pending')).toBe(true);
  });

  it('flags a new post', async () => {
    ModerationService.initializeMockData();
    const item = await ModerationService.flagPost('p99', 'Spam content', 'u1');
    expect(item.postId).toBe('p99');
    expect(item.reason).toBe('Spam content');
    expect(item.status).toBe('pending');
    expect(item.id).toMatch(/^mod_/);
  });

  it('approves a post', async () => {
    ModerationService.initializeMockData();
    const items = await ModerationService.getAllModerationItems();
    const pending = items.find((i) => i.status === 'pending');
    const approved = await ModerationService.approvePost(pending.id, 'u4');
    expect(approved.status).toBe('approved');
    expect(approved.action).toBe('approved');
    expect(approved.reviewedBy).toBe('u4');
  });

  it('removes a post', async () => {
    ModerationService.initializeMockData();
    const items = await ModerationService.getAllModerationItems();
    const pending = items.find((i) => i.status === 'pending');
    const removed = await ModerationService.removePost(pending.id, 'u4');
    expect(removed.status).toBe('removed');
    expect(removed.action).toBe('removed');
  });

  it('warns a user', async () => {
    ModerationService.initializeMockData();
    const items = await ModerationService.getAllModerationItems();
    const pending = items.find((i) => i.status === 'pending');
    const warned = await ModerationService.warnUser(pending.id, 'u4');
    expect(warned.status).toBe('warned');
    expect(warned.action).toBe('warning_sent');
  });

  it('throws when approving non-existent item', async () => {
    ModerationService.initializeMockData();
    await expect(ModerationService.approvePost('nonexistent', 'u4')).rejects.toThrow('not found');
  });

  it('throws when removing non-existent item', async () => {
    ModerationService.initializeMockData();
    await expect(ModerationService.removePost('nonexistent', 'u4')).rejects.toThrow('not found');
  });

  it('returns correct stats', async () => {
    ModerationService.initializeMockData();
    const stats = await ModerationService.getStats();
    expect(stats.pending).toBe(2);
    expect(stats.approved).toBe(1);
    expect(stats.removed).toBe(0);
    expect(stats.total).toBe(3);
  });

  it('resets moderation data', async () => {
    ModerationService.initializeMockData();
    ModerationService.resetModeration();
    const items = await ModerationService.getAllModerationItems();
    expect(items).toEqual([]);
  });
});
