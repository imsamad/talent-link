import express from "express";
import morgan from "morgan";
import { errorHandlerMdlrwr } from "./middleware/errorHandlerMdlrwr";
import { CustomError } from "./lib/customError";
import { authRtr } from "./routes/authRtr";

const app = express();

app.disable("x-powered-by");

// Middlewares
app.use(morgan("dev")).use(express.json()).use(express.text());

app.get("/", (_, res) => {
  res.json({
    message: "running, honkey dorry!",
  });
});

app.use(authRtr);

app.use(() => {
  throw new CustomError(400, "not found");
});

app.use(errorHandlerMdlrwr);

export { app as server };
