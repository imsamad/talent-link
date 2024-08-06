import express from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";

import { errorHandlerMdlwr } from "./middleware/errorHandlerMdlwr";
import { CustomResponseError } from "@repo/utils";

import { mainRtr } from "./routes";

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
    })
  );

app.get(["/api/v1", "/"], (req, res) => {
  res.json({
    message: "running, honkey dorry!",
  });
});

app.use("/api/v1/", mainRtr);

app.use(() => {
  throw new CustomResponseError(400, "not found");
});

app.use(errorHandlerMdlwr);

export { app as server };
