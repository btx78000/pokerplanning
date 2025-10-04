import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import config from '../config';

function Home({ socket, connected }) {
  const [name, setName] = useState('');
  const [joinRoomId, setJoinRoomId] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const createRoom = async () => {
    if (!name.trim()) {
      alert('Please enter your name!');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${config.API_URL}/api/rooms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ creatorName: name }),
      });

      const { roomId } = await response.json();
      navigate(`/room/${roomId}`, { state: { name } });
    } catch (error) {
      console.error('Error creating room:', error);
      alert('Failed to create room. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const joinRoom = async () => {
    if (!name.trim()) {
      alert('Please enter your name!');
      return;
    }

    if (!joinRoomId.trim()) {
      alert('Please enter a room ID!');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${config.API_URL}/api/rooms/${joinRoomId}`);
      const data = await response.json();

      if (data.exists) {
        navigate(`/room/${joinRoomId}`, { state: { name } });
      } else {
        alert('Room not found! Please check the room ID.');
      }
    } catch (error) {
      console.error('Error joining room:', error);
      alert('Failed to join room. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl w-full"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-6xl md:text-7xl font-bold mb-4 gradient-text"
          >
            Planning Poker 🎴
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-xl text-purple-200"
          >
            Fun, collaborative estimation for agile teams
          </motion.p>

          {/* Connection Status */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-4 flex items-center justify-center gap-2"
          >
            <div className={`w-3 h-3 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
            <span className="text-sm text-white/70">
              {connected ? 'Connected' : 'Connecting...'}
            </span>
          </motion.div>
        </div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="card space-y-6"
          style={{ position: 'relative', zIndex: 1 }}
        >
          {/* Name Input */}
          <div>
            <label className="block text-sm font-medium mb-2 text-purple-200">
              Your Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name..."
              className="input-glass w-full"
              disabled={loading || !connected}
              onKeyPress={(e) => e.key === 'Enter' && createRoom()}
            />
          </div>

          {/* Create Room Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={createRoom}
            disabled={loading || !connected}
            className="btn-primary w-full text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '🎴 Creating...' : '🎴 Create New Room'}
          </motion.button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-purple-900/50 text-purple-200">or join existing room</span>
            </div>
          </div>

          {/* Join Room Section */}
          <div>
            <label className="block text-sm font-medium mb-2 text-purple-200">
              Room ID
            </label>
            <input
              type="text"
              value={joinRoomId}
              onChange={(e) => setJoinRoomId(e.target.value.toUpperCase())}
              placeholder="Enter room ID..."
              className="input-glass w-full"
              disabled={loading || !connected}
              onKeyPress={(e) => e.key === 'Enter' && joinRoom()}
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={joinRoom}
            disabled={loading || !connected}
            className="btn-secondary w-full text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '🚀 Joining...' : '🚀 Join Room'}
          </motion.button>
        </motion.div>

        {/* Fun Facts */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-8 text-center text-sm text-purple-300/70"
        >
          <p>✨ Features: Real-time voting • Instant reveals • Fun animations • Team stats</p>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Home;
