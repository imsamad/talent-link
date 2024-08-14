import express from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";

import { errorHandlerMdlwr } from "./middleware/errorHandlerMdlwr";
import { CustomResponseError } from "@repo/utils";

// routers
import { authRtr } from "./routes/authRtr";
import { profileRtr } from "./routes/profileRtr";
import { skillRtr } from "./routes/skillRtr";
import { jobRtr } from "./routes/jobRtr";
import { applicationRtr } from "./lib/applicationRtr.";

const app = express();

app.disable("x-powered-by");

// Middlewares
app
  .use(morgan("dev"))
  .use(express.json())
  .use(express.text())
  .use(cookieParser())
  .use(
    cors({
      origin: process.env.CORS_ORIGIN,
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE"],
    })
  );

app.all(["/api/v1", "/"], (req, res) => {
  res.json({
    message: "honkey dorry!",
  });
});

app.use("/api/v1/auth", authRtr);
app.use("/api/v1/skills", skillRtr);
app.use("/api/v1/profiles", profileRtr);
app.use("/api/v1/jobs", jobRtr);
app.use("/api/v1/applications", applicationRtr);

app.use(() => {
  throw new CustomResponseError(400, "not found");
});

app.use(errorHandlerMdlwr);

export { app as server };
