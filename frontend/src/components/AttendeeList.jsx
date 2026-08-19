import PropTypes from "prop-types";

function AttendeeList({ attendees }) {
  if (!attendees || attendees.length === 0) {
    return (
      <div className="p-4" data-testid="attendee-list">
        <p className="text-gray-500 text-xs text-center">No attendees yet</p>
      </div>
    );
  }

  const instructors = attendees.filter((a) => a.role === "Instructor");
  const others = attendees.filter((a) => a.role !== "Instructor");

  return (
    <div className="h-full overflow-y-auto px-3 py-3" data-testid="attendee-list">
      {instructors.length > 0 && (
        <div className="mb-3">
          <h4 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Instructors ({instructors.length})
          </h4>
          <div className="space-y-1">
            {instructors.map((a) => (
              <AttendeeRow key={a.id} attendee={a} />
            ))}
          </div>
        </div>
      )}

      {others.length > 0 && (
        <div>
          <h4 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Students ({others.length})
          </h4>
          <div className="space-y-1">
            {others.map((a) => (
              <AttendeeRow key={a.id} attendee={a} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

AttendeeList.propTypes = {
  attendees: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      role: PropTypes.oneOf(["Instructor", "Learner", "TA"]).isRequired,
      status: PropTypes.oneOf(["online", "away", "offline"]),
      avatar: PropTypes.string,
    })
  ).isRequired,
};

function AttendeeRow({ attendee }) {
  const statusColors = { online: "bg-green-400", away: "bg-yellow-400", offline: "bg-gray-500" };
  const dot = statusColors[attendee.status] || statusColors.offline;

  return (
    <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-gray-800/40 transition-colors">
      <div className="relative flex-shrink-0">
        {attendee.avatar ? (
          <img src={attendee.avatar} alt={attendee.name} className="w-7 h-7 rounded-full object-cover" />
        ) : (
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-[10px] font-bold text-white">
            {attendee.name.charAt(0).toUpperCase()}
          </div>
        )}
        <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#111827] ${dot}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-white truncate">{attendee.name}</p>
        <p className="text-[9px] text-gray-500">{attendee.role}</p>
      </div>
    </div>
  );
}

AttendeeRow.propTypes = {
  attendee: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    role: PropTypes.oneOf(["Instructor", "Learner", "TA"]).isRequired,
    status: PropTypes.oneOf(["online", "away", "offline"]),
    avatar: PropTypes.string,
  }).isRequired,
};

export default AttendeeList;
