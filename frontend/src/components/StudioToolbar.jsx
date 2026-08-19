import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import {
  toggleMute,
  toggleCamera,
  toggleScreenShare,
  selectIsMuted,
  selectIsCameraOff,
  selectIsScreenSharing,
} from "../features/liveSession/liveSessionSlice";

function StudioToolbar({ onLeave }) {
  const dispatch = useDispatch();
  const isMuted = useSelector(selectIsMuted);
  const isCameraOff = useSelector(selectIsCameraOff);
  const isScreenSharing = useSelector(selectIsScreenSharing);

  const buttons = [
    {
      id: "mic",
      label: isMuted ? "Unmute" : "Mute",
      icon: isMuted ? MicOffIcon : MicOnIcon,
      active: !isMuted,
      danger: isMuted,
      onClick: () => dispatch(toggleMute()),
    },
    {
      id: "camera",
      label: isCameraOff ? "Start Video" : "Stop Video",
      icon: isCameraOff ? CameraOffIcon : CameraOnIcon,
      active: !isCameraOff,
      danger: isCameraOff,
      onClick: () => dispatch(toggleCamera()),
    },
    {
      id: "screen-share",
      label: isScreenSharing ? "Stop Share" : "Share Screen",
      icon: ScreenShareIcon,
      active: isScreenSharing,
      onClick: () => dispatch(toggleScreenShare()),
    },
    {
      id: "leave",
      label: "Leave",
      icon: LeaveIcon,
      danger: true,
      onClick: onLeave,
    },
  ];

  return (
    <div className="flex items-center justify-center gap-3 px-6 py-3 bg-[#0D1220] border-t border-gray-800" data-testid="studio-toolbar">
      {buttons.map((btn) => (
        <button
          key={btn.id}
          onClick={btn.onClick}
          aria-label={btn.label}
          className={`flex flex-col items-center gap-1.5 px-4 py-2.5 rounded-xl transition-all duration-200 ${
            btn.id === "leave"
              ? "bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30"
              : btn.active
              ? "bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/30"
              : btn.danger
              ? "bg-gray-700/50 hover:bg-gray-600/50 text-gray-400 border border-gray-700"
              : "bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 border border-gray-700"
          }`}
        >
          <btn.icon className="w-5 h-5" />
          <span className="text-[10px] font-medium">{btn.label}</span>
        </button>
      ))}
    </div>
  );
}

StudioToolbar.propTypes = {
  onLeave: PropTypes.func.isRequired,
};

function MicOnIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
    </svg>
  );
}

function MicOffIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
      <line x1="4" y1="4" x2="20" y2="20" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
    </svg>
  );
}

function CameraOnIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  );
}

function CameraOffIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      <line x1="3" y1="3" x2="21" y2="21" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
    </svg>
  );
}

function ScreenShareIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

function LeaveIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  );
}

export default StudioToolbar;
