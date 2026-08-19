import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { describe, it, expect } from "vitest";
import configureStore from "redux-mock-store";
import BreakoutRooms from "../components/liveStudio/BreakoutRooms";

const mockStore = configureStore([]);

const defaultState = {
  liveSession: {
    breakoutRooms: [],
  },
};

const mockRooms = [
  {
    id: "room-1",
    name: "Group A",
    attendees: [
      { id: "a1", name: "Alice" },
      { id: "a2", name: "Bob" },
    ],
  },
  {
    id: "room-2",
    name: "Group B",
    attendees: [{ id: "a3", name: "Charlie" }],
  },
];

const mockAttendees = [
  { id: "a1", name: "Alice" },
  { id: "a2", name: "Bob" },
  { id: "a3", name: "Charlie" },
];

describe("BreakoutRooms", () => {
  it("renders empty state when no rooms", () => {
    const store = mockStore(defaultState);
    render(
      <Provider store={store}>
        <BreakoutRooms rooms={[]} sessionId="sess-1" attendees={mockAttendees} />
      </Provider>
    );
    expect(screen.getByTestId("breakout-rooms")).toBeInTheDocument();
    expect(screen.getByText("No breakout rooms created yet")).toBeInTheDocument();
  });

  it("renders breakout rooms header", () => {
    const store = mockStore(defaultState);
    render(
      <Provider store={store}>
        <BreakoutRooms rooms={[]} sessionId="sess-1" attendees={mockAttendees} />
      </Provider>
    );
    expect(screen.getByText("Breakout Rooms")).toBeInTheDocument();
  });

  it("displays room names and member counts", () => {
    const store = mockStore(defaultState);
    render(
      <Provider store={store}>
        <BreakoutRooms rooms={mockRooms} sessionId="sess-1" attendees={mockAttendees} />
      </Provider>
    );
    expect(screen.getByText("Group A")).toBeInTheDocument();
    expect(screen.getByText("Group B")).toBeInTheDocument();
    expect(screen.getByText("2 members")).toBeInTheDocument();
    expect(screen.getByText("1 member")).toBeInTheDocument();
  });

  it("displays assigned attendee names", () => {
    const store = mockStore(defaultState);
    render(
      <Provider store={store}>
        <BreakoutRooms rooms={mockRooms} sessionId="sess-1" attendees={mockAttendees} />
      </Provider>
    );
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
    expect(screen.getByText("Charlie")).toBeInTheDocument();
  });

  it("shows create room button", () => {
    const store = mockStore(defaultState);
    render(
      <Provider store={store}>
        <BreakoutRooms rooms={[]} sessionId="sess-1" attendees={mockAttendees} />
      </Provider>
    );
    expect(screen.getByText("+ Create Room")).toBeInTheDocument();
  });

  it("shows add members section for unassigned attendees", () => {
    const store = mockStore(defaultState);
    render(
      <Provider store={store}>
        <BreakoutRooms rooms={mockRooms} sessionId="sess-1" attendees={mockAttendees} />
      </Provider>
    );
    const addButtons = screen.getAllByText(/Add members/);
    expect(addButtons.length).toBeGreaterThan(0);
  });
});
