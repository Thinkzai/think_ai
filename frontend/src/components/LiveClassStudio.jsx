import { useEffect, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSession,
  fetchAttendees,
  fetchBreakoutRooms,
  selectSession,
  selectAttendees,
  selectMessages,
  selectBreakoutRooms,
  selectIsConnected,
  selectSessionLoading,
  selectSessionError,
  addMessage,
  addAttendee,
  removeAttendee,
  setConnectionStatus,
  clearSession,
} from "../features/liveSession/liveSessionSlice";
import chatSocket from "../services/chatSocket";
import VideoPanel from "./VideoPanel";
import StudioToolbar from "./StudioToolbar";
import AttendeeList from "./AttendeeList";
import ChatPanel from "./ChatPanel";
import PollPanel from "./PollPanel";
import BreakoutRooms from "./BreakoutRooms";

const DEMO_ATTENDEES = [
  { id: "s1", name: "Dr. Sarah Chen", role: "Instructor", status: "online" },
  { id: "s2", name: "Alex Kumar", role: "Learner", status: "online" },
  { id: "s3", name: "Maria Garcia", role: "Learner", status: "online" },
  { id: "s4", name: "James Wilson", role: "Learner", status: "away" },
  { id: "s5", name: "Priya Patel", role: "Learner", status: "online" },
  { id: "s6", name: "Tom Anderson", role: "Learner", status: "online" },
  { id: "s7", name: "Lisa Nakamura", role: "TA", status: "online" },
];

const DEMO_MESSAGES = [
  { id: "m1", senderName: "Alex Kumar", content: "Can you explain the binary search tree traversal again?", timestamp: new Date(Date.now() - 300000).toISOString() },
  { id: "m2", senderName: "Dr. Sarah Chen", content: "Sure! In-order traversal visits left subtree, then root, then right subtree.", timestamp: new Date(Date.now() - 240000).toISOString() },
  { id: "m3", senderName: "Maria Garcia", content: "Is that always O(n) time complexity?", timestamp: new Date(Date.now() - 180000).toISOString() },
  { id: "m4", senderName: "Dr. Sarah Chen", content: "Yes, we visit each node exactly once.", timestamp: new Date(Date.now() - 120000).toISOString() },
  { id: "m5", senderName: "Priya Patel", content: "Thanks, that makes sense now!", timestamp: new Date(Date.now() - 60000).toISOString() },
];

const DEMO_POLL = {
  id: "poll-1",
  question: "What is the time complexity of binary search?",
  options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
};

const DEMO_ROOMS = [
  { id: "room-1", name: "Group A - Trees", attendees: [{ id: "s2", name: "Alex Kumar" }, { id: "s5", name: "Priya Patel" }] },
  { id: "room-2", name: "Group B - Graphs", attendees: [{ id: "s3", name: "Maria Garcia" }, { id: "s6", name: "Tom Anderson" }] },
];

function LiveClassStudio({ sessionId: sessionIdProp, onLeave }) {
  const dispatch = useDispatch();
  const sessionId = sessionIdProp || "demo-session";
  const session = useSelector(selectSession);
  const attendees = useSelector(selectAttendees);
  const breakoutRooms = useSelector(selectBreakoutRooms);
  const isConnected = useSelector(selectIsConnected);
  const loading = useSelector(selectSessionLoading);
  const error = useSelector(selectSessionError);

  const handleConnect = useCallback(() => {
    const token = localStorage.getItem("token");
    chatSocket.connect(sessionId, "current-user", token);

    chatSocket.on("connected", () => dispatch(setConnectionStatus(true)));
    chatSocket.on("disconnected", () => dispatch(setConnectionStatus(false)));
    chatSocket.on("chat:message", (payload) => dispatch(addMessage(payload)));
    chatSocket.on("attendee:joined", (payload) => dispatch(addAttendee(payload)));
    chatSocket.on("attendee:left", (payload) => dispatch(removeAttendee(payload.id)));
  }, [sessionId, dispatch]);

  const handleDisconnect = useCallback(() => {
    chatSocket.disconnect();
    dispatch(clearSession());
  }, [dispatch]);

  useEffect(() => {
    if (sessionId) {
      dispatch(fetchSession(sessionId));
      dispatch(fetchAttendees(sessionId));
      dispatch(fetchBreakoutRooms(sessionId));
      handleConnect();
    }
    return () => handleDisconnect();
  }, [sessionId, dispatch, handleConnect, handleDisconnect]);

  const handleLeave = () => { handleDisconnect(); onLeave?.(); };
  const handleSendMessage = (content) => chatSocket.sendMessage(content);

  const displaySession = session || { title: "Advanced Data Structures", instructorName: "Dr. Sarah Chen" };
  const displayAttendees = attendees.length > 0 ? attendees : DEMO_ATTENDEES;
  const displayMessages = useSelector(selectMessages);
  const allMessages = displayMessages.length > 0 ? displayMessages : DEMO_MESSAGES;
  const displayRooms = breakoutRooms.length > 0 ? breakoutRooms : DEMO_ROOMS;

  if (loading && !session) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0B0F19]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-400 mt-4">Joining live class...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#0B0F19] text-white" data-testid="live-class-studio">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-gray-800 bg-[#0D1220]/80 backdrop-blur-sm flex-shrink-0">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold text-white truncate max-w-md">{displaySession.title}</h1>
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            LIVE
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-400" : "bg-yellow-400"}`} />
          <span className="text-xs text-gray-400">{isConnected ? "Connected" : "Reconnecting..."}</span>
          <span className="text-xs text-gray-500">{displayAttendees.length} attendee{displayAttendees.length !== 1 ? "s" : ""}</span>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden min-h-0">
        {/* Left: Video + Toolbar + Poll + Breakout */}
        <div className="flex flex-col flex-1 min-w-0">
          {/* Video */}
          <div className="flex-1 relative bg-black min-h-0">
            <VideoPanel
              isCameraOff={true}
              isScreenSharing={false}
              instructorName={displaySession.instructorName}
            />
          </div>

          {/* Toolbar */}
          <StudioToolbar onLeave={handleLeave} />

          {/* Bottom section: Poll + Breakout side by side */}
          <div className="flex border-t border-gray-800 max-h-[220px]">
            <div className="flex-1 border-r border-gray-800 overflow-y-auto">
              <PollPanel
                isHost={true}
                activePoll={DEMO_POLL}
                onCreatePoll={() => {}}
                onVote={() => {}}
              />
            </div>
            <div className="w-[340px] overflow-y-auto">
              <BreakoutRooms
                rooms={displayRooms}
                attendees={displayAttendees}
                isHost={true}
                onCreateRoom={() => {}}
                onAssign={() => {}}
              />
            </div>
          </div>
        </div>

        {/* Right Panel: Attendees + Chat */}
        <aside className="w-80 border-l border-gray-800 flex flex-col bg-[#0D1220]/60 flex-shrink-0">
          {/* Attendees section */}
          <div className="border-b border-gray-800 max-h-[40%] overflow-y-auto">
            <div className="px-3 pt-3 pb-1">
              <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                Attendees ({displayAttendees.length})
              </h3>
            </div>
            <AttendeeList attendees={displayAttendees} />
          </div>

          {/* Chat section */}
          <div className="flex-1 min-h-0 flex flex-col">
            <div className="px-3 pt-3 pb-1 border-b border-gray-800/50">
              <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Live Chat</h3>
            </div>
            <div className="flex-1 min-h-0">
              <ChatPanel messages={allMessages} onSendMessage={handleSendMessage} />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default LiveClassStudio;
