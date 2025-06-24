import express from 'express';

import { getMovie, updateMovie, deleteMovie, createMovie, updateRankings } from './movie.controller.js';

const router = express.Router();

router.get('/', getMovie);
router.post("/", createMovie);
router.put('/:id', updateMovie);
router.delete('/:id', deleteMovie);
router.patch('/rankings', updateRankings);

export default router;