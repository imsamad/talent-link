"use client";
import React from "react";
import { fetcher } from "./lib/util";

const page = () => {
  return (
    <div>
      <button
        onClick={async () => {
          await fetcher("/auth/me", "get")
            .then((res) => {
              console.log(res);
              // router.push(redirectTo ? redirectTo : "/");
            })
            .catch((err) => {
              console.log(err);
              // signOut();
            });
          // await fetcher("/")
          //   .then((res) => {
          //     console.log("res: ", res);
          //   })
          //   .catch((err) => {
          //     console.log("err: ", err);
          //   });
        }}
      >
        send
      </button>
    </div>
  );
};

export default page;
