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
import { validateMdlwr } from "../middleware/validateMdlwr";
import { LoginSchema } from "@repo/utils";

const authRtr = Router();

authRtr.post("/signup", validateMdlwr(LoginSchema, "body"), signUp);
authRtr.post("/login", validateMdlwr(LoginSchema, "body"), login);
authRtr.post("/logout", logout);
authRtr.post("/confirmOTP/:token", confirmOTP);
authRtr.get("/resendOTP/:userId", resendOTP);

authRtr.post("/forgetPassword", () => {});
authRtr.post("/forgetIdentifier", () => {});
authRtr.get("/me", authMdlwr, getMe);

export { authRtr };
