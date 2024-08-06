import { Router } from "express";
import {
  confirmOTP,
  getMe,
  login,
  logout,
  resendOTP,
  signUp,
} from "../controllers/authCtrl";
import { authMdlwr } from "../middleware/authMdlwr";

const authRtr = Router();

authRtr.post("/auth/signup", signUp);
authRtr.post("/auth/login", login);
authRtr.post("/auth/logout", logout);
authRtr.post("/auth/confirmOTP/:otp", confirmOTP);
authRtr.get("/auth/resendOTP/:userId", resendOTP);
authRtr.post("/auth/forgetPassword", () => {});
authRtr.post("/auth/forgetIdentifier", () => {});
authRtr.get("/auth/me", authMdlwr, getMe);

export { authRtr };
