// eslint-disable-next-line no-unused-vars -- existing application behavior; targeted CI lint exception
import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import CodePlayground from './Codeplayground';
import { executeCode } from '../../../api/codeExecutionApi';
import { ThemeProvider } from '../../../components/ThemeProvider';

afterEach(() => cleanup());

vi.mock('../../../api/codeExecutionApi');
vi.mock('@monaco-editor/react', () => ({
  default: (props) => (
    <textarea
      data-testid="mock-editor"
      value={props.value}
      onChange={(e) => props.onChange(e.target.value)}
    />
  ),
}));

function renderPlayground() {
  return render(
    <ThemeProvider>
      <CodePlayground />
    </ThemeProvider>
  );
}

describe('CodePlayground', () => {
  afterEach(() => vi.clearAllMocks());

  test('renders default JavaScript snippet', () => {
    renderPlayground();
    expect(screen.getByTestId('mock-editor').value).toMatch(/greet/);
  });

  test('switching language resets the snippet', () => {
    renderPlayground();
    fireEvent.change(screen.getByLabelText('Select language'), { target: { value: 'python' } });
    expect(screen.getByTestId('mock-editor').value).toMatch(/def greet/);
  });

  test('running code shows loading then success output', async () => {
    executeCode.mockResolvedValue({ stdout: 'Hello, world!', stderr: '', exitCode: 0 });
    renderPlayground();

    fireEvent.click(screen.getByRole('button', { name: /Run/i }));
    expect(screen.getByText(/Running…/i)).toBeInTheDocument();

    await waitFor(() => expect(screen.getByText('Hello, world!')).toBeInTheDocument());
    expect(executeCode).toHaveBeenCalledWith({ language: 'javascript', code: expect.any(String) });
  });

  test('shows error state when execution fails', async () => {
    executeCode.mockRejectedValue(new Error('Execution timed out.'));
    renderPlayground();

    fireEvent.click(screen.getByRole('button', { name: /Run/i }));
    await waitFor(() => expect(screen.getByText('Execution timed out.')).toBeInTheDocument());
    expect(screen.getByText('error')).toBeInTheDocument();
  });
});
