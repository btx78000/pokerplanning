import { motion, AnimatePresence } from 'framer-motion';

function ParticipantCard({ participant, hasVoted, isRevealed, vote }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className={`glass rounded-2xl p-4 space-y-3 relative border-2 transition-colors ${
        hasVoted
          ? 'border-green-500/50'
          : 'border-orange-500/50'
      }`}
    >
      {/* Vote Status Badge */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className={`absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-lg shadow-lg ${
          hasVoted
            ? 'bg-gradient-to-br from-green-500 to-emerald-500'
            : 'bg-gradient-to-br from-orange-500 to-amber-500'
        }`}
      >
        {hasVoted ? '✓' : '⏳'}
      </motion.div>

      {/* Avatar and Name */}
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${participant.avatar.bg} flex items-center justify-center text-xl font-bold shadow-lg`}>
          {participant.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold truncate">{participant.name}</h3>
          <p className="text-xs text-white/60">
            {hasVoted ? 'Voted' : 'Thinking...'}
          </p>
        </div>
      </div>

      {/* Vote Display */}
      {isRevealed && vote && (
        <motion.div
          initial={{ rotateY: 90, opacity: 0 }}
          animate={{ rotateY: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: Math.random() * 0.3 }}
          className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-4 text-center"
        >
          <div className="text-3xl font-bold">{vote}</div>
        </motion.div>
      )}

      {/* Unrevealed Vote Placeholder */}
      {!isRevealed && hasVoted && (
        <div className="bg-white/5 rounded-xl p-4 text-center border-2 border-dashed border-white/20">
          <div className="text-2xl">🎴</div>
        </div>
      )}
    </motion.div>
  );
}

function ParticipantList({ participants, votes, revealed, votedParticipants }) {
  const getVoteForParticipant = (participantId) => {
    const vote = votes.find(v => v.participantId === participantId);
    return vote?.value;
  };

  const hasVoted = (participantId) => {
    // Before reveal, use votedParticipants Set
    // After reveal, use votes array
    if (!revealed) {
      return votedParticipants.has(participantId);
    }
    return votes.some(v => v.participantId === participantId);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold gradient-text">
        Participants ({participants.length})
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {participants.map((participant) => (
            <ParticipantCard
              key={participant.id}
              participant={participant}
              hasVoted={hasVoted(participant.id)}
              isRevealed={revealed}
              vote={getVoteForParticipant(participant.id)}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default ParticipantList;
