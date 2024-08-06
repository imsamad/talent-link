"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import React from "react";

const ProfilePage = () => {
  const router = useRouter();

  const { data } = useSession({
    required: true,
    onUnauthenticated: () => {
      router.push("/login");
    },
  });

  return <div>ProfilePage</div>;
};

export default ProfilePage;
