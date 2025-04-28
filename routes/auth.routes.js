import express from "express";

import auth from "../middlewares/auth.js";
import { login, me, register } from "../controllers/auth.controllers.js";

const router = express.Router();

// @route   POST api/auth/register
// @desc    Register a user
// @access  Public
router.post("/register", register);

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post("/login", login);

// @route   GET api/auth/me
// @desc    Get logged in user
// @access  Private
router.get("/me", auth, me);

export default router;
