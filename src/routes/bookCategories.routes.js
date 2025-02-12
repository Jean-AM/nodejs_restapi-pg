import { Router } from "express";

import { addCategoryToBook, getCategoriesByBook, removeCategoryFromBook, updateCategoryForBook } from '../controllers/bookCategories.controller.js'

const router = Router();

router.get('/book/id/:id/categories', getCategoriesByBook);

router.post('/book/categories', addCategoryToBook);

router.put('/book/categories', updateCategoryForBook);

router.delete('/book/categories', removeCategoryFromBook);

export default router;