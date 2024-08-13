import { fetcher } from "@/lib/fetcher";
import React from "react";
import { ProfileForm } from "./ProfleForm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { prismaClient } from "@repo/db";
import { authOption } from "@/lib/authOption";

const ProfilePage = async () => {
  const session = await getServerSession(authOption);
  // @ts-ignore
  if (!!!session) {
    return redirect("/login?redirectTo=/profile");
  }

  const skills = (
    await prismaClient.skill.findMany({
      take: 100,
    })
  ).map(({ id, name }) => ({ id, name }));

  const profile = await prismaClient.profile.findFirst({
    // @ts-ignore
    where: { id: session.id! as string },
  });

  console.log("profile:", profile);
  return <ProfileForm skills={skills} profile={profile!} />;
};

export default ProfilePage;
