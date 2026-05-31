import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import Book from './models/Book.js';
import userRoutes from './routes/user.js';
import bookRoutes from './routes/book.js'
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

app.use('/api/auth', userRoutes); // toutes les routes auth vont dans routes/user.js
app.use('/api/books', bookRoutes);


export default app;