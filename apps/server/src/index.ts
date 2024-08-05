require("dotenv").config();
require("express-async-errors");
import { server } from "./server";

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.info(`running on ${PORT}`);
});
