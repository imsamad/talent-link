import { PrismaClient } from "@prisma/client";

import {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/library";

declare global {
  var prisma: PrismaClient;
}

const prisma =
  global.prisma ||
  new PrismaClient({
    errorFormat: "pretty",
  });

if (process.env.NODE_ENV != "production") {
  global.prisma = prisma;
}

export { prisma as prismaClient };

export {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
};
export * from "@prisma/client";
