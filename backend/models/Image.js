const mongoose = require("mongoose"); // ✅ YE LINE MISS THI

const imageSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        imageUrl: {
            type: String,
            required: true,
            unique: true, // 🔥 duplicate images prevent
        },
        likes: [
            {
                type: String, // firebase user uid
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model("Image", imageSchema);
