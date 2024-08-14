import { prismaClient } from "@repo/db";
import { CustomResponseError } from "@repo/utils";
import { Request, Response } from "express";

export const upsertProfileMain = async (req: Request, res: Response) => {
  const userId = req.user?.id! as string;
  console.log(userId, "userId: ", req.body);
  if (req.body.dateOfBirth)
    req.body.dateOfBirth = new Date(req.body.dateOfBirth);

  const r = await prismaClient.profile.upsert({
    where: { id: userId },
    update: {
      ...req.body,
    },
    create: {
      ...req.body,
    },
  });

  res.json(r);
};

export const getProfile = async (req: Request, res: Response) => {
  let profile: any;
  // two ways to fetch data
  console.log("req.user?.id: ", req.user?.id);

  if (!req.user?.id) {
    const username = req.query.username;
    if (username) {
      profile = await prismaClient.user.findFirst({
        where: { username: username! as string },
        select: {
          profile: {
            select: {
              skills: true,
              experiences: true,
              educations: true,
              invitaion: true,
              projects: true,
              testimonials: true,
            },
          },
        },
      });
    }
  } else {
    console.log("first");
    profile = await prismaClient.profile.findFirst({
      where: {
        id: req.user?.id! as string,
      },
      include: {
        skills: true,
        experiences: true,
        educations: true,
        invitaion: true,
        projects: true,
        testimonials: true,
      },
    });
  }

  if (!profile)
    throw new CustomResponseError(404, {
      message: "profile not found",
    });

  res.json({
    profile,
  });
};

export const upsertProfileEducations = async (req: Request, res: Response) => {
  const userId = req.user?.id! as string;

  const { newExperiences, prevExperiences } = req.body.educations.reduce(
    (acc: any, { id, ...rest }: any) => {
      if (!id) {
        acc.newExperiences.push({ ...rest });
      } else {
        acc.prevExperiences.push({ id, ...rest });
      }
      return acc;
    },
    { newExperiences: [], prevExperiences: [] },
  );

  if (newExperiences.length > 0) {
    await prismaClient.education.createMany({
      data: newExperiences.map((education: any) => ({
        ...education,
        profileId: userId,
      })),
    });
  }

  if (prevExperiences.length > 0) {
    await Promise.all(
      prevExperiences.map(({ id, ...rest }: any) =>
        prismaClient.education.update({
          where: { id },
          data: rest,
        }),
      ),
    );
  }

  res.json({
    profile: await prismaClient.profile.findUnique({
      where: { id: userId },
      include: {
        educations: true,
      },
    }),
  });
};

export const createProfileProject = async (req: Request, res: Response) => {
  const userId = req.user?.id! as string;

  const { id, ...rest } = req.body;

  res.json({
    project: await prismaClient.project.create({
      data: {
        ...rest,
        profileId: userId,
      },
    }),
  });
};

export const updateProfileProject = async (req: Request, res: Response) => {
  const userId = req.user?.id! as string;
  console.log("req.body: ", req.body);
  const { id, profileId, ...rest } = req.body;

  res.json({
    project: await prismaClient.project.update({
      where: { id: req.params.projectId },
      data: {
        ...rest,
      },
    }),
  });
};

export const deleteProfileProject = async (req: Request, res: Response) => {
  const userId = req.user?.id! as string;
  await prismaClient.project.delete({
    where: { id: req.params.projectId, profileId: userId },
  });
  res.json({
    message: "Deleted",
  });
};

export const createProfileTestimonial = async (req: Request, res: Response) => {
  const userId = req.user?.id! as string;

  const { id, ...rest } = req.body;

  res.json({
    testimonial: await prismaClient.testimonial.create({
      data: {
        ...rest,
        profileId: userId,
      },
    }),
  });
};

export const updateProfileTestimonial = async (req: Request, res: Response) => {
  const userId = req.user?.id! as string;

  const { id, profileId, ...rest } = req.body;

  res.json({
    testimonial: await prismaClient.testimonial.update({
      where: { id: req.params.testimonialId },
      data: rest,
    }),
  });
};
export const deleteProfileTestimonial = async (req: Request, res: Response) => {
  const userId = req.user?.id! as string;

  await prismaClient.testimonial.delete({
    where: { id: req.params.testimonialId, profileId: userId },
  });

  res.json({
    testimonial: "Deleted",
  });
};

export const createProfileExperience = async (req: Request, res: Response) => {
  const userId = req.user?.id! as string;

  const { id, ...rest } = req.body;

  res.json({
    experience: await prismaClient.experience.create({
      data: {
        ...rest,
        profileId: userId,
      },
    }),
  });
};

export const updateProfileExperience = async (req: Request, res: Response) => {
  const userId = req.user?.id! as string;

  const { id, profileId, ...rest } = req.body;

  res.json({
    experience: await prismaClient.experience.update({
      where: { id: req.params.experienceId },
      data: {
        ...rest,
      },
    }),
  });
};

export const deleteProfileExperience = async (req: Request, res: Response) => {
  const userId = req.user?.id! as string;

  await prismaClient.experience.delete({
    where: { id: req.params.experienceId, profileId: userId },
  }),
    res.json({
      message: "Deleted",
    });
};
