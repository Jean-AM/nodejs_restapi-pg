import { Router } from "express";

import { createReview, deleteReview, getInactiveReviews, getReviewById, getReviews, updateReview } from '../controllers/reviews.controller.js'

const router = Router();

router.get('/reviews', getReviews);

router.get('/reviews/id/:id', getReviewById);

router.get('/reviews/inactive', getInactiveReviews);

router.post('/reviews', createReview);

router.put('/reviews', updateReview);

router.delete('/reviews', deleteReview);

export default router;