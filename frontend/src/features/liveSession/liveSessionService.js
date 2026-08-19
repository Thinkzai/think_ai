import apiClient from "../../services/apiClient";

export const fetchSessionApi = (sessionId) =>
  apiClient.get(`/live-sessions/${sessionId}`);

export const fetchAttendeesApi = (sessionId) =>
  apiClient.get(`/live-sessions/${sessionId}/attendees`);

export const createPollApi = (sessionId, pollData) =>
  apiClient.post(`/live-sessions/${sessionId}/polls`, pollData);

export const votePollApi = (pollId, optionIndex) =>
  apiClient.post(`/polls/${pollId}/vote`, { optionIndex });

export const fetchPollResultsApi = (pollId) =>
  apiClient.get(`/polls/${pollId}/results`);

export const fetchBreakoutRoomsApi = (sessionId) =>
  apiClient.get(`/live-sessions/${sessionId}/breakout-rooms`);

export const createBreakoutRoomApi = (sessionId, roomData) =>
  apiClient.post(`/live-sessions/${sessionId}/breakout-rooms`, roomData);

export const assignToBreakoutRoomApi = (roomId, attendeeId) =>
  apiClient.post(`/breakout-rooms/${roomId}/assign`, { attendeeId });
