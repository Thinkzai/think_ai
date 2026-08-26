import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import LiveClassJoin from "./Liveclassjoin";

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
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  test("shows 'Upcoming' badge and disabled join button when far from start", () => {
    render(<LiveClassJoin classInfo={makeClassInfo(60)} earlyJoinWindowMinutes={10} />);
    expect(screen.getByText("Upcoming")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Join opens closer to start/i })).toBeDisabled();
  });

  test("displays a live countdown timer that ticks down", () => {
    render(<LiveClassJoin classInfo={makeClassInfo(2)} earlyJoinWindowMinutes={10} />);
    const before = screen.getByTestId("countdown").textContent;

    jest.advanceTimersByTime(2000);

    const after = screen.getByTestId("countdown").textContent;
    expect(after).not.toEqual(before);
  });

  test("enables Join button once inside the early-join window", () => {
    render(<LiveClassJoin classInfo={makeClassInfo(5)} earlyJoinWindowMinutes={10} />);
    expect(screen.getByText("Starting soon")).toBeInTheDocument();
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
    const onJoin = jest.fn().mockResolvedValue({ joinUrl: "https://example.com/session/abc" });
    window.open = jest.fn();

    render(
      <LiveClassJoin classInfo={makeClassInfo(5)} earlyJoinWindowMinutes={10} onJoin={onJoin} />
    );

    fireEvent.click(screen.getByRole("button", { name: /Join class/i }));

    await waitFor(() => expect(onJoin).toHaveBeenCalledTimes(1));
    expect(window.open).toHaveBeenCalledWith(
      "https://example.com/session/abc",
      "_blank",
      "noopener,noreferrer"
    );
  });

  test("shows an error message if onJoin fails", async () => {
    const onJoin = jest.fn().mockRejectedValue(new Error("network error"));

    render(
      <LiveClassJoin classInfo={makeClassInfo(5)} earlyJoinWindowMinutes={10} onJoin={onJoin} />
    );

    fireEvent.click(screen.getByRole("button", { name: /Join class/i }));

    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent(/Couldn't join/i));
  });

  test("disables the button while a join request is in flight", async () => {
    let resolveJoin;
    const onJoin = jest.fn(
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

    resolveJoin({ joinUrl: "https://example.com/session/abc" });
    await waitFor(() =>
      expect(screen.queryByRole("button", { name: /Joining…/i })).not.toBeInTheDocument()
    );
  });
});