import { prismaClient, User } from "@repo/db";
import { Request, Response } from "express";
import * as bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import {
  CustomError,
  CustomResponseError,
  generateOTP,
  sendEmail,
  TCustomError,
  TCustomResponseError,
} from "@repo/utils";
import { AUTH_COOKIE_NAME } from "../lib/const";

export const logout = async (_: Request, res: Response) => {
  res.cookie(AUTH_COOKIE_NAME, "", { maxAge: 0 });
  res.send("logout");
};

export const getMe = async (req: Request, res: Response) => {
  res.json({
    user: {
      id: req.user?.id!,
      username: req.user?.username!,
      email: req.user?.email!,
    },
  });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password)
    return new CustomResponseError(404, {
      message: "provide email and password",
    });

  const user = await prismaClient.user.findFirst({
    where: { email, emailVerified: { not: null } },
  });

  if (!user)
    return new CustomResponseError(404, {
      message: "user not found",
    });

  if (!(await bcrypt.compare(password, user.password)))
    return new CustomResponseError(404, {
      message: "invalid credentials!",
    });

  const jwtToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, {
    // seconds
    expiresIn: 60 * 60 * (parseInt(process.env.JWT_EXPIRE_IN_HR!, 10) || 1),
  });

  res.cookie(AUTH_COOKIE_NAME, jwtToken, {
    // ms
    maxAge: 60 * 60 * 1000 * (parseInt(process.env.JWT_EXPIRE_IN_HR!, 10) || 1),
    secure: process.env.NODE_ENV == "production",
    httpOnly: true,
    sameSite: "strict",
  });

  res.json({
    id: user.id,
    email: user.email,
    username: user.username,
  });
};

export const signUp = async (req: Request, res: Response) => {
  const body: {
    email: string;
    password: string;
  } = req.body;

  let { email, password } = body;

  if (!email || !password)
    return new CustomResponseError(404, {
      message: "provide email and password",
    });

  if (
    await prisma.user.findUnique({
      where: {
        email,
      },
    })
  ) {
    throw new CustomResponseError(404, { message: "Email taken!" });
  }

  const salt = await bcrypt.genSalt(parseInt(process.env.SALT_SIZE!) || 10);

  const user: User = await prisma.$transaction(async (txn) => {
    try {
      const userCreated = await txn.user.create({
        data: {
          email,
          password: bcrypt.hashSync(password, salt),
          emailVerified: null,
          phoneNumber: null,
          username: Math.random().toString().slice(10),
        },
      });

      const otp = generateOTP();

      await txn.confirmationOTP.create({
        data: {
          userId: userCreated.id,
          otp,
        },
      });

      if (process.env.EMAIL_USER && process.env.EMAIL_PASS)
        await sendEmail({
          to: email,
          subject: "Email confirmation OTP!",
          html: `<h3>OTP:${otp}</h3>`,
        });

      return userCreated;
    } catch (err) {
      if (err instanceof TCustomResponseError || err instanceof TCustomError)
        throw err;

      throw new CustomError(err);
    }
  });

  res.json({
    userId: user.id,
    message: "Registred successfully, plz verify email!",
  });
};

export const confirmOTP = async (req: Request, res: Response) => {
  const token = await prismaClient.confirmationOTP.findFirst({
    where: {
      otp: req.params.otp,
    },
  });

  if (!token)
    throw new CustomResponseError(404, {
      message: "Not Found!",
    });

  const tenMinutesAgo = new Date(
    new Date().getTime() -
      parseInt(process.env.OTP_EXPIRE_IN_MIN!, 10) * 60 * 1000
  );

  if (tenMinutesAgo >= new Date(token?.createdAt)) {
    throw new CustomResponseError(403, {
      message: "Token expired!",
    });
  }

  await prismaClient.confirmationOTP.delete({ where: { id: token.id } });

  await prismaClient.user.update({
    where: { id: token.userId },
    data: {
      emailVerified: new Date(),
    },
  });

  res.json({
    mesaage: "Authorised, enjoy!",
  });
};

export const resendOTP = async (req: Request, res: Response) => {
  const token = await prismaClient.confirmationOTP.findFirst({
    where: {
      userId: req.params.userId,
    },
  });

  if (!token)
    throw new CustomResponseError(404, {
      message: "What is this!",
    });
  else {
    const tenMinutesAgo = new Date(
      new Date().getTime() -
        parseInt(process.env.OTP_RETRY_IN_MIN!, 10) * 60 * 1000
    );

    if (tenMinutesAgo < new Date(token.createdAt)) {
      throw new CustomResponseError(403, {
        message: "Had sent!",
      });
    }
  }

  const user = await prismaClient.user.findFirst({
    where: { id: req.params.userId },
  });

  if (!user)
    throw new CustomResponseError(404, {
      message: "What is this!",
    });

  const otp = generateOTP();

  await prismaClient.confirmationOTP.upsert({
    where: { userId: user.id },
    update: {
      otp,
      createdAt: new Date(),
    },
    create: {
      otp,
      createdAt: new Date(),
      userId: user.id,
    },
  });
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS)
    await sendEmail({
      to: user.email,
      subject: "Email confirmation OTP!",
      html: `<h3>OTP:${otp}</h3>`,
    });

  res.json({
    mesaage: "OTP sent!",
  });
};
