import { motion } from 'framer-motion';

const CARD_VALUES = ['0', '1', '2', '3', '5', '8', '13', '21', '?', '☕'];

function VotingCard({ value, selected, onClick, disabled }) {
  const isSpecial = value === '?' || value === '☕';

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.1, rotate: 5 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      onClick={() => !disabled && onClick(value)}
      disabled={disabled}
      className={`
        relative w-16 h-24 rounded-xl font-bold text-2xl
        transition-all duration-300
        ${selected
          ? 'bg-gradient-to-br from-purple-500 to-pink-500 shadow-2xl shadow-purple-500/50 scale-110 -translate-y-2'
          : 'glass-hover'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${isSpecial ? 'text-3xl' : ''}
      `}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        {value}
      </div>

      {selected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-xs"
        >
          ✓
        </motion.div>
      )}
    </motion.button>
  );
}

function VotingCards({ selectedValue, onVote, disabled }) {
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {CARD_VALUES.map((value) => (
        <VotingCard
          key={value}
          value={value}
          selected={selectedValue === value}
          onClick={onVote}
          disabled={disabled}
        />
      ))}
    </div>
  );
}

export default VotingCards;
