import express from "express";
import userController from "../controllers/user";

export const router = express.Router();

router.post("/signup", userController.signup)
