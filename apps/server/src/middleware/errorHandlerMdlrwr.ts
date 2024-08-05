import { NextFunction, Request, Response } from "express";
import { TCustomError } from "../lib/customError";

export const errorHandlerMdlrwr = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof TCustomError) {
    console.error(err.errors);
    return res.status(err.statusCode).json({
      errors: err.errors,
    });
  }
  console.error("err: ", err);
  res.status(500).json({
    errror: "server under maintenance!",
  });
};
