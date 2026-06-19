import multer from "../middleware/multer-config.js";
import { createBook, getAllBook, getOneBook, getBookRatings, getBestRatings, updateBook, addRating, deleteBook } from '../controllers/book.js';
import express from "express";
import auth from "../middleware/auth.js";



const router = express.Router();

router.post("/", auth, multer, createBook);
router.post("/:id/rating", auth, addRating);


router.get("/bestrating", getBestRatings);
router.get("/:id", getOneBook);
router.get("/", getAllBook);
//Pas demandé mais on a créé la route
router.get("/:id/ratings", getBookRatings);
// multer car possible nouvelle image
router.put("/:id", auth, multer, updateBook);

router.delete("/:id", auth, deleteBook);

export default router;