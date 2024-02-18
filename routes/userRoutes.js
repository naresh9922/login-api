import express from "express";
const router = express.Router()

import UserController from "../controllers/userController.js";

// public routes  --- cab be accessed without login
router.post("/register",UserController.userRegistration)
router.post("/login",UserController.userLogin)
router.post("/send-reset-password-email",UserController.sendUserPasswordResetEmail)
router.post("/reset-password/:id/:token",UserController.userPasswordReset)

// private routes -- can accessed with login only

export default router