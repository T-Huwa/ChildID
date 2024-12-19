const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middlewares/auth");
const { users, saveUsers } = require("../utils/userStore");

const router = express.Router();

router.post("/register", async (req, res) => {
  //
});

router.post("/login", (req, res) => {
  const { user_id, password } = req.body;

  const user = users.find((u) => u.user_id === user_id);

  if (!user || user.password !== password) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: user.id },
    process.env.JWT_SECRET ||
      "8ca077657cf58d338cc3731722bb74d561a3b8c53216438a7b1b83535c065cb0",
    { expiresIn: "1h" }
  );

  res.json({ token, user });
});

router.post("/refresh", auth, async (req, res) => {
  //
});

router.post("/verify-age", auth, async (req, res) => {
  //
});

module.exports = router;
