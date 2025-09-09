import mongoose from 'mongoose';

const gameSessionSchema = new mongoose.Schema({
  playerName: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  timeElapsed: {
    type: Number,
    required: true
  },
  hintsUsed: {
    type: Number,
    default: 0
  },
  imageName: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export default mongoose.model('GameSession', gameSessionSchema);
