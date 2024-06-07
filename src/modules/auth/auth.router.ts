import express from "express";
import validationMiddleware from "../../middleware/validationMiddleware";
import { AuthController } from "./auth.controller";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";

const router = express.Router();
const authController = new AuthController();

router.post("/login", validationMiddleware(LoginDto), authController.login);
router.post(
  "/register",
  validationMiddleware(RegisterDto),
  authController.register
);

export default router;
