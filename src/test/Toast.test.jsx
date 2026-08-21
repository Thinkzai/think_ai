import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { ToastProvider, useToast } from '../components/Toast.jsx';

function TestComponent() {
  const { toast, toastSuccess, toastError, toastWarning, toastInfo } = useToast();
  return (
    <div>
      <button onClick={() => toast('Basic message')}>Toast</button>
      <button onClick={() => toastSuccess('Success!')}>Success</button>
      <button onClick={() => toastError('Error!')}>Error</button>
      <button onClick={() => toastWarning('Warning!')}>Warning</button>
      <button onClick={() => toastInfo('Info!')}>Info</button>
    </div>
  );
}

describe('Toast', () => {
  it('renders without crashing', () => {
    render(
      <ToastProvider>
        <div />
      </ToastProvider>
    );
  });

  it('shows toast when triggered', async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    await user.click(screen.getByRole('button', { name: 'Success' }));
    expect(screen.getByText('Success!')).toBeInTheDocument();
  });

  it('renders different toast types', async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    await user.click(screen.getByRole('button', { name: 'Success' }));
    expect(screen.getByRole('alert')).toHaveClass('toast-success');

    await user.click(screen.getByRole('button', { name: 'Error' }));
    const alerts = screen.getAllByRole('alert');
    expect(alerts[1]).toHaveClass('toast-error');
  });

  it('dismisses toast when close button clicked', async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    await user.click(screen.getByRole('button', { name: 'Success' }));
    expect(screen.getByText('Success!')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Dismiss notification' }));

    await waitFor(() => {
      expect(screen.queryByText('Success!')).not.toBeInTheDocument();
    });
  });

  it('renders toast with title', async () => {
    const user = userEvent.setup();

    function TitleToast() {
      const { toastSuccess } = useToast();
      return (
        <button onClick={() => toastSuccess('Body message', { title: 'My Title' })}>
          Trigger
        </button>
      );
    }

    render(
      <ToastProvider>
        <TitleToast />
      </ToastProvider>
    );

    await user.click(screen.getByRole('button', { name: 'Trigger' }));
    expect(screen.getByText('My Title')).toBeInTheDocument();
    expect(screen.getByText('Body message')).toBeInTheDocument();
  });

  it('throws when useToast is used outside provider', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    function BadComponent() {
      useToast();
      return null;
    }
    expect(() => render(<BadComponent />)).toThrow('useToast must be used within a ToastProvider');
    consoleSpy.mockRestore();
  });
});
