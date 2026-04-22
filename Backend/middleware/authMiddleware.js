const jwt = require("jsonwebtoken");
const prisma = require("../database/prisma");

const protect = async (req, res, next) => {
   try {
      let token;

      // Get token from header
      if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
         token = req.headers.authorization.split(" ")[1];
      }

      if (!token) {
         return res.status(401).json({ message: "No token, unauthorized" });
      }

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);


      // Get user from DB
      const user = await prisma.user.findUnique({
         where: { id: decoded.id },
      });

      if (!user) {
         return res.status(401).json({ message: "User not found" });
      }

      // Attach user to request
      req.user = user;

      next();
   } catch (err) {
      return res.status(401).json({ message: "Invalid token" });
   }
};

module.exports = protect;