import { describe, it, expect } from "vitest";
import reducer, {
  toggleMute,
  toggleCamera,
  toggleScreenShare,
  addMessage,
  setConnectionStatus,
  addAttendee,
  removeAttendee,
  clearSession,
  clearError,
} from "../features/liveSession/liveSessionSlice";

const initialState = {
  session: null,
  attendees: [],
  messages: [],
  polls: [],
  activePoll: null,
  breakoutRooms: [],
  isMuted: true,
  isCameraOff: true,
  isScreenSharing: false,
  isConnected: false,
  loading: false,
  error: null,
};

describe("liveSessionSlice", () => {
  it("should return the initial state", () => {
    expect(reducer(undefined, { type: "unknown" })).toEqual(initialState);
  });

  it("should handle toggleMute", () => {
    const state = reducer(initialState, toggleMute());
    expect(state.isMuted).toBe(false);
  });

  it("should toggle mute back to true", () => {
    const state = reducer(
      { ...initialState, isMuted: false },
      toggleMute()
    );
    expect(state.isMuted).toBe(true);
  });

  it("should handle toggleCamera", () => {
    const state = reducer(initialState, toggleCamera());
    expect(state.isCameraOff).toBe(false);
  });

  it("should handle toggleScreenShare", () => {
    const state = reducer(initialState, toggleScreenShare());
    expect(state.isScreenSharing).toBe(true);
  });

  it("should handle addMessage", () => {
    const message = {
      id: "msg-1",
      senderName: "Alice",
      content: "Hello",
      timestamp: "2025-01-15T10:00:00Z",
    };
    const state = reducer(initialState, addMessage(message));
    expect(state.messages).toHaveLength(1);
    expect(state.messages[0].content).toBe("Hello");
  });

  it("should handle setConnectionStatus", () => {
    const state = reducer(initialState, setConnectionStatus(true));
    expect(state.isConnected).toBe(true);
  });

  it("should handle addAttendee", () => {
    const attendee = { id: "a1", name: "Bob", role: "Learner" };
    const state = reducer(initialState, addAttendee(attendee));
    expect(state.attendees).toHaveLength(1);
    expect(state.attendees[0].name).toBe("Bob");
  });

  it("should handle removeAttendee", () => {
    const stateWithAttendee = {
      ...initialState,
      attendees: [{ id: "a1", name: "Bob", role: "Learner" }],
    };
    const state = reducer(stateWithAttendee, removeAttendee("a1"));
    expect(state.attendees).toHaveLength(0);
  });

  it("should handle clearSession", () => {
    const dirtyState = {
      ...initialState,
      session: { id: "s1" },
      attendees: [{ id: "a1" }],
      messages: [{ id: "m1" }],
      isConnected: true,
    };
    const state = reducer(dirtyState, clearSession());
    expect(state.session).toBeNull();
    expect(state.attendees).toHaveLength(0);
    expect(state.messages).toHaveLength(0);
    expect(state.isConnected).toBe(false);
  });

  it("should handle clearError", () => {
    const stateWithError = {
      ...initialState,
      error: "Some error",
    };
    const state = reducer(stateWithError, clearError());
    expect(state.error).toBeNull();
  });
});
