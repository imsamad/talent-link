import { NextFunction, Request, Response } from "express";

import { TCustomError, TCustomResponseError } from "@repo/utils";

export const errorHandlerMdlwr = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof TCustomResponseError) {
    console.error(err);
    return res.status(err.statusCode).json(err.errors);
  }

  if (err instanceof TCustomError) {
    console.error(err);
    return res.status(404).json(err.errors);
  }
  console.log(err);
  res.status(500).json({
    errror: "server under maintenance!",
  });
};
