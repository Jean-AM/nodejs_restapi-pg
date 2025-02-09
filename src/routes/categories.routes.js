import { Router } from "express";
import { 
    getCategories, 
    getCategoryById, 
    getInactiveCategories, 
    createCategories, 
    updateCategory, 
    deleteCategory 
} from "../controllers/categories.controllers.js";

const router = Router();

router.get("/categories", getCategories);
router.get("/categories/:id", getCategoryById);
router.get("/categories/inactive", getInactiveCategories);

router.post("/categories", createCategories);

router.put("/categories/:id", updateCategory);

router.delete("/categories/:id", deleteCategory);

export default router;

