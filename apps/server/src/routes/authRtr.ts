import { Router } from "express";
import { confirmOTP, resendOTP } from "../controllers/authCtrl";

const authRtr = Router();

authRtr.post("/auth/signup", () => {});
authRtr.post("/auth/login", () => {});
authRtr.get("/auth/confirmOTP/:otp", confirmOTP);
authRtr.get("/auth/resendOTP/:userId", resendOTP);
authRtr.post("/auth/forgetPassword", () => {});
authRtr.post("/auth/forgetIdentifier", () => {});
authRtr.get("/auth/me");

export { authRtr };
