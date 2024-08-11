import { Router } from "express";
import { getSkills } from "../controllers/skillCtrl";
const skillRtr = Router();

skillRtr.get("/", getSkills);

export { skillRtr };
