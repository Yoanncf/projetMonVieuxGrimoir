import { MIME_TYPES } from "../middleware/multer-config.js";
import sharp from "sharp";
import fs from "fs";
import path from "path";


export const optimizeImage = async (file) => {
    const absolutePath = path.resolve(file.path);

    const extension = MIME_TYPES[file.mimetype];
    const regex = new RegExp(`\\.${extension}$`);
    const destinationPath = absolutePath.replace(regex, ".webp");

    await sharp(absolutePath)
        .resize({ width: 800, fit: "contain" })
        .webp()
        .toFile(destinationPath);

    fs.unlink(absolutePath, (err) => {
        if (err) console.log(err);
    });

    const fixedFilePath = file.path.replace(/\\/g, "/");
    console.log("file.path", fixedFilePath);
    return fixedFilePath.replace(regex, ".webp");

};