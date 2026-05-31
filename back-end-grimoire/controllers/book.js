import Book from "../models/Book.js";
import { optimizeImage } from "../utils/sharp.js";


//Créé un book 
const createBook = async (req, res) => {
    try {
        const bookObject = JSON.parse(req.body.book);
        const fieldName = await optimizeImage(req.file);
        delete bookObject._id;
        delete bookObject._userId;
        const book = new Book({
            ...bookObject, userId: req.auth.userId,
            imageUrl: `${req.protocol}://${req.get("host")}/${fieldName}`
        });
        console.log("image", book);
        await book.save();
        res.status(201).json({ message: "Livre enregistré !" });
    } catch (error) {
        console.error("Echec de création de book", error)
        res.status(400).json({ error });
    }
}

export default { createBook };