import { authOption } from "@/lib/authOption";
import { prismaClient } from "@repo/db";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { ProfileWrapper } from "./ProfileWrapper";

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
    include: {
      projects: true,
      experiences: true,
      testimonials: true,
    },
  });

  if (!profile) return redirect("/login?redirectTo=/profile");

  return <ProfileWrapper skills={skills} profile={profile} />;
};

export default ProfilePage;
