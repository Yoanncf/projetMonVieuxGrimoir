import Book from "../models/Book.js";
import { optimizeImage } from "../utils/sharp.js";
import fs from "fs";



//Récuperer les livres 
export const getAllBook = (req, res) => {
    Book.find()
        .then(books => res.status(200).json(books))
        .catch(error => res.status(400).json({ error }));
}

//Récuperer un livre
export const getOneBook = async (req, res) => {
    try {
        const book = await Book.findOne({ _id: req.params.id });
        if (!book) {
            return res.status(404).json({ message: "Livre non trouvé" });
        }
        res.status(200).json(book);
    } catch (error) {
        console.error("Echec de la récupération du livre", error)
        res.status(500).json({ error })
    }
}

const alreadyRated = (userId, ratings) => {
    return ratings.some((rating) => rating.userId == userId);
}

const calculateAverageRating = (book, ratingObject) => {
    const ratings = [...book.ratings, ratingObject];
    const totalGrade = ratings.reduce((acc, rating) => acc + rating.grade, 0);
    //On multipli par 10 pour n'avoir qu'une seul décimal (pour 2 par 100)
    return Math.round((totalGrade / ratings.length) * 10) / 10;
}

//ajouter un note
export const addRating = async (req, res) => {
    try {
        const ratingObject = { ...req.body, grade: req.body.rating };
        delete ratingObject.rating;
        const book = await Book.findOne({ _id: req.params.id });
        if (!book) return res.status(404).json({ message: "Livre non trouvé" });
        if (alreadyRated(req.body.userId, book.ratings)) {
            return res.status(403).json({ message: "Vous avez déjà noté ce livre" });
        }
        const averageRating = calculateAverageRating(book, ratingObject);
        //On ajoute avec l'opérateur mongo db $push l'élément ratingObject au tableau de note rating et on met à jour la moyenne
        await Book.updateOne({ _id: req.params.id }, { $push: { ratings: ratingObject }, averageRating });
        const updatedBook = await Book.findOne({ _id: req.params.id });
        res.status(200).json(updatedBook);
    } catch (error) {
        console.error("Echec d'ajout de note", error)
        res.status(500).json({ error: error.message });
    }
}

//Notation 
export const getBookRatings = async (req, res) => {
    try {
        const book = await Book.findOne({ _id: req.params.id });
        if (!book) {
            return res.status(404).json({ message: "Livre non trouvé" });
        }
        res.status(200).json(book.ratings);
    } catch (error) {
        console.error("Echec de la récupération du livre", error)
        res.status(500).json({ error })
    }
}

//Meilleurs notes
export const getBestRatings = async (req, res) => {
    try {
        const books = await Book.find().sort({ averageRating: -1 }).limit(3);
        res.status(200).json(books);

    } catch (error) {
        console.error("Echec de la récupération des 3 meilleurs notes", error)
        res.status(500).json({ error })
    }
}

//Créé un book 
export const createBook = async (req, res) => {
    try {
        const bookObject = JSON.parse(req.body.book);
        const fieldName = await optimizeImage(req.file);
        delete bookObject._id;
        delete bookObject._userId;
        const book = new Book({
            ...bookObject, userId: req.auth.userId,
            imageUrl: `${req.protocol}://${req.get("host")}/${fieldName}`
        });
        await book.save();
        res.status(201).json({ message: "Livre enregistré !" });
    } catch (error) {
        console.error("Echec de création de book", error)
        res.status(400).json({ error });
    }
}

//Modifier un livre
export const updateBook = async (req, res) => {
    try {
        const book = await Book.findOne({ _id: req.params.id });
        if (!book) {
            return res.status(404).json({ message: "Livre non trouvé" });
        }
        // seul le proprio peut modifier
        if (book.userId !== req.auth.userId) {
            return res.status(403).json({ message: "Requête non autorisée" });
        }
        // Si nouvelle image
        let bookObject;
        if (req.file) {
            const fieldName = await optimizeImage(req.file);
            bookObject = {
                ...JSON.parse(req.body.book),
                imageUrl: `${req.protocol}://${req.get("host")}/${fieldName}`,
            };
        } else {
            bookObject = { ...req.body };
        }
        delete bookObject._userId;
        await Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id });
        res.status(200).json({ message: "Livre modifié !" });
    } catch (error) {
        console.error("Echec de modification du livre", error);
        res.status(400).json({ error });
    }
}

//Supprimer un livre 
export const deleteBook = async (req, res) => {
    try {
        const book = await Book.findOne({ _id: req.params.id });
        if (!book) {
            return res.status(404).json({ message: "Livre non trouvé" });
        }
        if (book.userId !== req.auth.userId) {
            return res.status(403).json({ message: "Requete non autorisée" });
        }
        //Suppression de l'image 
        // récupère le nom du fichier depuis l'URL
        const filename = book.imageUrl.split('/images/')[1];
        // efface le fichier du disque
        await fs.promises.unlink(`images/${filename}`);
        await Book.deleteOne({ _id: req.params.id });
        res.status(200).json({ message: "Livre supprimé !" });
    } catch (error) {
        console.error("Echec de la suppression du livre", error);
        res.status(400).json({ error });
    }
};