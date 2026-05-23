import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Inscription hash le mot de passe puis enregistre l'utilisateur
export const signup = async (req, res) => {
    try {
        const hash = await bcrypt.hash(req.body.password, 10);
        const user = new User({
            email: req.body.email,
            password: hash, // on stock le hash pas le mdp en clair
        });
        await user.save(); // enregistre en base
        res.status(201).json({ message: 'Utilisateur créé' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Connexion vérifie le mot de passe et renvoie un token
export const login = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email }); // cherche le user par email
        if (!user) {
            return res.status(401).json({ message: 'Identifiants incorrects' }); // user pas trouvé
        }

        const valid = await bcrypt.compare(req.body.password, user.password); // compare le mdp envoyer avec le hash en base
        if (!valid) {
            return res.status(401).json({ message: 'Identifiants incorrects' });
        }

        // envois du userId et du token au front
        res.status(200).json({
            userId: user._id,
            token: jwt.sign( // generation du token
                { userId: user._id },
                process.env.JWT_SECRET, // secret du .env
                { expiresIn: '24h' } // valable 24h
            ),
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
