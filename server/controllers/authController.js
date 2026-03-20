const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db"); // Connects to your Docker DB!

// 1. REGISTER: Create a brand new user
exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) return res.status(400).json({ error: "You must provide an email and password" });

    // Mathematically scramble their plaintext password (10 encryption passes!)
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Safely save them to your new `users` Docker table!
    const sql = `INSERT INTO users (email, password) VALUES (?, ?)`;
    await db.execute(sql, [email, hashedPassword]);
    
    res.status(201).json({ success: true, message: "User registered perfectly!" });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ error: "That email probably already exists in the database!" });
  }
};

// 2. LOGIN: Check credentials and generate the Token badge!
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Ask MySQL if the user actually exists
    const [rows] = await db.execute(`SELECT * FROM users WHERE email = ?`, [email]);
    if (rows.length === 0) return res.status(401).json({ error: "User genuinely not found!" });
    
    const user = rows[0];
    
    // Mathematically compare their typed password with the scrambled DB hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid password!" });
    
    // Generate the incredibly secure signed Token badge (valid for 24 hours only!)
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    
    res.json({ success: true, message: "Successful Login!", token: token, userId: user.id });
  } catch (error) {
    res.status(500).json({ error: "Login functionally failed on the server." });
  }
};
