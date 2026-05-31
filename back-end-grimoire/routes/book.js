import multer from "../middleware/multer-config.js";
import bookController from '../controllers/book.js';
import express from "express";
import auth from "../middleware/auth.js";



const router = express.Router();

router.post("/", auth, multer, bookController.createBook);

export default router;