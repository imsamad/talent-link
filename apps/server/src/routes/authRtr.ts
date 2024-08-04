import { Router } from "express";

const authRtr = Router();

authRtr.post("/signup", () => {});
authRtr.post("/login", () => {});
authRtr.post("/forgetPassword", () => {});
authRtr.post("/forgetIdentifier", () => {});
authRtr.get("/me");

export { authRtr };
