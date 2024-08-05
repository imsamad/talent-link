import { NextResponse } from "next/server";
// import { prismaClient } from "@repo/db";

export async function GET(req: Request) {
  return NextResponse.json(
    {
      message: "provide email and password",
      // data: await prismaClient.user.findMany({}),
    },
    {
      status: 404,
    }
  );

  // try {
  //   const body: {
  //     email: string;
  //     password: string;
  //   } = await req.json();
  //   console.log("firstfirstfirstfirstfirstfirstfirstfirst");
  //   let { email, password } = body;

  //   if (!email || !password)
  //     return NextResponse.json(
  //       { message: "provide email and password" },
  //       {
  //         status: 404,
  //       }
  //     );

  //   const user = await prismaClient.user.signUp({
  //     email,
  //     password,
  //     role: "APPLICANT",
  //   });

  //   console.log(user);

  //   return NextResponse.json(
  //     { message: "Sign Up Sucessfully!" },
  //     {
  //       status: 202,
  //     }
  //   );
  // } catch (err: any) {
  //   console.log("err: ", err);
  //   return NextResponse.json(
  //     { message: "error, try again!" },
  //     {
  //       status: 404,
  //     }
  //   );
  // }
}
