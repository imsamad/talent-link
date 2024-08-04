import express from "express";
import morgan from "morgan";
import { errorHandlerMdlrwr } from "./middleware/errorHandlerMdlrwr";
import { CustomError } from "./lib/customError";
import { prismaClient } from "@repo/db";

const app = express();

app.disable("x-powered-by");

// Middlewares
app.use(morgan("dev")).use(express.json()).use(express.text());

app.get("/", async (_, res) => {
  const scsdc = await prismaClient.user.findMany();

  res.json({
    message: "honkey dorry!: ",
    data: scsdc,
  });
});

app.get("/one", async (_, res) => {
  res.json({
    message: "one honkey dorry!: ",
  });
});

app.use(() => {
  throw new CustomError(400, "not found");
});

app.use(errorHandlerMdlrwr);

export { app as server };
