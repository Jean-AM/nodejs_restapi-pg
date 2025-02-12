import { Router } from "express";
import { createAuthor, deleteAuthor, getAuthorById, getAuthors, getInactiveAuthors, updateAuthor } from '../controllers/authors.controller.js';

const router = Router();

router.get('/authors', getAuthors);
router.get('/authors/id/:id', getAuthorById);
router.get('/authors/inactive', getInactiveAuthors);

router.post('/authors', createAuthor);
router.put('/authors/id/:id', updateAuthor);
router.delete('/authors/id/:id', deleteAuthor);

export default router;