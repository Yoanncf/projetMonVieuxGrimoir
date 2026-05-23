import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import Book from './models/Book.js';
import userRoute from './routes/user.js';

const app = express();

// connexion a la base mongo
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));



app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(express.json()); // lit le json envoyer par le front

app.use('/api/auth', userRoute); // toutes les routes auth vont dans routes/user.js

// recup tous les livres
app.get('/api/books', (req, res, next) => {
    Book.find()
        .then(books => res.status(200).json(books))
        .catch(error => res.status(400).json({ error }));
});

// recup un livre par son id
app.get('/api/books/:id', (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then(book => res.status(200).json(book))
        .catch(error => res.status(404).json({ error }));
});

// ajout d'un livre
app.post('/api/books', (req, res, next) => {
    delete req.body._id;//suppr _id car mago le creer lui même 
    const book = new Book({ ...req.body });
    book.save()
        .then(() => res.status(201).json({ message: 'Livre enregistré !' }))
        .catch(error => res.status(400).json({ error }));
});

// modif d'un livre par son id
app.put('/api/books/:id', (req, res, next) => {
    Book.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Livre modifié !' }))
        .catch(error => res.status(400).json({ error }));
});

// suppression d'un livre par son id
app.delete('/api/books/:id', (req, res, next) => {
    Book.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Livre supprimé !' }))
        .catch(error => res.status(400).json({ error }));
});

export default app;