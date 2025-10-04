class VoteManager {
  submitVote(room, socketId, value) {
    if (!room) return false;
    if (room.revealed) return false; // Can't vote after reveal

    room.votes.set(socketId, {
      participantId: socketId,
      value: value,
      timestamp: Date.now(),
    });

    return true;
  }

  getVotes(room) {
    if (!room) return [];
    return Array.from(room.votes.entries()).map(([socketId, vote]) => {
      const participant = room.participants.get(socketId);
      return {
        participantId: socketId,
        participantName: participant?.name || 'Unknown',
        value: room.revealed ? vote.value : null, // Hide value until revealed
        hasVoted: true,
      };
    });
  }

  getVoteStatus(room) {
    if (!room) return { total: 0, voted: 0 };

    return {
      total: room.participants.size,
      voted: room.votes.size,
      allVoted: room.participants.size > 0 && room.votes.size === room.participants.size,
    };
  }

  revealVotes(room) {
    if (!room) return null;

    room.revealed = true;

    const votes = Array.from(room.votes.values()).map(v => v.value);
    const numericVotes = votes.filter(v => !isNaN(parseFloat(v))).map(v => parseFloat(v));

    let average = null;
    let median = null;
    let consensus = false;

    if (numericVotes.length > 0) {
      // Calculate average
      average = numericVotes.reduce((a, b) => a + b, 0) / numericVotes.length;

      // Calculate median
      const sorted = [...numericVotes].sort((a, b) => a - b);
      const mid = Math.floor(sorted.length / 2);
      median = sorted.length % 2 === 0
        ? (sorted[mid - 1] + sorted[mid]) / 2
        : sorted[mid];

      // Check consensus (all votes within 2 points or all same)
      const uniqueVotes = new Set(numericVotes);
      if (uniqueVotes.size === 1) {
        consensus = true;
      } else {
        const min = Math.min(...numericVotes);
        const max = Math.max(...numericVotes);
        consensus = (max - min) <= 2;
      }
    }

    // Get vote distribution
    const distribution = {};
    votes.forEach(vote => {
      distribution[vote] = (distribution[vote] || 0) + 1;
    });

    return {
      votes: this.getVotes(room),
      average: average ? Math.round(average * 10) / 10 : null,
      median: median ? Math.round(median * 10) / 10 : null,
      consensus,
      distribution,
      stats: this.calculateFunStats(room),
    };
  }

  calculateFunStats(room) {
    const votes = Array.from(room.votes.entries());
    const numericVotes = votes
      .map(([id, v]) => ({ id, value: parseFloat(v.value) }))
      .filter(v => !isNaN(v.value));

    if (numericVotes.length === 0) return null;

    // Find optimist (lowest vote - thinks task is easy)
    const optimist = numericVotes.reduce((min, v) => v.value < min.value ? v : min);

    // Find pessimist (highest vote - thinks task is hard)
    const pessimist = numericVotes.reduce((max, v) => v.value > max.value ? v : max);

    // Find quickest voter
    const quickest = votes.reduce((fastest, v) =>
      v[1].timestamp < fastest[1].timestamp ? v : fastest
    );

    return {
      optimist: {
        id: optimist.id,
        name: room.participants.get(optimist.id)?.name,
        value: optimist.value,
      },
      pessimist: {
        id: pessimist.id,
        name: room.participants.get(pessimist.id)?.name,
        value: pessimist.value,
      },
      quickestVoter: {
        id: quickest[0],
        name: room.participants.get(quickest[0])?.name,
      },
    };
  }

  resetVoting(room) {
    if (!room) return false;

    room.votes.clear();
    room.revealed = false;
    room.currentRound += 1;

    return true;
  }

  hasVoted(room, socketId) {
    if (!room) return false;
    return room.votes.has(socketId);
  }
}

export default new VoteManager();
