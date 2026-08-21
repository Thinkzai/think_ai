import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import RichTextEditor from '../components/RichTextEditor.jsx';

beforeEach(() => {
  document.execCommand = vi.fn();
  document.queryCommandState = vi.fn(() => false);
});

describe('RichTextEditor', () => {
  it('renders the editor with toolbar', () => {
    render(<RichTextEditor value="" onChange={vi.fn()} />);
    expect(screen.getByRole('textbox', { name: /content editor/i })).toBeInTheDocument();
    expect(screen.getByRole('toolbar', { name: /formatting options/i })).toBeInTheDocument();
  });

  it('renders toolbar formatting buttons', () => {
    render(<RichTextEditor value="" onChange={vi.fn()} />);
    expect(screen.getByRole('button', { name: /bold/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /italic/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /underline/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /strikethrough/i })).toBeInTheDocument();
  });

  it('renders insert buttons', () => {
    render(<RichTextEditor value="" onChange={vi.fn()} />);
    expect(screen.getByRole('button', { name: /insert link/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /insert image/i })).toBeInTheDocument();
  });

  it('renders block type selector', () => {
    render(<RichTextEditor value="" onChange={vi.fn()} />);
    expect(screen.getByRole('combobox', { name: /block type/i })).toBeInTheDocument();
  });

  it('renders preview toggle button', () => {
    render(<RichTextEditor value="" onChange={vi.fn()} />);
    expect(screen.getByRole('button', { name: /toggle preview/i })).toBeInTheDocument();
  });

  it('renders with custom placeholder', () => {
    render(<RichTextEditor value="" onChange={vi.fn()} placeholder="Custom placeholder" />);
    const editor = screen.getByRole('textbox', { name: /content editor/i });
    expect(editor).toHaveAttribute('data-placeholder', 'Custom placeholder');
  });

  it('has correct aria attributes', () => {
    render(<RichTextEditor value="" onChange={vi.fn()} />);
    const editor = screen.getByRole('textbox', { name: /content editor/i });
    expect(editor).toHaveAttribute('aria-multiline', 'true');
  });

  it('renders formatting hint in footer', () => {
    render(<RichTextEditor value="" onChange={vi.fn()} />);
    expect(screen.getByText(/bold/, { selector: '.rich-editor-hint' })).toBeInTheDocument();
  });

  it('has accessible label on toolbar', () => {
    render(<RichTextEditor value="" onChange={vi.fn()} />);
    expect(screen.getByRole('toolbar', { name: /formatting options/i })).toBeInTheDocument();
  });

  it('toggles preview mode when preview button is clicked', async () => {
    const { default: userEvent } = await import('@testing-library/user-event');
    const user = userEvent.setup();
    render(<RichTextEditor value="<p>Test content</p>" onChange={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: /toggle preview/i }));
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('applies placeholder via data attribute', () => {
    render(<RichTextEditor value="" onChange={vi.fn()} placeholder="Enter text here" />);
    expect(screen.getByRole('textbox', { name: /content editor/i })).toHaveAttribute(
      'data-placeholder',
      'Enter text here'
    );
  });
});
