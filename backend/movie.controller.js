import Movie from "./movie.model.js";
import mongoose from "mongoose";   

export const getMovie = async (req, res) => {
    try {
        const movies = await Movie.find({});
        res.status(200).json({ success: true, data: movies });
    } catch (error) {
        console.error("Error fetching movies:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }   
}

export const createMovie = async (req, res) => {
    const movie = req.body;

    if (!movie.title || !movie.poster) {
        return res.status(400).json({ success:false, message:"Please provide title and poster"});
    }

    const newMovie = new Movie(movie);
    try {
        await newMovie.save();
        res.status(201).json({ success: true, data: newMovie });
    } catch (error) {
        console.error("Error saving movie:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
    
}

export const updateMovie = async (req, res) => { 
    const { id } = req.params;
    const movie = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success:false, message:"Invalid movie data"});
    }

    try {
        const updatedMovie = await Movie.findByIdAndUpdate(id, movie, { new: true });
        res.status(200).json({ success: true, data: updatedMovie });
    } catch (error) {
        console.error("Error updating movie:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
}

export const deleteMovie = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success:false, message:"Invalid movie data"});
    }

    try {
        await Movie.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Movie deleted" });
    } catch (error) {
        console.error("Error deleting movie:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
}