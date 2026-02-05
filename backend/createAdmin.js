require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("./models/Admin");

mongoose.connect(process.env.MONGO_URI);

(async () => {
    const hashedPassword = await bcrypt.hash("123456", 10);

    await Admin.create({
        email: "admin@gmail.com",
        password: hashedPassword,
    });

    console.log("✅ Admin created successfully");
    process.exit();
})();
