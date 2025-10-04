# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Planning Poker** - A real-time collaborative estimation app for agile teams built with Node.js/Express backend and React frontend, featuring WebSocket-based synchronization via Socket.io.

## Tech Stack

**Backend (server/):**
- Express.js with Socket.io for real-time communication
- In-memory data storage (rooms, votes, participants)
- ES modules (type: "module")

**Frontend (client/):**
- React 18 with Vite build tool
- Tailwind CSS for styling with custom glass morphism design
- Framer Motion for animations
- Canvas Confetti for celebration effects
- Socket.io-client for real-time updates

## Development Commands

**Install dependencies (first time):**
```bash
npm run install-all
```

**Start development (both servers):**
```bash
npm run dev
```

**Backend only:**
```bash
npm run server
# or
cd server && npm run dev
```

**Frontend only:**
```bash
npm run client
# or
cd client && npm run dev
```

**Build for production:**
```bash
npm run build
```

## Architecture

### Backend Architecture (server/)

**Entry Point:** `index.js`
- Express HTTP server + Socket.io WebSocket server
- CORS enabled for local development (port 5173)
- REST endpoints for room creation and validation
- Socket.io event handlers for real-time room operations

**Room Management:** `roomManager.js`
- Singleton managing Map of active rooms
- Participant tracking with auto-generated gradient avatars
- Automatic cleanup of empty/old rooms (24h)

**Vote Management:** `voteManager.js`
- Vote submission and storage per room
- Statistical calculations (average, median, consensus detection)
- Fun stats generation (optimist, pessimist, fastest voter)
- Vote distribution tracking

**Socket.io Events:**
- `join-room` - Participant joins with name
- `submit-vote` - Submit vote value
- `reveal-votes` - Trigger vote reveal
- `reset-voting` - Start new round
- `send-reaction` - Broadcast emoji reaction

### Frontend Architecture (client/src/)

**Routing:** React Router with 2 routes
- `/` - Home (create/join room)
- `/room/:roomId` - Voting room interface

**Components:**
- `Home.jsx` - Landing page with room creation/joining
- `Room.jsx` - Main voting interface with socket management
- `VotingCard.jsx` - Individual voting cards with animations
- `ParticipantList.jsx` - Live participant grid with vote status
- `Results.jsx` - Statistics display with confetti on consensus

**Hooks:**
- `useSocket.js` - Socket.io connection management

**Styling:**
- Glass morphism design pattern (backdrop-blur + transparency)
- Custom Tailwind utilities: `.glass`, `.glass-hover`, `.gradient-text`, `.btn-primary`
- Color palette: Purple/Pink gradients with cyan/teal accents
- Dark background with gradient overlays

## Code Patterns

### Socket Event Flow
1. User action triggers socket emit
2. Backend validates and updates in-memory state
3. Backend broadcasts to all room participants via `io.to(roomId).emit()`
4. All clients receive update and sync UI state

### State Management
- React useState for local component state
- Socket.io events for cross-client synchronization
- No Redux/Context - socket events handle global state

### Voting Scale
Fibonacci: `0, 1, 2, 3, 5, 8, 13, 21` + special cards `?` and `☕`

### Fun Features
- **Confetti:** Triggered on consensus (all votes within 2 points)
- **Sounds:** Web Audio API for vote/reveal/join feedback
- **Reactions:** 8 emoji reactions with floating animations
- **Stats:** Optimist (highest), Pessimist (lowest), Fastest voter

## Development Notes

- **Room IDs:** 8-character UUID substrings
- **Data Persistence:** None - all data in-memory (rooms cleaned after 24h)
- **Participant Avatars:** Generated from name hash → gradient color from palette
- **Consensus Logic:** All votes within 2 points OR all identical
- **Reveal Requirements:** All participants must vote before reveal enabled

## Common Tasks

**Add new voting card value:**
1. Edit `CARD_VALUES` array in `client/src/components/VotingCard.jsx`
2. Card automatically appears in voting interface

**Modify statistics calculations:**
1. Edit `voteManager.js` → `revealVotes()` or `calculateFunStats()` methods
2. Update `Results.jsx` component to display new stats

**Change design colors:**
1. Edit Tailwind config in `client/tailwind.config.js`
2. Update gradient classes in `client/src/index.css`
3. Modify avatar color palette in `server/roomManager.js` → `generateAvatarColor()`

**Add new socket event:**
1. Add event handler in `server/index.js` → `io.on('connection', ...)`
2. Add corresponding listener in `client/src/components/Room.jsx` → `useEffect(...)`
3. Emit from UI action handler

## Port Configuration

- Backend: `3001` (configurable via `process.env.PORT`)
- Frontend: `5173` (Vite default)
- Socket.io CORS allows frontend port only

## Known Constraints

- In-memory storage only (no database)
- Audio requires user interaction to enable
- Room cleanup runs hourly
- No authentication/authorization
- Single server instance (no horizontal scaling)
