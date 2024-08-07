require("dotenv").config();
require("express-async-errors");
import { server } from "./server";
import { prismaClient } from "@repo/db";

const PORT = process.env.PORT || 4000;

prismaClient
  .$connect()
  .then(() => {
    console.log("db connected!");
    server.listen(PORT, () => {
      console.info(`running on ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("error while spining off server!");
    console.log(err);
    process.exit(1);
  });

process.on("exit", () => {
  prismaClient.$disconnect();
  console.log("exist");
});
