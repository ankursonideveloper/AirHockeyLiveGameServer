import express from "express";
import {
  register,
  login,
  verifyRegisterOTP,
  forgotPaasword,
  verifyForgotPasswordOTP,
  resetPassword,
  generateForgotPasswordOtp,
  generateRegisterOtp,
  isUserPresent,
} from "../controllers/authController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/verify-register", verifyRegisterOTP);
router.post("/login", login);
router.post("/forgot-password", forgotPaasword);
router.post("/verify-forgot-password", verifyForgotPasswordOTP);
router.post("/update-password", resetPassword);
router.post("/generate-register-otp", generateRegisterOtp);
router.post("/generate-forgot-password-otp", generateForgotPasswordOtp);
router.post("/check-user", isUserPresent);

router.get("/protected", authenticate, (req, res) => {
  res.json({ message: `Hello User ${req.user.id}, this is protected` });
});

export default router;
