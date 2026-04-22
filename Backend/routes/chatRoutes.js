const express = require("express");
const protect = require("../middleware/authMiddleware");
const { getUserChats, createChat } = require("../controllers/chatControllers");

const router = express.Router();

router.get("/", protect, getUserChats);
router.post("/", protect, createChat);

module.exports = router;