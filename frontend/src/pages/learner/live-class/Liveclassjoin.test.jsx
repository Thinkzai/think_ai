import { describe, test, expect, beforeEach, afterEach, vi } from "vitest";
// eslint-disable-next-line no-unused-vars -- existing application behavior; targeted CI lint exception
import { render, screen, fireEvent, waitFor, cleanup, act } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import LiveClassJoin from "./Liveclassjoin";

afterEach(() => cleanup());

function makeClassInfo(minutesFromNow, durationMinutes = 60) {
  return {
    id: "cls_test",
    title: "Test Live Class",
    instructor: "Jane Doe",
    startTime: new Date(Date.now() + minutesFromNow * 60 * 1000).toISOString(),
    durationMinutes,
  };
}

describe("LiveClassJoin", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  test("shows 'Upcoming' badge and disabled join button when far from start", () => {
    render(<LiveClassJoin classInfo={makeClassInfo(60)} earlyJoinWindowMinutes={10} />);
    expect(screen.getByText("Upcoming")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Join opens closer to start/i })).toBeDisabled();
  });

  test("displays a live countdown timer that ticks down", () => {
    render(<LiveClassJoin classInfo={makeClassInfo(2)} earlyJoinWindowMinutes={10} />);
    const before = screen.getByTestId("countdown").textContent;

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    const after = screen.getByTestId("countdown").textContent;
    expect(after).not.toEqual(before);
  });

  test("enables Join button once inside the early-join window", () => {
    render(<LiveClassJoin classInfo={makeClassInfo(5)} earlyJoinWindowMinutes={10} />);
    expect(screen.getAllByText("Starting soon").length).toBeGreaterThan(0);
    expect(screen.getByRole("button", { name: /Join class/i })).toBeEnabled();
  });

  test("shows 'Live now' state and Join live class button once started", () => {
    render(<LiveClassJoin classInfo={makeClassInfo(-5, 60)} earlyJoinWindowMinutes={10} />);
    expect(screen.getByText("Live now")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Join live class/i })).toBeEnabled();
  });

  test("shows 'Ended' state and disables join after class has finished", () => {
    render(<LiveClassJoin classInfo={makeClassInfo(-120, 60)} earlyJoinWindowMinutes={10} />);
    expect(screen.getByText("Ended")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Session ended/i })).toBeDisabled();
  });

  test("calls onJoin and opens the returned join URL when Join is clicked", async () => {
    const onJoin = vi.fn().mockResolvedValue({ joinUrl: "https://example.com/session/abc" });
    window.open = vi.fn();

    render(
      <LiveClassJoin classInfo={makeClassInfo(5)} earlyJoinWindowMinutes={10} onJoin={onJoin} />
    );

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /Join class/i }));
      await Promise.resolve();
    });

    expect(onJoin).toHaveBeenCalledTimes(1);
    expect(window.open).toHaveBeenCalledWith(
      "https://example.com/session/abc",
      "_blank",
      "noopener,noreferrer"
    );
  });

  test("shows an error message if onJoin fails", async () => {
    const onJoin = vi.fn().mockRejectedValue(new Error("network error"));

    render(
      <LiveClassJoin classInfo={makeClassInfo(5)} earlyJoinWindowMinutes={10} onJoin={onJoin} />
    );

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /Join class/i }));
      await Promise.resolve();
    });

    expect(screen.getByRole("alert")).toHaveTextContent(/Couldn't join/i);
  });

  test("disables the button while a join request is in flight", async () => {
    let resolveJoin;
    const onJoin = vi.fn(
      () =>
        new Promise((resolve) => {
          resolveJoin = resolve;
        })
    );

    render(
      <LiveClassJoin classInfo={makeClassInfo(5)} earlyJoinWindowMinutes={10} onJoin={onJoin} />
    );

    fireEvent.click(screen.getByRole("button", { name: /Join class/i }));
    expect(screen.getByRole("button", { name: /Joining…/i })).toBeDisabled();

    await act(async () => {
      resolveJoin({ joinUrl: "https://example.com/session/abc" });
      await Promise.resolve();
    });

    expect(
      screen.queryByRole("button", { name: /Joining…/i })
    ).not.toBeInTheDocument();
  });
});
