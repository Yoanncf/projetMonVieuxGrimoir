import bcrypt from "bcrypt";
import User from "../models/User";




//Controller pour faire l'inscription
export const signup = async (req, res) => {

    try {
        //Pour crypter le mdp de l'utilisateur
        const hash = await bcrypt.hash(req.body.password, 10);
        const user = new User({
            email: req.body.email,
            password: hash,
        });
        // Permet de sauvegarder en base l'utilisateur. 
        await user.save();
        res.status(201).json({ message: "Utilisateur créé" });
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

