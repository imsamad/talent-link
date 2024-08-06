"use client";
import { Suspense } from "react";
import { AuthForm } from "../AuthForm";

const SignUpPage = () => (
  <Suspense>
    {" "}
    <AuthForm formType="signup" />
  </Suspense>
);

export default SignUpPage;
