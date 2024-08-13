"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "../ui/use-toast";
import React, { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

import { fetcher } from "@/lib/fetcher";
import {
  LoginSchema,
  OTPSchema,
  SignUpSchema,
  TLoginSchema,
  TOtpSchema,
  TSignupSchema,
} from "@repo/utils";
import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";

const LoginForm = () => {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();
  const redirectTo = searchParams.get("redirectTo") || "/";

  const [step, setStep] = useState<"login" | "signup" | "otp">("login");
  const isSignup = step === "signup";

  const [otpResendTimer, setOtpResendTimer] = useState<number | null>(null);

  const loginForm = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: "imsamad00@gmail.com", password: "Password@123" },
  });

  const signUpForm = useForm({
    resolver: zodResolver(SignUpSchema),
    defaultValues: { email: "imsamad00@gmail.com", password: "Password@123" },
  });

  const otpForm = useForm({
    resolver: zodResolver(OTPSchema),
    defaultValues: { otp: "" },
  });

  const [registeredUserId, setRegisteredUserId] = useState("");
  const [isResendingOTP, setIsResendingOTP] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleOtpResend = () => {
    setIsResendingOTP(true);
    fetcher(`/auth/resendOTP/${registeredUserId}`)
      .then(() => {
        toast({
          title: "OTP Sent",
        });
      })
      .finally(() => {
        startOtpResendTimer();
        setIsResendingOTP(false);
      });
  };

  const handleSignUp = async (values: TLoginSchema | TSignupSchema) => {
    setIsLoading(true);
    fetcher("/auth/signup", "post", values)
      .then(({ userId }) => {
        console.log("userId: ", userId);
        setStep("otp");
        startOtpResendTimer();
        setRegisteredUserId(userId);
      })
      .catch((err) => {
        if (err.message == "Email taken!") {
          signUpForm.setError("email", {
            message: "Email taken!",
            type: "server",
          });
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleLogin = async ({ email, password }: TLoginSchema) => {
    try {
      await fetcher("/auth/login", "post", { email, password });
      const res: any = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (!res.ok) {
        await fetcher("/auth/logout");
        throw "hacsd";
      }

      router.push(redirectTo ? redirectTo : "/");
    } catch (err: any) {
      console.log("err: ", err);
      if (err.message.email) {
        console.log("setting error");
        loginForm.setError("email", {
          message: "Invalid email",
          type: "server",
        });
      }

      if (err.message.password) {
        loginForm.setError("password", {
          message: "Invalid password",
          type: "server",
        });
      }
    } finally {
    }
  };

  async function handleOtpAndLogin({ otp }: TOtpSchema) {
    try {
      // Assuming `otp` and `signUpForm` are defined in the scope of this function
      await fetcher(`/auth/confirmOTP/${otp}`, "post");

      const { email, password } = signUpForm.getValues();
      await handleLogin({ email, password });
    } catch (err) {
      console.log(err);
      otpForm.setError("otp", {
        message: "Invalid OTP",
      });
    } finally {
    }
  }

  const startOtpResendTimer = () => {
    if (otpResendTimer !== null) return;
    const timer = Date.now() + 60000; // 1 minute timer
    setOtpResendTimer(timer);
    setTimeout(() => {
      setOtpResendTimer(null);
    }, 60000); // 1 minute
  };

  const handleToggleMode = () => {
    if (isSignup) {
      setStep("login");
      signUpForm.reset();
    } else {
      setStep("signup");
      loginForm.reset();
    }
  };

  const _isLoading =
    otpForm.formState.isSubmitting ||
    loginForm.formState.isSubmitting ||
    signUpForm.formState.isSubmitting ||
    isResendingOTP ||
    isLoading;

  return (
    <div className="h-fit p-8 bg-white flex flex-col items-start gap-8 rounded-xl shadow-lg border-t border-gray-200">
      <div className="w-full flex flex-col justify-center items-center gap-3">
        <h3 className="text-3xl bg-gradient-to-r from-indigo-600 via-violet-500 to-blue-700 bg-clip-text text-transparent font-black">
          100xJobs
        </h3>
      </div>

      {step != "otp" ? (
        <AuthForm
          key={step}
          formType={step}
          form={isSignup ? signUpForm : loginForm}
          handleSubmit={isSignup ? handleSignUp : handleLogin}
          handleToggleMode={handleToggleMode}
          isSignup={isSignup}
        />
      ) : (
        <Form {...otpForm}>
          <form
            className="h-full flex flex-col justify-center items-center gap-2"
            onSubmit={otpForm.handleSubmit(handleOtpAndLogin)}
          >
            <div className="text-sm text-gray-500 font-medium mb-4 w-64">
              OTP sent to your email. Check your inbox and enter it below.
            </div>

            <FormField
              control={otpForm.control}
              name="otp"
              render={({ field }) => (
                <FormItem className="w-64">
                  <FormLabel className="text-sm font-semibold text-gray-800">
                    OTP *
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      {...field}
                      className="border-gray-400"
                      placeholder="Enter OTP here"
                    />
                  </FormControl>
                  <FormMessage className="text-sm" />
                </FormItem>
              )}
            />
            <div className="flex gap-4">
              <Button
                disabled={_isLoading}
                className="w-full flex justify-center items-center"
                type="submit"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  "Submit OTP"
                )}
              </Button>
              <Button
                disabled={otpResendTimer !== null || isLoading}
                className="w-full flex justify-center items-center"
                type="button"
                onClick={handleOtpResend}
              >
                {otpResendTimer !== null
                  ? `Resend OTP (${Math.ceil((otpResendTimer - Date.now()) / 1000)}s)`
                  : "Resend OTP"}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

export default LoginForm;

const AuthForm = ({
  formType,
  form,
  handleSubmit,
  handleToggleMode,

  isSignup,
}: any) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus?.();
  }, []);

  return (
    <React.Fragment key={formType}>
      <Form {...form}>
        <div className="flex flex-col gap-1 justify-center items-center">
          <h4 className="text-lg font-medium">
            {isSignup ? "Sign Up" : "Welcome Back"}
          </h4>
          <p className="text-sm text-gray-500 font-medium">
            {`Please enter your details to sign ${isSignup ? "up" : "in"}`}
          </p>
        </div>
        <form
          className="h-full flex flex-col justify-center items-center gap-5"
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-64">
                <FormLabel className="text-sm font-semibold text-gray-800">
                  Email *
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="border-gray-400"
                    placeholder="Enter your email here"
                    ref={inputRef}
                  />
                </FormControl>
                <FormMessage className="text-sm" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="w-64">
                <FormLabel className="text-sm font-semibold text-gray-800">
                  Password *
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    {...field}
                    className="border-gray-400"
                    placeholder="Enter password here"
                  />
                </FormControl>
                <FormMessage className="text-sm" />
              </FormItem>
            )}
          />

          <Button
            disabled={form.formState.isSubmitting}
            className="w-full flex justify-center items-center"
            type="submit"
          >
            {form.formState.isSubmitting ? (
              <Loader2 className="animate-spin" size={20} />
            ) : isSignup ? (
              "Sign Up"
            ) : (
              "Sign In"
            )}
          </Button>
        </form>
      </Form>
      <button
        type="button"
        className="text-blue-600 underline mt-4"
        onClick={handleToggleMode}
      >
        {isSignup
          ? "Already have an account? Sign In"
          : "Don't have an account? Sign Up"}
      </button>
    </React.Fragment>
  );
};
