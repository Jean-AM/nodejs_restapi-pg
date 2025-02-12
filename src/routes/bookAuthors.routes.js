import { Router } from "express";

import { addAuthorToBook, getBooksByAuthor, removeAuthorFromBook, updateAuthorInBook } from '../controllers/bookAuthors.controller.js'

const router = Router();

router.get('/author/id/:id/books', getBooksByAuthor);

router.post('/book/authors', addAuthorToBook);

router.put('/book/authors', updateAuthorInBook);

router.delete('/book/authors', removeAuthorFromBook);

export default router;