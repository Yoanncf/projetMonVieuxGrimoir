import multer from "../middleware/multer-config.js";
import { createBook, getAllBook, getOneBook, getBookRatings, getBestRatings, updateBook } from '../controllers/book.js';
import express from "express";
import auth from "../middleware/auth.js";



const router = express.Router();

router.post("/", auth, multer, createBook);


router.get("/bestrating", getBestRatings);
router.get("/:id", getOneBook);
router.get("/", getAllBook);
router.get("/:id/ratings", getBookRatings);

router.put("/:id", auth, multer, updateBook);     // multer car possible nouvelle image


export default router;