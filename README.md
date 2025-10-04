# Planning Poker 🎴

A fun and colorful real-time Planning Poker application built with Node.js and React. Perfect for agile teams to estimate story points collaboratively!

## ✨ Features

- 🎯 **Real-time Voting**: Instant vote synchronization with Socket.io
- 🎴 **Room System**: Create rooms and share links with your team
- 📊 **Smart Statistics**: Average, median, and vote distribution
- 🎉 **Fun Animations**: Card flips, confetti on consensus, floating reactions
- 🎨 **Modern Design**: Colorful gradients and glass morphism UI
- 🎭 **Fun Stats**: "Most Optimistic", "Most Conservative", "Fastest Voter"
- 😄 **Reactions**: Send emoji reactions to your team
- 🔊 **Sound Effects**: Satisfying audio feedback for actions
- 📱 **Responsive**: Works on desktop, tablet, and mobile

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

#### Windows (Méthode Rapide) 🪟

1. **Installer les dépendances:**
   Double-cliquez sur `install.bat`

2. **Lancer l'application:**
   Double-cliquez sur `start.bat`

3. **Arrêter les serveurs:**
   Double-cliquez sur `stop.bat`

4. **Redémarrer l'application:**
   Double-cliquez sur `restart.bat` (arrête puis relance)

5. **Ouvrir le navigateur:**
   Naviguez vers `http://localhost:5173`

   **Important:** Si vous avez des problèmes, faites `Ctrl + Shift + R` pour vider le cache!

#### Méthode Manuelle (Tous OS)

1. **Install all dependencies:**
   ```bash
   npm run install-all
   ```

2. **Start development servers:**
   ```bash
   npm run dev
   ```

   This will start:
   - Backend server on `http://localhost:3001`
   - Frontend client on `http://localhost:5173`

3. **Open your browser:**
   Navigate to `http://localhost:5173`

### Individual Commands

**Backend only:**
```bash
npm run server
```

**Frontend only:**
```bash
npm run client
```

**Build for production:**
```bash
npm run build
```

## 🎮 How to Use

1. **Create a Room**: Enter your name and click "Create New Room"
2. **Invite Team**: Share the room link or room ID with your team
3. **Vote**: Select a card value to cast your vote
4. **Reveal**: Once everyone has voted, click "Reveal Votes"
5. **Review**: See the average, median, and fun stats
6. **Next Round**: Click "New Round" to start voting again

## 🎯 Voting Scale

- **Fibonacci**: 0, 1, 2, 3, 5, 8, 13, 21
- **Special Cards**:
  - `?` - Unsure/Need more info
  - `☕` - Coffee break needed!

## 🎨 Tech Stack

### Backend
- Express.js - Web server
- Socket.io - Real-time communication
- UUID - Room ID generation

### Frontend
- React 18 - UI framework
- Vite - Build tool
- Tailwind CSS - Styling
- Framer Motion - Animations
- Canvas Confetti - Celebration effects
- React Router - Navigation
- Socket.io Client - Real-time updates

## 🏗️ Project Structure

```
PokerPlanning/
├── server/                  # Backend Node.js application
│   ├── index.js            # Express + Socket.io server
│   ├── roomManager.js      # Room management logic
│   └── voteManager.js      # Voting and statistics logic
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── Home.jsx          # Landing page
│   │   │   ├── Room.jsx          # Main voting room
│   │   │   ├── VotingCard.jsx    # Voting cards
│   │   │   ├── ParticipantList.jsx # Team list
│   │   │   └── Results.jsx       # Results display
│   │   ├── hooks/         # Custom React hooks
│   │   │   └── useSocket.js      # Socket.io hook
│   │   ├── App.jsx        # Main app component
│   │   └── index.css      # Global styles
│   └── index.html         # HTML entry point
└── package.json           # Root package scripts
```

## 🎯 Features Breakdown

### Real-time Synchronization
- Participants join/leave updates
- Live vote status tracking
- Synchronized reveal across all clients
- Reaction broadcasting

### Smart Statistics
- **Average**: Arithmetic mean of numeric votes
- **Median**: Middle value for better outlier handling
- **Consensus Detection**: Checks if votes are within 2 points
- **Vote Distribution**: Visual bar chart of all votes
- **Fun Stats**: Highlights optimistic, conservative, and fastest voters

### Fun Elements
- 🎉 Confetti explosion on consensus
- 🔊 Sound effects for votes, reveals, and joins
- 😄 8 different reaction emojis
- 🎨 Gradient avatars generated from names
- ✨ Smooth animations throughout

## 🔧 Configuration

### Server Port
Default: `3001` (modify in `server/index.js`)

### Client Port
Default: `5173` (modify in `client/vite.config.js`)

### Room Cleanup
Rooms older than 24 hours with no participants are automatically cleaned up.

## 📝 Notes

- Rooms are stored in-memory (not persisted to database)
- Room IDs are 8-character UUIDs
- Maximum participants per room: unlimited
- Votes are hidden until reveal
- Audio requires user interaction to play

## 🤝 Contributing

Feel free to fork, improve, and submit pull requests!

## 📄 License

MIT License - feel free to use this for your team!

---

**Made with ❤️ for agile teams who like to have fun while estimating!**
