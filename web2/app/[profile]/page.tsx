"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import React from "react";
import Resume from "../components/Resume";

const ProfilePage = () => {
  const router = useRouter();

  const { data } = useSession({
    required: true,
    onUnauthenticated: () => {
      router.push("/login");
    },
  });

  return <Resume />;
};

export default ProfilePage;
