import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import NotificationPreferences from '../components/NotificationPreferences.jsx';
import { NotificationApi, resetNotificationPrefs } from '../services/notificationApi.js';

beforeEach(() => {
  resetNotificationPrefs();
});

describe('NotificationPreferences', () => {
  it('renders loading state initially', () => {
    render(<NotificationPreferences />);
    expect(screen.getByText(/Loading preferences/)).toBeInTheDocument();
  });

  it('renders all three channel toggles after loading', async () => {
    render(<NotificationPreferences />);
    expect(await screen.findByText('Email Notifications')).toBeInTheDocument();
    expect(screen.getByText('In-App Notifications')).toBeInTheDocument();
    expect(screen.getByText('SMS Notifications')).toBeInTheDocument();
  });

  it('renders channel descriptions', async () => {
    render(<NotificationPreferences />);
    await screen.findByText('Email Notifications');
    expect(screen.getByText(/Receive email alerts/)).toBeInTheDocument();
    expect(screen.getByText(/Get real-time notifications/)).toBeInTheDocument();
    expect(screen.getByText(/Receive text message/)).toBeInTheDocument();
  });

  it('email is enabled by default', async () => {
    render(<NotificationPreferences />);
    const emailToggle = await screen.findByRole('switch', { name: /email notifications/i });
    expect(emailToggle).toHaveAttribute('aria-checked', 'true');
  });

  it('in-app is enabled by default', async () => {
    render(<NotificationPreferences />);
    const inAppToggle = await screen.findByRole('switch', { name: /in-app notifications/i });
    expect(inAppToggle).toHaveAttribute('aria-checked', 'true');
  });

  it('sms is disabled by default', async () => {
    render(<NotificationPreferences />);
    const smsToggle = await screen.findByRole('switch', { name: /sms notifications/i });
    expect(smsToggle).toHaveAttribute('aria-checked', 'false');
  });

  it('toggles email off when clicked', async () => {
    const user = userEvent.setup();
    render(<NotificationPreferences />);
    const emailToggle = await screen.findByRole('switch', { name: /email notifications/i });
    await user.click(emailToggle);
    await waitFor(() => {
      expect(emailToggle).toHaveAttribute('aria-checked', 'false');
    });
  });

  it('toggles sms on when clicked', async () => {
    const user = userEvent.setup();
    render(<NotificationPreferences />);
    const smsToggle = await screen.findByRole('switch', { name: /sms notifications/i });
    await user.click(smsToggle);
    await waitFor(() => {
      expect(smsToggle).toHaveAttribute('aria-checked', 'true');
    });
  });

  it('shows frequency select when channel is enabled', async () => {
    render(<NotificationPreferences />);
    await screen.findByText('Email Notifications');
    const emailFreqs = screen.getAllByLabelText('Delivery frequency');
    expect(emailFreqs.length).toBeGreaterThanOrEqual(1);
  });

  it('shows success message after saving', async () => {
    const user = userEvent.setup();
    render(<NotificationPreferences />);
    const emailToggle = await screen.findByRole('switch', { name: /email notifications/i });
    await user.click(emailToggle);
    await waitFor(() => {
      expect(screen.getByText(/Preferences saved/)).toBeInTheDocument();
    });
  });

  it('has reset to defaults button', async () => {
    render(<NotificationPreferences />);
    expect(await screen.findByText('Reset to defaults')).toBeInTheDocument();
  });

  it('resets to defaults when reset button is clicked', async () => {
    const user = userEvent.setup();
    render(<NotificationPreferences />);
    const smsToggle = await screen.findByRole('switch', { name: /sms notifications/i });
    await user.click(smsToggle);
    await waitFor(() => {
      expect(smsToggle).toHaveAttribute('aria-checked', 'true');
    });

    await user.click(screen.getByText('Reset to defaults'));
    await waitFor(() => {
      expect(smsToggle).toHaveAttribute('aria-checked', 'false');
    });
  });
});

describe('NotificationApi', () => {
  beforeEach(() => {
    resetNotificationPrefs();
  });

  it('returns default preferences', async () => {
    const prefs = await NotificationApi.getPreferences();
    expect(prefs.email.enabled).toBe(true);
    expect(prefs.inApp.enabled).toBe(true);
    expect(prefs.sms.enabled).toBe(false);
  });

  it('updates a channel', async () => {
    const prefs = await NotificationApi.updateChannel('sms', { enabled: true });
    expect(prefs.sms.enabled).toBe(true);
  });

  it('persists preferences to localStorage', async () => {
    await NotificationApi.updateChannel('email', { enabled: false });
    const prefs = await NotificationApi.getPreferences();
    expect(prefs.email.enabled).toBe(false);
  });

  it('resets to defaults', async () => {
    await NotificationApi.updateChannel('sms', { enabled: true });
    const prefs = await NotificationApi.resetPreferences();
    expect(prefs.sms.enabled).toBe(false);
    expect(prefs.email.enabled).toBe(true);
  });

  it('throws for unknown channel', async () => {
    await expect(NotificationApi.updateChannel('invalid', {})).rejects.toThrow('Unknown channel');
  });
});
