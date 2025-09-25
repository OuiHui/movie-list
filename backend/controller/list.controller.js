import List from "../model/list.model.js";
import Movie from "../model/movie.model.js";
import mongoose from "mongoose";

export const getLists = async (req, res) => {
    try {
        const lists = await List.find({}).sort({ createdAt: 1 });
        res.status(200).json({ success: true, data: lists });
    } catch (error) {
        console.error("Error fetching lists:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
}

export const createList = async (req, res) => {
    const { name, description } = req.body;

    if (!name || !name.trim()) {
        return res.status(400).json({ success: false, message: "Please provide a list name" });
    }

    try {
        // Check if this is the first list
        const existingLists = await List.find({});
        const isFirst = existingLists.length === 0;

        const newList = new List({
            name: name.trim(),
            description: description || '',
            isDefault: isFirst
        });

        await newList.save();
        res.status(201).json({ success: true, data: newList });
    } catch (error) {
        console.error("Error creating list:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
}

export const updateList = async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: "Invalid list ID" });
    }

    if (!name || !name.trim()) {
        return res.status(400).json({ success: false, message: "Please provide a list name" });
    }

    try {
        const updatedList = await List.findByIdAndUpdate(
            id, 
            { name: name.trim(), description: description || '' }, 
            { new: true }
        );
        
        if (!updatedList) {
            return res.status(404).json({ success: false, message: "List not found" });
        }

        res.status(200).json({ success: true, data: updatedList });
    } catch (error) {
        console.error("Error updating list:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
}

export const deleteList = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: "Invalid list ID" });
    }

    try {
        const listToDelete = await List.findById(id);
        if (!listToDelete) {
            return res.status(404).json({ success: false, message: "List not found" });
        }

        // Check if this is the default list
        if (listToDelete.isDefault) {
            return res.status(400).json({ success: false, message: "Cannot delete the default list" });
        }

        // Delete all movies in this list
        await Movie.deleteMany({ listId: id });
        
        // Delete the list
        await List.findByIdAndDelete(id);
        
        res.status(200).json({ success: true, message: "List and all movies deleted" });
    } catch (error) {
        console.error("Error deleting list:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
}

export const setDefaultList = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: "Invalid list ID" });
    }

    try {
        // Remove default from all lists
        await List.updateMany({}, { isDefault: false });
        
        // Set new default
        const updatedList = await List.findByIdAndUpdate(
            id, 
            { isDefault: true }, 
            { new: true }
        );
        
        if (!updatedList) {
            return res.status(404).json({ success: false, message: "List not found" });
        }

        res.status(200).json({ success: true, data: updatedList });
    } catch (error) {
        console.error("Error setting default list:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
}
