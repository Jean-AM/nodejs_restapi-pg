import { Router } from "express";
import { createBook, deleteBook, getBookByIsbn, getBooks, getInactiveBooks, updateBook } from '../controllers/books.controller.js'

const router = Router();

router.get('/books', getBooks);
router.get('/books/inactive', getInactiveBooks);
router.get('/books/isbn/:isbn', getBookByIsbn);

router.post('/books', createBook);

router.delete('/books/id/:id', deleteBook);

router.put('/books/id/:id', updateBook);

export default router;