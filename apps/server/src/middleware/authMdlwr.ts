import { AUTH_COOKIE_NAME } from "../lib/const";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { CustomResponseError } from "@repo/utils";
import { prismaClient } from "@repo/db";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        isAdmin: boolean;
        email: string;
        username: string;
      };
    }
  }
}

export const authMdlwr = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authCookie = req.cookies[AUTH_COOKIE_NAME];

  if (!authCookie)
    throw new CustomResponseError(404, {
      message: "not authorised!",
    });

  const userJWT: any = jwt.verify(authCookie, process.env.JWT_SECRET!);

  const user = await prismaClient.user.findUnique({
    where: { id: userJWT.id, isBlocked: false },
  });

  if (!user)
    throw new CustomResponseError(404, {
      message: "not authorised!",
    });

  req.user = {
    id: user.id,
    isAdmin: user.isAdmin,
    username: user.username,
    email: user.email,
  };

  next();
};
