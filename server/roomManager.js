import { v4 as uuidv4 } from 'uuid';

class RoomManager {
  constructor() {
    this.rooms = new Map();
  }

  createRoom(creatorName) {
    const roomId = uuidv4().substring(0, 8);
    const room = {
      id: roomId,
      participants: new Map(),
      votes: new Map(),
      revealed: false,
      createdAt: Date.now(),
      currentRound: 1,
    };

    this.rooms.set(roomId, room);
    return roomId;
  }

  getRoom(roomId) {
    return this.rooms.get(roomId);
  }

  roomExists(roomId) {
    return this.rooms.has(roomId);
  }

  addParticipant(roomId, socketId, name) {
    const room = this.rooms.get(roomId);
    if (!room) return false;

    room.participants.set(socketId, {
      id: socketId,
      name: name || `Participant ${room.participants.size + 1}`,
      joinedAt: Date.now(),
      avatar: this.generateAvatarColor(name || socketId),
    });

    return true;
  }

  removeParticipant(roomId, socketId) {
    const room = this.rooms.get(roomId);
    if (!room) return false;

    room.participants.delete(socketId);
    room.votes.delete(socketId);

    // Clean up empty rooms
    if (room.participants.size === 0) {
      this.rooms.delete(roomId);
    }

    return true;
  }

  getParticipants(roomId) {
    const room = this.rooms.get(roomId);
    if (!room) return [];

    return Array.from(room.participants.values());
  }

  generateAvatarColor(name) {
    const colors = [
      { bg: 'from-purple-500 to-pink-500', text: 'text-white' },
      { bg: 'from-blue-500 to-cyan-500', text: 'text-white' },
      { bg: 'from-green-500 to-emerald-500', text: 'text-white' },
      { bg: 'from-orange-500 to-red-500', text: 'text-white' },
      { bg: 'from-indigo-500 to-purple-500', text: 'text-white' },
      { bg: 'from-pink-500 to-rose-500', text: 'text-white' },
      { bg: 'from-yellow-400 to-orange-500', text: 'text-white' },
      { bg: 'from-teal-500 to-blue-500', text: 'text-white' },
    ];

    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    const index = Math.abs(hash) % colors.length;
    return colors[index];
  }

  // Clean up old rooms (older than 24 hours)
  cleanupOldRooms() {
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    for (const [roomId, room] of this.rooms.entries()) {
      if (room.createdAt < oneDayAgo && room.participants.size === 0) {
        this.rooms.delete(roomId);
      }
    }
  }
}

export default new RoomManager();
