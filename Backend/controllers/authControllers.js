const prisma = require("../database/prisma");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// 🔥 generate token
function generateToken(user) {
   return jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
   );
}

// Register 
const register = async (req, res) => {
   const { username, email, password } = req.body;

   try {
      const existing = await prisma.user.findUnique({
         where: { email },
      });

      if (existing) {
         return res.status(400).json({ message: "User exists" });
      }

      const hashed = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
         data: {
         username,
         email,
         password: hashed,
         },
      });

      res.json({
         token: generateToken(user),
         user,
      });
   } catch (err) {
      res.status(500).json({ error: err.message });
   }
};

// Login
const login = async (req, res) => {
   const { email, password } = req.body;

   try {
      const user = await prisma.user.findUnique({
         where: { email },
      });

      if (!user || !user.password) {
         return res.status(400).json({ message: "Invalid credentials" });
      }

      const match = await bcrypt.compare(password, user.password);

      if (!match) {
         return res.status(400).json({ message: "Invalid credentials" });
      }

      res.json({
         token: generateToken(user),
         user,
      });
   } catch (err) {
      res.status(500).json({ error: err.message });
   }
};

module.exports = {
   register, login
}