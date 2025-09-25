import express from 'express';
import { getLists, createList, updateList, deleteList, setDefaultList } from '../controller/list.controller.js';

const router = express.Router();

router.get('/', getLists);
router.post('/', createList);
router.put('/:id', updateList);
router.delete('/:id', deleteList);
router.patch('/:id/default', setDefaultList);

export default router;
