const express = require("express");
const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const Image = require("../models/Image");
const auth = require("../middleware/auth");
const firebaseAuth = require("../middleware/firebaseAuth");
const router = express.Router();
const upload = multer({ dest: "uploads/" });

/* ---------------- UPLOAD IMAGE (ADMIN) ---------------- */
router.post("/", auth, upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No image file received" });
        }

        // 1️⃣ Upload to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path);

        // 2️⃣ 🔥 DUPLICATE CHECK (YAHIN LIKHNA THA)
        const existing = await Image.findOne({
            imageUrl: result.secure_url,
        });

        if (existing) {
            return res.status(409).json({
                message: "Image already exists",
            });
        }

        // 3️⃣ Save to DB
        const image = await Image.create({
            title: req.body.title,
            imageUrl: result.secure_url,
            likes: [],
        });

        res.json(image);
    } catch (error) {
        console.error("UPLOAD ERROR 👉", error);
        res.status(500).json({ message: "Image upload failed" });
    }
});



/* ---------------- GET ALL IMAGES (PUBLIC) ---------------- */
router.get("/", async (req, res) => {
    const images = await Image.find().sort({ createdAt: -1 });
    res.json(images);
});

/* ❤️ ---------------- LIKE / UNLIKE IMAGE ---------------- ❤️ */
router.post("/:id/like", firebaseAuth, async (req, res) => {
    const userId = req.user.uid; // 🔥 VERIFIED UID

    const image = await Image.findById(req.params.id);
    if (!image) return res.status(404).json({ msg: "Image not found" });

    if (image.likes.includes(userId)) {
        image.likes = image.likes.filter(id => id !== userId);
    } else {
        image.likes.push(userId);
    }

    await image.save();
    res.json(image);
});

// ✏️ UPDATE IMAGE TITLE (ADMIN)
router.put("/:id", auth, async (req, res) => {
    try {
        const { title } = req.body;

        const image = await Image.findByIdAndUpdate(
            req.params.id,
            { title },
            { new: true }
        );

        res.json(image);
    } catch (err) {
        res.status(500).json({ msg: "Update failed" });
    }
});


module.exports = router;
