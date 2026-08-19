import PropTypes from "prop-types";

function VideoPanel({ isCameraOff, isScreenSharing, instructorName }) {
  const initial = instructorName ? instructorName.charAt(0).toUpperCase() : "I";

  if (isScreenSharing) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#111827] relative" data-testid="video-panel">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
            <svg className="w-8 h-8 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-gray-300 text-sm font-medium">Screen Share Active</p>
          <p className="text-gray-500 text-xs mt-1">Your screen is being shared</p>
        </div>
        <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-sm">
          <span className="text-sm text-white font-medium">{instructorName || "Instructor"}</span>
          <span className="ml-2 text-xs text-gray-400">(Host)</span>
        </div>
      </div>
    );
  }

  if (isCameraOff) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black relative" data-testid="video-panel">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-cyan-500/20">
            {initial}
          </div>
          <p className="text-gray-400 text-sm">Camera is off</p>
        </div>
        <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-sm">
          <span className="text-sm text-white font-medium">{instructorName || "Instructor"}</span>
          <span className="ml-2 text-xs text-gray-400">(Host)</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-[#111827] flex items-center justify-center relative" data-testid="video-panel">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-green-500/10 border border-green-500/30 flex items-center justify-center">
          <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </div>
        <p className="text-gray-300 text-sm font-medium">Camera Active</p>
        <p className="text-gray-500 text-xs mt-1">Video feed placeholder</p>
      </div>
      <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-sm">
        <span className="text-sm text-white font-medium">{instructorName || "Instructor"}</span>
        <span className="ml-2 text-xs text-gray-400">(Host)</span>
      </div>
    </div>
  );
}

VideoPanel.propTypes = {
  isCameraOff: PropTypes.bool.isRequired,
  isScreenSharing: PropTypes.bool.isRequired,
  instructorName: PropTypes.string,
};

export default VideoPanel;
