import express from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";

import { errorHandlerMdlrwr } from "./middleware/errorHandlerMdlrwr";

import { authRtr } from "./routes/authRtr";
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
      origin: "http://localhost:3000",
      credentials: true,
    })
  );

app.get("/api/v1", (req, res) => {
  console.log("req.cookies: ", req.headers.cookie);
  console.log("req.cookies: ", req.cookies);
  if (req.cookies.hello) {
    console.log("req.cookies: ", req.cookies);
  } else {
    console.log("setting: ");
    res.cookie("hello", "hello-value", {
      maxAge: 15 * 60 * 1000,
      secure: process.env.NODE_ENV == "production",
      httpOnly: true,
      sameSite: "strict",
    });
  }

  res.json({
    message: "running, honkey dorry!",
  });
});

app.use("/api/v1/", mainRtr);

app.use(() => {
  throw new CustomResponseError(400, "not found");
});

app.use(errorHandlerMdlrwr);

export { app as server };
