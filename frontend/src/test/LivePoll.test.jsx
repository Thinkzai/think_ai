import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { describe, it, expect, vi } from "vitest";
import configureStore from "redux-mock-store";
import LivePoll from "../components/liveStudio/LivePoll";

const mockStore = configureStore([]);

const defaultState = {
  liveSession: {
    polls: [],
    activePoll: null,
  },
};

describe("LivePoll", () => {
  it("renders the polls section header", () => {
    const store = mockStore(defaultState);
    render(
      <Provider store={store}>
        <LivePoll session={{ role: "Instructor" }} sessionId="sess-1" />
      </Provider>
    );
    expect(screen.getByTestId("live-poll")).toBeInTheDocument();
    expect(screen.getByText("Live Polls")).toBeInTheDocument();
  });

  it("shows new poll button for instructors", () => {
    const store = mockStore(defaultState);
    render(
      <Provider store={store}>
        <LivePoll session={{ role: "Instructor" }} sessionId="sess-1" />
      </Provider>
    );
    expect(screen.getByText("+ New Poll")).toBeInTheDocument();
  });

  it("hides new poll button for non-instructors", () => {
    const store = mockStore(defaultState);
    render(
      <Provider store={store}>
        <LivePoll session={{ role: "Learner" }} sessionId="sess-1" />
      </Provider>
    );
    expect(screen.queryByText("+ New Poll")).not.toBeInTheDocument();
  });

  it("displays active poll with question and options", () => {
    const store = mockStore(defaultState);
    render(
      <Provider store={store}>
        <LivePoll session={{ role: "Learner" }} sessionId="sess-1" />
      </Provider>
    );
    expect(
      screen.getByText("What is the time complexity of binary search?")
    ).toBeInTheDocument();
    expect(screen.getByText("O(1)")).toBeInTheDocument();
    expect(screen.getByText("O(log n)")).toBeInTheDocument();
    expect(screen.getByText("O(n)")).toBeInTheDocument();
    expect(screen.getByText("O(n log n)")).toBeInTheDocument();
  });

  it("shows active poll indicator", () => {
    const store = mockStore(defaultState);
    render(
      <Provider store={store}>
        <LivePoll session={{ role: "Learner" }} sessionId="sess-1" />
      </Provider>
    );
    expect(screen.getByText("Active Poll")).toBeInTheDocument();
  });

  it("disables poll options after voting", async () => {
    const user = userEvent.setup();
    const store = mockStore(defaultState);
    store.dispatch = vi.fn();

    render(
      <Provider store={store}>
        <LivePoll session={{ role: "Learner" }} sessionId="sess-1" />
      </Provider>
    );

    const option = screen.getByText("O(log n)");
    await user.click(option.closest("button"));

    const allOptions = screen.getAllByRole("button").filter(
      (btn) => btn.textContent.includes("O(") && !btn.textContent.includes("New Poll")
    );
    allOptions.forEach((opt) => {
      expect(opt).toBeDisabled();
    });
  });
});
