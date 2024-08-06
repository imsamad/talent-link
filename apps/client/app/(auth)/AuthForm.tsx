"use client";
import Link from "next/link";
import React, { useState, useEffect, FormEvent } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { fetcher } from "../lib/util";
import { useRouter, useSearchParams } from "next/navigation";

type TFormType = "login" | "signup" | "otp";

const AuthForm = ({ formType }: { formType: "login" | "signup" }) => {
  const { status } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();
  const redirectTo = searchParams.get("redirectTo");

  // useEffect(() => {
  //   if (status == "authenticated") router.push(redirectTo ? redirectTo : "/");
  // }, [status]);

  const [step, setStep] = useState<TFormType>(formType);

  const [email, setEmail] = useState("imsamad00@gmail.com");
  const [password, setPassword] = useState("12345678");
  const [cohortId, setCohortId] = useState("12345678");
  const [error, setError] = useState("");
  // automatic nulled when set
  useEffect(() => {
    if (error)
      setTimeout(() => {
        setError("");
      }, 3000);
  }, [error]);

  const [registeredUserId, setRegisteredUserId] = useState("");

  const [otp, setOtp] = useState("");

  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);

      if (timer === 0) {
        clearInterval(interval);
        setIsResendDisabled(false);
      }

      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleLogIn = async (email: string, password: string) => {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    })
      .then((res: any) => {
        if (!res.ok) {
          throw "csdc";
        }
        fetcher("/auth/login", "post", { email, password })
          .then(() => {
            router.push(redirectTo ? redirectTo : "/");
          })
          .catch(() => {
            signOut();
          });
      })
      .catch((err) => {
        setError("Provide valid credentials!");
      });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (formType == "login") {
      handleLogIn(email, password);
      return;
    }

    await fetcher("/auth/signup", "post", {
      email,
      password,
      cohortId,
    })
      .then(({ userId }) => {
        setRegisteredUserId(userId);
        setStep("otp");
        setIsResendDisabled(true);
        setTimer(60);
      })
      .catch((err) => {
        setError(err.message || "Plz try again!");
      })
      .finally(() => {});
  };

  const handleSubmitOtp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await fetcher(`/auth/confirmOTP/${otp}`, "post")
      .then(() => {
        handleLogIn(email, password);
      })
      .catch((err) => {
        setError(err.message || "Plz try again!");
      })
      .finally(() => {});
  };

  const handleResendOtp = async () => {
    await fetcher(`/auth/resendOTP/${registeredUserId}`).finally(() => {
      setIsResendDisabled(true);
      setTimer(60);
    });
  };

  const errorHeading = error ? (
    <h1 className="text-sm text-pink-600 italic text-center font-bold mb-4">
      {error}
    </h1>
  ) : null;
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white border border-gray-300 rounded-lg shadow-md">
        {["signup", "login"].includes(step) ? (
          <>
            <h1 className="text-2xl font-bold mb-6">
              {formType == "login" ? "Log In" : "Sign Up"}
            </h1>
            {errorHeading}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email:
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password:
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              {formType == "signup" && (
                <div>
                  <label
                    htmlFor="cohortId"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Cohort ID:
                  </label>
                  <input
                    type="text"
                    id="cohortId"
                    value={cohortId}
                    onChange={(e) => setCohortId(e.target.value)}
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
              )}
              <button
                type="submit"
                className="w-full py-2 px-4 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                Submit
              </button>
              <p className="text-sm font-light text-gray-500 mt-4">
                {formType == "signup"
                  ? `Already have an account?`
                  : ` Don't have an account?`}{" "}
                &nbsp;
                <Link
                  href={formType == "signup" ? "/login" : "/signup"}
                  className="text-blue-500 hover:underline"
                >
                  {formType == "signup" ? "Login here" : "Sign Up here"}
                </Link>
              </p>
            </form>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-6">Enter OTP</h1>
            {errorHeading}
            <form onSubmit={handleSubmitOtp} className="space-y-4">
              <div>
                <label
                  htmlFor="otp"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  OTP:
                </label>
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={4}
                  required
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 px-4 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                Verify OTP
              </button>
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={isResendDisabled}
                className={`w-full mt-4 py-2 px-4 border border-blue-500 text-blue-500 font-medium rounded-lg ${isResendDisabled ? "bg-gray-300" : "bg-white hover:bg-blue-50"}`}
              >
                {isResendDisabled ? `Resend OTP in ${timer}s` : "Resend OTP"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export { AuthForm };
