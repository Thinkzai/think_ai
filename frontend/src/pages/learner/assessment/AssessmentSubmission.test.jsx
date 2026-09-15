import { describe, test, expect, beforeEach, afterEach, vi } from "vitest";
// eslint-disable-next-line no-unused-vars -- existing application behavior; targeted CI lint exception
import { render, screen, fireEvent, waitFor, cleanup, act } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import AssessmentSubmission from "./AssessmentSubmission";

afterEach(() => cleanup());

const questions = [
  { id: "q1", prompt: "2 + 2 = ?", options: ["3", "4", "5", "6"] },
  { id: "q2", prompt: "Capital of France?", options: ["Paris", "Rome", "Berlin", "Madrid"] },
];

function renderAssessment(overrides = {}) {
  const onAutosave = vi.fn();
  const onSubmit = vi.fn();
  const utils = render(
    <AssessmentSubmission
      questions={questions}
      durationSeconds={60}
      autosaveDelayMs={100}
      onAutosave={onAutosave}
      onSubmit={onSubmit}
      {...overrides}
    />
  );
  return { ...utils, onAutosave, onSubmit };
}

describe("AssessmentSubmission", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  test("renders the first question by default", () => {
    renderAssessment();
    expect(screen.getByText("2 + 2 = ?")).toBeInTheDocument();
    expect(screen.getByText(/Question 1 of 2/i)).toBeInTheDocument();
  });

  test("selecting an answer marks the question nav button as answered", () => {
    renderAssessment();
    fireEvent.click(screen.getByText("4"));
    const navButtons = screen.getAllByRole("button", { name: /Question 1/i });
    expect(navButtons[0]).toHaveClass("bg-emerald-500");
  });

  test("navigating to next question updates the displayed prompt", () => {
    renderAssessment();
    fireEvent.click(screen.getByRole("button", { name: /Next/i }));
    expect(screen.getByText("Capital of France?")).toBeInTheDocument();
  });

  test("previous button is disabled on first question", () => {
    renderAssessment();
    expect(screen.getByRole("button", { name: /Previous/i })).toBeDisabled();
  });

  test("flagging a question toggles the Flagged label", () => {
    renderAssessment();
    const flagBtn = screen.getByRole("button", { name: /^Flag$/i });
    fireEvent.click(flagBtn);
    expect(screen.getByRole("button", { name: /^Flagged$/i })).toBeInTheDocument();
  });

  test("autosave fires after debounce delay when an answer changes", async () => {
    const { onAutosave } = renderAssessment();
    fireEvent.click(screen.getByText("4"));

    await act(async () => {
      await vi.advanceTimersByTimeAsync(150);
    });

    expect(onAutosave).toHaveBeenCalledWith(
      expect.objectContaining({ q1: 1 })
    );
  });

  test("timer counts down and displays mm:ss format", () => {
    renderAssessment({ durationSeconds: 65 });
    expect(screen.getByRole("timer")).toHaveTextContent("01:05");

    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(screen.getByRole("timer")).toHaveTextContent("01:00");
  });

  test("auto-submits when timer reaches zero", () => {
    const { onSubmit } = renderAssessment({ durationSeconds: 2 });
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(onSubmit).toHaveBeenCalled();
  });

  test("submit modal shows unanswered/flagged summary and confirms submission", () => {
    const { onSubmit } = renderAssessment();
    fireEvent.click(screen.getByRole("button", { name: /Next/i }));
    fireEvent.click(screen.getByRole("button", { name: /Review & submit/i }));

    expect(screen.getByText(/Submit assessment\?/i)).toBeInTheDocument();
    expect(screen.getByText(/0 of 2 questions/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /^Submit$/i }));
    expect(onSubmit).toHaveBeenCalled();
    expect(screen.getByText(/Assessment submitted/i)).toBeInTheDocument();
  });

  test("cancel on submit modal keeps assessment in progress", () => {
    renderAssessment();
    fireEvent.click(screen.getByRole("button", { name: /Submit assessment/i }));
    fireEvent.click(screen.getByRole("button", { name: /Keep working/i }));
    expect(screen.queryByText(/Submit assessment\?/i)).not.toBeInTheDocument();
  });
});
