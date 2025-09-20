import express from "express";
import {
  register,
  login,
  verifyRegisterOTP,
  forgotPaasword,
} from "../controllers/authController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/verify-register", verifyRegisterOTP);
router.post("/login", login);
router.post("/forgot-password", forgotPaasword);
router.get("/protected", authenticate, (req, res) => {
  res.json({ message: `Hello User ${req.user.id}, this is protected` });
});

export default router;
