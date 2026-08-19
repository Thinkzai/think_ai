import { useState } from "react";
import PropTypes from "prop-types";

function BreakoutRooms({ rooms, attendees, isHost, onCreateRoom, onAssign }) {
  const [showCreate, setShowCreate] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);

  const handleCreate = () => {
    if (!roomName.trim()) return;
    onCreateRoom({ name: roomName.trim(), attendeeIds: selectedIds });
    setRoomName("");
    setSelectedIds([]);
    setShowCreate(false);
  };

  const toggleSelect = (id) =>
    setSelectedIds((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  return (
    <div className="p-4" data-testid="breakout-rooms">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-semibold text-white">Breakout Rooms</h3>
        {isHost && (
          <button onClick={() => setShowCreate(!showCreate)}
            className="text-[10px] px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition-colors">
            {showCreate ? "Cancel" : "+ Create Room"}
          </button>
        )}
      </div>

      {showCreate && (
        <div className="mb-3 p-3 rounded-xl bg-gray-800/40 border border-gray-700">
          <input type="text" value={roomName} onChange={(e) => setRoomName(e.target.value)}
            placeholder="Room name..." aria-label="Breakout room name"
            className="w-full bg-gray-900/60 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 mb-2" />
          {attendees && attendees.length > 0 && (
            <div className="mb-2">
              <p className="text-[10px] text-gray-400 mb-1.5">Assign attendees:</p>
              <div className="space-y-1 max-h-24 overflow-y-auto">
                {attendees.map((a) => (
                  <label key={a.id} className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-800/40 cursor-pointer">
                    <input type="checkbox" checked={selectedIds.includes(a.id)} onChange={() => toggleSelect(a.id)} className="custom-checkbox" />
                    <span className="text-[11px] text-gray-300">{a.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
          <button onClick={handleCreate} disabled={!roomName.trim()}
            className="w-full text-[10px] px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 disabled:opacity-40 transition-colors">
            Create Room
          </button>
        </div>
      )}

      {(!rooms || rooms.length === 0) ? (
        <div className="flex items-center justify-center h-16 rounded-xl bg-gray-800/20 border border-gray-700/30">
          <p className="text-gray-500 text-xs">No breakout rooms</p>
        </div>
      ) : (
        <div className="space-y-2">
          {rooms.map((room) => (
            <div key={room.id} className="p-3 rounded-xl bg-gray-800/30 border border-gray-700/50">
              <div className="flex items-center justify-between mb-1.5">
                <h4 className="text-xs font-medium text-white">{room.name}</h4>
                <span className="text-[9px] text-gray-500">
                  {room.attendees?.length || 0} member{(room.attendees?.length || 0) !== 1 ? "s" : ""}
                </span>
              </div>
              {room.attendees && room.attendees.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-1.5">
                  {room.attendees.map((a) => (
                    <span key={a.id} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-700/50 text-[9px] text-gray-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                      {a.name}
                    </span>
                  ))}
                </div>
              )}
              {isHost && attendees && (
                <div className="pt-1.5 border-t border-gray-700/50">
                  <div className="flex flex-wrap gap-1">
                    {attendees.filter((a) => !room.attendees?.some((ra) => ra.id === a.id)).slice(0, 5).map((a) => (
                      <button key={a.id} onClick={() => onAssign(room.id, a.id)}
                        className="text-[9px] px-1.5 py-0.5 rounded bg-gray-700/40 text-gray-400 hover:bg-cyan-500/20 hover:text-cyan-400 transition-colors">
                        + {a.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

BreakoutRooms.propTypes = {
  rooms: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired, name: PropTypes.string.isRequired, attendees: PropTypes.array,
  })),
  attendees: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.string.isRequired, name: PropTypes.string.isRequired })),
  isHost: PropTypes.bool.isRequired,
  onCreateRoom: PropTypes.func.isRequired,
  onAssign: PropTypes.func.isRequired,
};

export default BreakoutRooms;
