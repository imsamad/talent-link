require("dotenv").config();
require("express-async-errors");

import { server } from "./server";

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.info(`running on ${PORT}`);
});

// ========================
// extends typings
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
