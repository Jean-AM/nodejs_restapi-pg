import { Router } from "express";
import { createBook, deleteBook, getBookByIsbn, getBooks, getInactiveBooks, updateBook } from '../controllers/books.controllers.js'

const router = Router();

router.get('/books', getBooks);
router.get('/books/inactive', getInactiveBooks);
router.get('/books/isbn/:isbn', getBookByIsbn);
router.post('/books', createBook);
router.delete('/books/isbn/:isbn', deleteBook);
router.put('/books/id/:id', updateBook);

export default router;