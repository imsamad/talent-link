import { Router } from "express";

const profileRtr = Router();

profileRtr
  .route("/")
  .put(() => {})
  .post(() => {})
  .get(() => {});

profileRtr.put("/experience", () => {});

profileRtr.put("/education", () => {});

profileRtr.put("/project", () => {});

export { profileRtr };
