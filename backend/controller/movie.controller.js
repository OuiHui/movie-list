import Movie from "../model/movie.model.js";
import List from "../model/list.model.js";
import mongoose from "mongoose";

export const getMovie = async (req, res) => {
    try {
        const { listId } = req.query;
        
        let query = {};
        if (listId) {
            if (!mongoose.Types.ObjectId.isValid(listId)) {
                return res.status(400).json({ success: false, message: "Invalid list ID" });
            }
            query.listId = listId;
        } else {
            // Get default list if no listId specified
            const defaultList = await List.findOne({ isDefault: true });
            if (defaultList) {
                query.listId = defaultList._id;
            }
        }

        const movies = await Movie.find(query).sort({ rank: 1, createdAt: 1 });
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

    if (!movie.listId) {
        // If no listId provided, use default list
        const defaultList = await List.findOne({ isDefault: true });
        if (!defaultList) {
            return res.status(400).json({ success: false, message: "No default list found. Please create a list first." });
        }
        movie.listId = defaultList._id;
    }

    if (!mongoose.Types.ObjectId.isValid(movie.listId)) {
        return res.status(400).json({ success: false, message: "Invalid list ID" });
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

export const updateRankings = async (req, res) => {
    const { rankings, listId } = req.body; // Array of {id, rank} objects

    if (!rankings || !Array.isArray(rankings)) {
        return res.status(400).json({ success: false, message: "Please provide rankings array" });
    }

    if (listId && !mongoose.Types.ObjectId.isValid(listId)) {
        return res.status(400).json({ success: false, message: "Invalid list ID" });
    }

    try {
        // Update each movie's rank
        const updatePromises = rankings.map(({ id, rank }) => {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new Error(`Invalid movie ID: ${id}`);
            }
            const updateData = { rank };
            if (listId) {
                updateData.listId = listId;
            }
            return Movie.findByIdAndUpdate(id, updateData, { new: true });
        });

        const updatedMovies = await Promise.all(updatePromises);
        res.status(200).json({ success: true, data: updatedMovies });
    } catch (error) {
        console.error("Error updating rankings:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
}