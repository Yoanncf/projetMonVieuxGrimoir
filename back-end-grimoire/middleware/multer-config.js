import multer from "multer";
import sanitize from "sanitize-filename";


export const MIME_TYPES = {
    "image/jpg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/jpeg": "jpeg"
};


const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    filename: (req, file, callback) => {
        const name = sanitize(file.originalname.split(' ').join('_'));
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    }
});

export default multer({ storage }).single('image');
