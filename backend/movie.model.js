import mongoose from "mongoose";

const movieSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      default: 0,
    },
    genre: {
      type: String,
      default: 'Unknown',
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 10,
    },
    poster: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: 'No description available.',
    },
    personalNote: {
      type: String,
      default: '',
    },
    rank: {
      type: Number,
      default: 0,
    },
    listId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'List',
      required: true,
    }
  }, {
    timestamps: true
  }
);

const Movie = mongoose.model("Movie", movieSchema);

export default Movie;