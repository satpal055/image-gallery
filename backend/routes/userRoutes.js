const express = require("express");
const User = require("../models/User");

const router = express.Router();

/* ---------------- SAVE GOOGLE USER ---------------- */
router.post("/save", async (req, res) => {
  try {
    const { uid, name, email, photo } = req.body;

    let user = await User.findOne({ uid });

    // Agar user pehle se nahi hai
    if (!user) {
      user = await User.create({
        uid,
        name,
        email,
        photo,
      });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to save user" });
  }
});

module.exports = router;
