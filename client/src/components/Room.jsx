import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import VotingCards from './VotingCard';
import ParticipantList from './ParticipantList';
import Results from './Results';

const REACTIONS = ['👍', '👏', '🎉', '😂', '🤔', '❤️', '🚀', '✨'];

function Room({ socket, connected }) {
  const { roomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [name, setName] = useState(location.state?.name || '');
  const [showNameModal, setShowNameModal] = useState(!location.state?.name);
  const [tempName, setTempName] = useState('');
  const [participants, setParticipants] = useState([]);
  const [votes, setVotes] = useState([]);
  const [votedParticipants, setVotedParticipants] = useState(new Set());
  const [selectedVote, setSelectedVote] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [results, setResults] = useState(null);
  const [voteStatus, setVoteStatus] = useState({ total: 0, voted: 0, allVoted: false });
  const [currentRound, setCurrentRound] = useState(1);
  const [reactions, setReactions] = useState([]);
  const [showReactions, setShowReactions] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!socket || !connected || !name) return;

    // Join room
    socket.emit('join-room', { roomId, name });

    // Socket event listeners
    socket.on('room-joined', (data) => {
      setParticipants(data.participants);
      setVoteStatus(data.voteStatus);
      setRevealed(data.revealed);
      setCurrentRound(data.currentRound);
      // Initialize voted participants from existing votes
      if (data.votes && data.votes.length > 0) {
        const votedIds = new Set(data.votes.map(v => v.participantId));
        setVotedParticipants(votedIds);
      }
    });

    socket.on('participant-joined', (data) => {
      setParticipants(data.participants);
      setVoteStatus(data.voteStatus);
      playSound('join');
    });

    socket.on('participant-left', (data) => {
      setParticipants(data.participants);
      setVoteStatus(data.voteStatus);
    });

    socket.on('vote-submitted', (data) => {
      setVoteStatus(data.voteStatus);
      if (data.participantId) {
        setVotedParticipants(prev => new Set([...prev, data.participantId]));
      }
      playSound('vote');
    });

    socket.on('votes-revealed', (data) => {
      setVotes(data.votes);
      setResults(data);
      setRevealed(true);
      playSound('reveal');
    });

    socket.on('voting-reset', (data) => {
      setVotes([]);
      setVotedParticipants(new Set());
      setSelectedVote(null);
      setRevealed(false);
      setResults(null);
      setVoteStatus(data.voteStatus);
      setCurrentRound(data.currentRound);
      playSound('reset');
    });

    socket.on('reaction-received', (data) => {
      addFloatingReaction(data.emoji);
    });

    socket.on('error', (data) => {
      alert(data.message);
      navigate('/');
    });

    return () => {
      socket.off('room-joined');
      socket.off('participant-joined');
      socket.off('participant-left');
      socket.off('vote-submitted');
      socket.off('votes-revealed');
      socket.off('voting-reset');
      socket.off('reaction-received');
      socket.off('error');
    };
  }, [socket, connected, roomId, name, navigate]);

  const playSound = (type) => {
    const sounds = {
      vote: () => {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
        oscillator.start(audioCtx.currentTime);
        oscillator.stop(audioCtx.currentTime + 0.1);
      },
      reveal: () => {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        [440, 554, 659].forEach((freq, i) => {
          const oscillator = audioCtx.createOscillator();
          const gainNode = audioCtx.createGain();
          oscillator.connect(gainNode);
          gainNode.connect(audioCtx.destination);
          oscillator.frequency.value = freq;
          oscillator.type = 'sine';
          gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime + i * 0.1);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + i * 0.1 + 0.2);
          oscillator.start(audioCtx.currentTime + i * 0.1);
          oscillator.stop(audioCtx.currentTime + i * 0.1 + 0.2);
        });
      },
      join: () => {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.frequency.value = 600;
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
        oscillator.start(audioCtx.currentTime);
        oscillator.stop(audioCtx.currentTime + 0.2);
      },
      reset: () => {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.frequency.value = 400;
        oscillator.type = 'triangle';
        gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
        oscillator.start(audioCtx.currentTime);
        oscillator.stop(audioCtx.currentTime + 0.15);
      },
    };

    if (sounds[type]) {
      try {
        sounds[type]();
      } catch (error) {
        console.log('Sound playback failed:', error);
      }
    }
  };

  const handleVote = (value) => {
    if (revealed) return;

    setSelectedVote(value);
    socket.emit('submit-vote', { roomId, value });
  };

  const handleReveal = () => {
    socket.emit('reveal-votes', { roomId });
  };

  const handleReset = () => {
    socket.emit('reset-voting', { roomId });
  };

  const copyRoomLink = () => {
    const link = window.location.href;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sendReaction = (emoji) => {
    socket.emit('send-reaction', { roomId, emoji });
    addFloatingReaction(emoji);
  };

  const addFloatingReaction = (emoji) => {
    const id = Date.now() + Math.random();
    setReactions(prev => [...prev, { id, emoji, x: Math.random() * 80 + 10 }]);
    setTimeout(() => {
      setReactions(prev => prev.filter(r => r.id !== id));
    }, 2000);
  };

  const handleJoinRoom = (e) => {
    e.preventDefault();
    const trimmedName = tempName.trim();
    if (trimmedName) {
      setName(trimmedName);
      setShowNameModal(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Name Modal */}
      <AnimatePresence>
        {showNameModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass rounded-3xl p-8 max-w-md w-full"
            >
              <h2 className="text-3xl font-bold gradient-text mb-2 text-center">
                👋 Bienvenue !
              </h2>
              <p className="text-white/60 text-center mb-6">
                Choisissez votre pseudo pour rejoindre la room
              </p>

              <form onSubmit={handleJoinRoom} className="space-y-4">
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  placeholder="Votre pseudo..."
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-purple-500 transition-colors"
                  autoFocus
                  maxLength={20}
                />

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={!tempName.trim()}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  🚀 Rejoindre la room
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold gradient-text mb-1">
              Planning Poker
            </h1>
            <p className="text-white/60">Round {currentRound}</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={copyRoomLink}
              className="btn-secondary"
            >
              {copied ? '✅ Copied!' : '🔗 Share Room'}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/')}
              className="btn-secondary"
            >
              🏠 Leave
            </motion.button>
          </div>
        </div>

        {/* Room ID Display */}
        <div className="mt-4 p-3 bg-white/5 rounded-xl text-center">
          <span className="text-white/60 text-sm">Room ID: </span>
          <span className="text-xl font-mono font-bold gradient-text">{roomId}</span>
        </div>
      </motion.div>

      {/* Voting Progress */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="card"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-white/80">Voting Progress</span>
          <span className="font-bold gradient-text">
            {voteStatus.voted} / {voteStatus.total}
          </span>
        </div>
        <div className="h-3 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${voteStatus.total > 0 ? (voteStatus.voted / voteStatus.total) * 100 : 0}%` }}
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
            transition={{ duration: 0.5 }}
          />
        </div>
      </motion.div>

      {/* Voting Cards */}
      {!revealed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="card"
        >
          <h2 className="text-2xl font-bold gradient-text mb-6 text-center">
            Cast Your Vote
          </h2>
          <VotingCards
            selectedValue={selectedVote}
            onVote={handleVote}
            disabled={revealed}
          />
        </motion.div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 justify-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleReveal}
          disabled={!voteStatus.allVoted || revealed}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {revealed ? '✨ Revealed!' : `🎴 Reveal Votes ${voteStatus.allVoted ? '' : `(${voteStatus.voted}/${voteStatus.total})`}`}
        </motion.button>

        {revealed && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleReset}
            className="btn-secondary"
          >
            🔄 New Round
          </motion.button>
        )}

        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowReactions(!showReactions)}
            className="btn-secondary"
          >
            😄 React
          </motion.button>

          <AnimatePresence>
            {showReactions && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-full mb-2 left-0 glass rounded-2xl p-3 flex gap-2"
              >
                {REACTIONS.map(emoji => (
                  <motion.button
                    key={emoji}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => sendReaction(emoji)}
                    className="text-2xl hover:bg-white/10 rounded-lg p-2"
                  >
                    {emoji}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Results */}
      {revealed && <Results results={results} />}

      {/* Participants */}
      <ParticipantList
        participants={participants}
        votes={votes}
        revealed={revealed}
        votedParticipants={votedParticipants}
      />

      {/* Floating Reactions */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <AnimatePresence>
          {reactions.map(reaction => (
            <motion.div
              key={reaction.id}
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 0, y: -200 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2 }}
              className="absolute text-6xl"
              style={{ left: `${reaction.x}%`, bottom: '10%' }}
            >
              {reaction.emoji}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default Room;
