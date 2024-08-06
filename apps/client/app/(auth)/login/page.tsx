"use client";
import { Suspense } from "react";
import { AuthForm } from "../AuthForm";

const LoginPage = () => (
  <Suspense>
    <AuthForm formType="login" />{" "}
  </Suspense>
);
export default LoginPage;
