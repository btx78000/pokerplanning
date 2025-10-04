import { motion } from 'framer-motion';
import { useEffect } from 'react';
import confetti from 'canvas-confetti';

function Results({ results }) {
  useEffect(() => {
    if (results?.consensus) {
      // Fire confetti on consensus!
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#a855f7', '#ec4899', '#06b6d4', '#10b981'],
        });

        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#a855f7', '#ec4899', '#06b6d4', '#10b981'],
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };

      frame();
    }
  }, [results?.consensus]);

  if (!results) return null;

  const { average, median, consensus, distribution, stats } = results;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Average */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="card text-center"
        >
          <div className="text-sm text-purple-300 mb-2">Average</div>
          <div className="text-5xl font-bold gradient-text">
            {average !== null ? average : 'N/A'}
          </div>
        </motion.div>

        {/* Median */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="card text-center"
        >
          <div className="text-sm text-cyan-300 mb-2">Median</div>
          <div className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            {median !== null ? median : 'N/A'}
          </div>
        </motion.div>

        {/* Consensus */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className={`card text-center ${consensus ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/50' : ''}`}
        >
          <div className="text-sm text-green-300 mb-2">Consensus</div>
          <div className="text-5xl font-bold">
            {consensus ? '🎉' : '🤔'}
          </div>
          <div className="text-sm mt-2 text-white/70">
            {consensus ? 'Reached!' : 'Not yet'}
          </div>
        </motion.div>
      </div>

      {/* Vote Distribution */}
      {distribution && Object.keys(distribution).length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="card"
        >
          <h3 className="text-lg font-semibold mb-4 gradient-text">Vote Distribution</h3>
          <div className="space-y-2">
            {Object.entries(distribution)
              .sort(([a], [b]) => {
                const numA = parseFloat(a);
                const numB = parseFloat(b);
                if (isNaN(numA)) return 1;
                if (isNaN(numB)) return -1;
                return numA - numB;
              })
              .map(([value, count]) => (
                <div key={value} className="flex items-center gap-3">
                  <div className="w-12 text-right font-bold">{value}</div>
                  <div className="flex-1 h-8 bg-white/10 rounded-lg overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(count / Object.values(distribution).reduce((a, b) => a + b, 0)) * 100}%` }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-end pr-2"
                    >
                      <span className="text-sm font-semibold">{count}</span>
                    </motion.div>
                  </div>
                </div>
              ))}
          </div>
        </motion.div>
      )}

      {/* Fun Stats */}
      {stats && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="card"
        >
          <h3 className="text-lg font-semibold mb-4 gradient-text">🎭 Fun Stats</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stats.optimist && (
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                <div className="text-2xl mb-1">🌟</div>
                <div className="text-sm text-yellow-300">Most Optimistic</div>
                <div className="font-semibold">{stats.optimist.name}</div>
                <div className="text-sm text-white/60">Voted {stats.optimist.value}</div>
              </div>
            )}

            {stats.pessimist && (
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                <div className="text-2xl mb-1">🎯</div>
                <div className="text-sm text-blue-300">Most Conservative</div>
                <div className="font-semibold">{stats.pessimist.name}</div>
                <div className="text-sm text-white/60">Voted {stats.pessimist.value}</div>
              </div>
            )}

            {stats.quickestVoter && (
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                <div className="text-2xl mb-1">⚡</div>
                <div className="text-sm text-green-300">Fastest Voter</div>
                <div className="font-semibold">{stats.quickestVoter.name}</div>
                <div className="text-sm text-white/60">Lightning quick!</div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

export default Results;
