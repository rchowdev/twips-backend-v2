import express from "express";

// Fake Data
import users from "../usersData.js";

const router = express.Router();

router.get("/", (req, res) => res.send(users));

export default router;
