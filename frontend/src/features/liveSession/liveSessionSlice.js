import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchSessionApi,
  fetchAttendeesApi,
  createPollApi,
  votePollApi,
  fetchPollResultsApi,
  fetchBreakoutRoomsApi,
  createBreakoutRoomApi,
  assignToBreakoutRoomApi,
} from "./liveSessionService";

export const fetchSession = createAsyncThunk(
  "liveSession/fetchSession",
  async (sessionId, { rejectWithValue }) => {
    try {
      const response = await fetchSessionApi(sessionId);
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch session"
      );
    }
  }
);

export const fetchAttendees = createAsyncThunk(
  "liveSession/fetchAttendees",
  async (sessionId, { rejectWithValue }) => {
    try {
      const response = await fetchAttendeesApi(sessionId);
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch attendees"
      );
    }
  }
);

export const createPoll = createAsyncThunk(
  "liveSession/createPoll",
  async ({ sessionId, pollData }, { rejectWithValue }) => {
    try {
      const response = await createPollApi(sessionId, pollData);
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create poll"
      );
    }
  }
);

export const votePoll = createAsyncThunk(
  "liveSession/votePoll",
  async ({ pollId, optionIndex }, { rejectWithValue }) => {
    try {
      const response = await votePollApi(pollId, optionIndex);
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to vote"
      );
    }
  }
);

export const fetchPollResults = createAsyncThunk(
  "liveSession/fetchPollResults",
  async (pollId, { rejectWithValue }) => {
    try {
      const response = await fetchPollResultsApi(pollId);
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch poll results"
      );
    }
  }
);

export const fetchBreakoutRooms = createAsyncThunk(
  "liveSession/fetchBreakoutRooms",
  async (sessionId, { rejectWithValue }) => {
    try {
      const response = await fetchBreakoutRoomsApi(sessionId);
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch breakout rooms"
      );
    }
  }
);

export const createBreakoutRoom = createAsyncThunk(
  "liveSession/createBreakoutRoom",
  async ({ sessionId, roomData }, { rejectWithValue }) => {
    try {
      const response = await createBreakoutRoomApi(sessionId, roomData);
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create breakout room"
      );
    }
  }
);

export const assignToBreakoutRoom = createAsyncThunk(
  "liveSession/assignToBreakoutRoom",
  async ({ roomId, attendeeId }, { rejectWithValue }) => {
    try {
      const response = await assignToBreakoutRoomApi(roomId, attendeeId);
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to assign attendee"
      );
    }
  }
);

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

const liveSessionSlice = createSlice({
  name: "liveSession",
  initialState,
  reducers: {
    toggleMute(state) {
      state.isMuted = !state.isMuted;
    },
    toggleCamera(state) {
      state.isCameraOff = !state.isCameraOff;
    },
    toggleScreenShare(state) {
      state.isScreenSharing = !state.isScreenSharing;
    },
    addMessage(state, action) {
      state.messages.push(action.payload);
    },
    setConnectionStatus(state, action) {
      state.isConnected = action.payload;
    },
    setActivePoll(state, action) {
      state.activePoll = action.payload;
    },
    updatePollResults(state, action) {
      const { pollId, results } = action.payload;
      const poll = state.polls.find((p) => p.id === pollId);
      if (poll) {
        poll.results = results;
      }
    },
    updateAttendeeStatus(state, action) {
      const { attendeeId, status } = action.payload;
      const attendee = state.attendees.find((a) => a.id === attendeeId);
      if (attendee) {
        attendee.status = status;
      }
    },
    removeAttendee(state, action) {
      state.attendees = state.attendees.filter(
        (a) => a.id !== action.payload
      );
    },
    addAttendee(state, action) {
      state.attendees.push(action.payload);
    },
    clearSession(state) {
      state.session = null;
      state.attendees = [];
      state.messages = [];
      state.polls = [];
      state.activePoll = null;
      state.breakoutRooms = [];
      state.isMuted = true;
      state.isCameraOff = true;
      state.isScreenSharing = false;
      state.isConnected = false;
      state.error = null;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(fetchSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSession.fulfilled, (state, action) => {
        state.loading = false;
        state.session = action.payload;
      })
      .addCase(fetchSession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchAttendees.fulfilled, (state, action) => {
        state.attendees = action.payload;
      })

      .addCase(createPoll.fulfilled, (state, action) => {
        state.polls.push(action.payload);
        state.activePoll = action.payload;
      })

      .addCase(votePoll.fulfilled, (state, action) => {
        const { pollId, results } = action.payload;
        const poll = state.polls.find((p) => p.id === pollId);
        if (poll) {
          poll.results = results;
        }
      })

      .addCase(fetchPollResults.fulfilled, (state, action) => {
        const { pollId, results } = action.payload;
        const poll = state.polls.find((p) => p.id === pollId);
        if (poll) {
          poll.results = results;
        }
      })

      .addCase(fetchBreakoutRooms.fulfilled, (state, action) => {
        state.breakoutRooms = action.payload;
      })

      .addCase(createBreakoutRoom.fulfilled, (state, action) => {
        state.breakoutRooms.push(action.payload);
      })

      .addCase(assignToBreakoutRoom.fulfilled, (state, action) => {
        const { roomId, attendee } = action.payload;
        const room = state.breakoutRooms.find((r) => r.id === roomId);
        if (room) {
          room.attendees = room.attendees || [];
          room.attendees.push(attendee);
        }
      });
  },
});

export const {
  toggleMute,
  toggleCamera,
  toggleScreenShare,
  addMessage,
  setConnectionStatus,
  setActivePoll,
  updatePollResults,
  updateAttendeeStatus,
  removeAttendee,
  addAttendee,
  clearSession,
  clearError,
} = liveSessionSlice.actions;

export const selectSession = (state) => state.liveSession.session;
export const selectAttendees = (state) => state.liveSession.attendees;
export const selectMessages = (state) => state.liveSession.messages;
export const selectPolls = (state) => state.liveSession.polls;
export const selectActivePoll = (state) => state.liveSession.activePoll;
export const selectBreakoutRooms = (state) => state.liveSession.breakoutRooms;
export const selectIsMuted = (state) => state.liveSession.isMuted;
export const selectIsCameraOff = (state) => state.liveSession.isCameraOff;
export const selectIsScreenSharing = (state) =>
  state.liveSession.isScreenSharing;
export const selectIsConnected = (state) => state.liveSession.isConnected;
export const selectSessionLoading = (state) => state.liveSession.loading;
export const selectSessionError = (state) => state.liveSession.error;

export default liveSessionSlice.reducer;
