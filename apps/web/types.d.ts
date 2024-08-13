import { DefaultSession, User as DefaultUser } from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import { JWT } from "next-auth/jwt";

type Role = "ADMIN" | "USER";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      role: Role;
    } & DefaultSession["user"];
  }

  interface User {
    username: String;
    email: String;
    role: Role;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: Role;

    user: {
      role: Role;
      id: string;
      username: string;
    } & DefaultUser["user"];
  }
}

type SAPayload = {
  status: "success" | "error";
  message?: string;
};

type LoginAction = {
  email: string;
  password: string;
};
