import mongoose from "mongoose";

const bookSchema = mongoose.Schema(
    {
        userId: { type: String, require: true },
        title: { type: String, require: true },
        author: { type: String, require: true },
        imageUrl: { type: String, require: true },
        year: { type: Number, require: true },
        genre: { type: String, require: true },
        ratings: [{
            userId: { type: String, require: true },
            grade: { type: Number, min: 1, require: true },
        }
        ],
        averageRating: { type: Number },
    }
);

export default mongoose.model("Book", bookSchema);