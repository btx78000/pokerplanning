import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import roomManager from './roomManager.js';
import voteManager from './voteManager.js';

const app = express();
const httpServer = createServer(app);

// CORS configuration
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  methods: ['GET', 'POST'],
  credentials: true,
};

const io = new Server(httpServer, {
  cors: corsOptions,
  allowEIO3: true,
  transports: ['websocket', 'polling'],
  allowUpgrades: true,
});

app.use(cors(corsOptions));
app.use(express.json());

// REST API endpoints
app.post('/api/rooms', (req, res) => {
  const { creatorName } = req.body;
  const roomId = roomManager.createRoom(creatorName);
  res.json({ roomId });
});

app.get('/api/rooms/:roomId', (req, res) => {
  const { roomId } = req.params;
  const exists = roomManager.roomExists(roomId);

  if (exists) {
    res.json({ exists: true });
  } else {
    res.status(404).json({ exists: false, error: 'Room not found' });
  }
});

// Socket.io event handlers
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('join-room', ({ roomId, name }) => {
    const room = roomManager.getRoom(roomId);

    if (!room) {
      socket.emit('error', { message: 'Room not found' });
      return;
    }

    // Add participant and join socket room
    roomManager.addParticipant(roomId, socket.id, name);
    socket.join(roomId);

    // Send current room state to the new participant
    const participants = roomManager.getParticipants(roomId);
    const voteStatus = voteManager.getVoteStatus(room);
    const votes = voteManager.getVotes(room);

    socket.emit('room-joined', {
      roomId,
      participants,
      voteStatus,
      votes,
      revealed: room.revealed,
      currentRound: room.currentRound,
    });

    // Notify others about the new participant
    socket.to(roomId).emit('participant-joined', {
      participants,
      voteStatus,
    });

    console.log(`${name} joined room ${roomId}`);
  });

  socket.on('submit-vote', ({ roomId, value }) => {
    const room = roomManager.getRoom(roomId);

    if (!room) {
      socket.emit('error', { message: 'Room not found' });
      return;
    }

    const success = voteManager.submitVote(room, socket.id, value);

    if (success) {
      const voteStatus = voteManager.getVoteStatus(room);

      // Notify all participants about vote status update
      io.to(roomId).emit('vote-submitted', {
        voteStatus,
        participantId: socket.id,
      });

      console.log(`Vote submitted in room ${roomId}:`, value);
    }
  });

  socket.on('reveal-votes', ({ roomId }) => {
    const room = roomManager.getRoom(roomId);

    if (!room) {
      socket.emit('error', { message: 'Room not found' });
      return;
    }

    const results = voteManager.revealVotes(room);

    // Broadcast results to all participants
    io.to(roomId).emit('votes-revealed', results);

    console.log(`Votes revealed in room ${roomId}`);
  });

  socket.on('reset-voting', ({ roomId }) => {
    const room = roomManager.getRoom(roomId);

    if (!room) {
      socket.emit('error', { message: 'Room not found' });
      return;
    }

    voteManager.resetVoting(room);
    const voteStatus = voteManager.getVoteStatus(room);

    // Notify all participants about reset
    io.to(roomId).emit('voting-reset', {
      voteStatus,
      currentRound: room.currentRound,
    });

    console.log(`Voting reset in room ${roomId}`);
  });

  socket.on('send-reaction', ({ roomId, emoji }) => {
    const room = roomManager.getRoom(roomId);

    if (!room) return;

    const participant = room.participants.get(socket.id);

    // Broadcast reaction to all participants
    socket.to(roomId).emit('reaction-received', {
      participantId: socket.id,
      participantName: participant?.name,
      emoji,
    });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);

    // Find and remove participant from all rooms
    for (const [roomId, room] of roomManager.rooms.entries()) {
      if (room.participants.has(socket.id)) {
        const wasRevealed = room.revealed;
        roomManager.removeParticipant(roomId, socket.id);

        const participants = roomManager.getParticipants(roomId);
        const voteStatus = voteManager.getVoteStatus(room);
        const votes = voteManager.getVotes(room);

        // If votes were revealed, recalculate results
        let results = null;
        if (wasRevealed && room.votes.size > 0) {
          results = voteManager.revealVotes(room);
        }

        // Notify remaining participants
        io.to(roomId).emit('participant-left', {
          participants,
          voteStatus,
          votes,
          results,
        });

        console.log(`Participant left room ${roomId}`);
      }
    }
  });
});

// Cleanup old rooms every hour
setInterval(() => {
  roomManager.cleanupOldRooms();
  console.log('Cleaned up old rooms');
}, 60 * 60 * 1000);

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
