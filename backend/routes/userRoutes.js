const express = require("express");
const User = require("../models/User");
const firebaseAuth = require("../middleware/firebaseAuth"); // 🔥 NEW

const router = express.Router();

/* ---------------- SAVE GOOGLE USER (SECURE) ---------------- */
router.post("/save", firebaseAuth, async (req, res) => {
  try {
    // 🔥 UID & EMAIL firebase token se aa rahi hai (trusted)
    const { uid, email } = req.user;

    // extra info frontend se (safe)
    const { name, photo } = req.body;

    let user = await User.findOne({ uid });

    // agar user pehle se nahi hai
    if (!user) {
      user = await User.create({
        uid,
        email,
        name,
        photo,
      });
    }

    res.json(user);
  } catch (error) {
    console.error("USER SAVE ERROR 👉", error);
    res.status(500).json({ message: "Failed to save user" });
  }
});

module.exports = router;
