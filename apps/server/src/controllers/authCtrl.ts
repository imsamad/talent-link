import { prismaClient } from "@repo/db";
import { Request, Response } from "express";
import { CustomError } from "../lib/customError";
import { generateOTP, sendEmail } from "@repo/utils";

export const confirmOTP = async (req: Request, res: Response) => {
  const token = await prismaClient.confirmationOTP.findFirst({
    where: {
      otp: req.params.otp,
    },
  });

  if (!token)
    throw new CustomError(404, {
      message: "what is this, nothing exist!",
    });

  const tenMinutesAgo = new Date(new Date().getTime() - 10 * 60 * 1000); // 10 minutes ago

  if (tenMinutesAgo >= new Date(token?.createdAt)) {
    await prismaClient.user.delete({
      where: {
        id: token.userId,
      },
    });

    throw new CustomError(403, {
      message: "token expired, sign up again!",
    });
  }
  console.log("token.id:", token.id);
  await prismaClient.confirmationOTP.delete({ where: { id: token.id } });

  await prismaClient.user.update({
    where: { id: token.userId },
    data: {
      emailVerified: new Date(),
    },
  });

  res.json({
    mesaage: "authorised!",
  });
};

export const resendOTP = async (req: Request, res: Response) => {
  const token = await prismaClient.confirmationOTP.findFirst({
    where: {
      userId: req.params.userId,
    },
  });

  if (!token)
    throw new CustomError(404, {
      message: "what is this!",
    });
  else {
    const tenMinutesAgo = new Date(new Date().getTime() - 10 * 60 * 1000); // 10 minutes ago

    if (tenMinutesAgo < new Date(token.createdAt)) {
      throw new CustomError(403, {
        message: "Had sent!",
      });
    }
  }

  const user = await prismaClient.user.findFirst({
    where: { id: req.params.userId },
  });

  if (!user)
    throw new CustomError(404, {
      message: "what is this!",
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

  await sendEmail({
    to: user.email,
    subject: "Email confirmation OTP!",
    html: `<h3>OTP:${otp}</h3>`,
  });

  res.json({
    mesaage: "OTP sent!",
  });
};
