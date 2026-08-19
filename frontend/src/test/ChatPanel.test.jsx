import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { describe, it, expect } from "vitest";
import configureStore from "redux-mock-store";
import ChatPanel from "../components/liveStudio/ChatPanel";

const mockStore = configureStore([]);

const defaultState = {
  liveSession: {
    messages: [],
  },
};

const sampleMessages = [
  {
    id: "msg-1",
    senderName: "Alice",
    content: "Hello everyone!",
    timestamp: "2025-01-15T10:30:00Z",
    avatar: null,
  },
  {
    id: "msg-2",
    senderName: "Bob",
    content: "Hi Alice!",
    timestamp: "2025-01-15T10:31:00Z",
    avatar: null,
  },
];

describe("ChatPanel", () => {
  it("renders empty state when no messages", () => {
    const store = mockStore(defaultState);
    render(
      <Provider store={store}>
        <ChatPanel />
      </Provider>
    );
    expect(screen.getByText("No messages yet. Start the conversation!")).toBeInTheDocument();
  });

  it("renders messages when available", () => {
    const store = mockStore({
      liveSession: { messages: sampleMessages },
    });
    render(
      <Provider store={store}>
        <ChatPanel />
      </Provider>
    );
    expect(screen.getByText("Hello everyone!")).toBeInTheDocument();
    expect(screen.getByText("Hi Alice!")).toBeInTheDocument();
  });

  it("displays sender names", () => {
    const store = mockStore({
      liveSession: { messages: sampleMessages },
    });
    render(
      <Provider store={store}>
        <ChatPanel />
      </Provider>
    );
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
  });

  it("displays timestamps", () => {
    const store = mockStore({
      liveSession: { messages: sampleMessages },
    });
    render(
      <Provider store={store}>
        <ChatPanel />
      </Provider>
    );
    const timestamps = screen.getAllByText(/^\d{1,2}[:.]\d{2}/);
    expect(timestamps.length).toBeGreaterThanOrEqual(2);
  });

  it("renders chat input", () => {
    const store = mockStore(defaultState);
    render(
      <Provider store={store}>
        <ChatPanel />
      </Provider>
    );
    expect(screen.getByLabelText("Chat message input")).toBeInTheDocument();
    expect(screen.getByLabelText("Send message")).toBeInTheDocument();
  });

  it("disables send button when input is empty", () => {
    const store = mockStore(defaultState);
    render(
      <Provider store={store}>
        <ChatPanel />
      </Provider>
    );
    expect(screen.getByLabelText("Send message")).toBeDisabled();
  });

  it("shows avatar initials for messages without avatar", () => {
    const store = mockStore({
      liveSession: { messages: sampleMessages },
    });
    render(
      <Provider store={store}>
        <ChatPanel />
      </Provider>
    );
    const avatarDivs = screen.getAllByText(/^[A-Z]$/);
    expect(avatarDivs.length).toBeGreaterThanOrEqual(2);
  });

  it("renders moderation button on hover", () => {
    const store = mockStore({
      liveSession: { messages: sampleMessages },
    });
    render(
      <Provider store={store}>
        <ChatPanel />
      </Provider>
    );
    const optionButtons = screen.getAllByLabelText("Message options");
    expect(optionButtons.length).toBe(2);
  });
});
