require("dotenv").config();

import { PrismaClient } from "@prisma/client";
import type { User } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { sendEmail, generateOTP } from "@repo/utils";

declare global {
  var prisma: PrismaClient;
}

type SignUpCredentials =
  | Pick<User, "email" | "password" | "role">
  | Pick<User, "phoneNumber" | "password" | "role">;

const prisma =
  global.prisma ||
  new PrismaClient().$extends({
    model: {
      user: {
        // @ts-ignore
        async signUp({
          password,
          // @ts-ignore
          email,
          // @ts-ignore
          phoneNumber,
          role,
        }: SignUpCredentials) {
          try {
            if (email) {
              // if email already taken
              if (
                await prisma.user.findFirst({
                  where: {
                    email,
                  },
                })
              ) {
                throw new Error("email taken!");
              }

              const salt = await bcrypt.genSalt(10);

              const user: User = await prisma.$transaction(async (txn) => {
                try {
                  const userCreated = await txn.user.create({
                    data: {
                      email,
                      password: bcrypt.hashSync(password, salt),
                      role,
                      emailVerified: null,
                      phoneNumber: null,
                    },
                  });

                  const otp = generateOTP();

                  await txn.confirmationOTP.create({
                    data: {
                      userId: userCreated.id,
                      otp,
                    },
                  });

                  await sendEmail({
                    to: email,
                    subject: "Email confirmation OTP!",
                    html: `<h3>OTP:${otp}</h3>`,
                  });

                  return userCreated;
                } catch (err) {
                  throw err;
                }
              });

              return {
                userId: user.id,
                message: "Registration successfull!",
              };
            } else if (phoneNumber) {
              throw Error("not supporting phone number!");
            }

            throw Error("what is this, provide something!");
          } catch (error) {
            throw error;
          }
        },
      },
    },
  });

if (process.env.NODE_ENV != "production") {
  global.prisma = prisma;
}

export { prisma as prismaClient };
