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
      select: {
        skills: true,
        experiences: true,
        educations: true,
        invitaion: true,
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

export const upsertProfileExperiences = async (req: Request, res: Response) => {
  const userId = req.user?.id! as string;

  const { newExperiences, prevExperiences } = req.body.experiences.reduce(
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
    await prismaClient.experience.createMany({
      data: newExperiences.map((experience: any) => ({
        ...experience,
        profileId: userId,
      })),
    });
  }

  if (prevExperiences.length > 0) {
    await Promise.all(
      prevExperiences.map(({ id, ...rest }: any) =>
        prismaClient.experience.update({
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
        experiences: true,
      },
    }),
  });
};

export const upsertProfileProjects = async (req: Request, res: Response) => {
  const userId = req.user?.id! as string;

  const { newProjects, prevProjects } = req.body.projects.reduce(
    (acc: any, { id, ...rest }: any) => {
      if (!id) {
        acc.newProjects.push({ ...rest });
      } else {
        acc.prevProjects.push({ id, ...rest });
      }
      return acc;
    },
    { newProjects: [], prevProjects: [] },
  );

  if (newProjects.length > 0) {
    await prismaClient.project.createMany({
      data: newProjects.map((project: any) => ({
        ...project,
        profileId: userId,
      })),
    });
  }

  if (prevProjects.length > 0) {
    await Promise.all(
      prevProjects.map(({ id, ...rest }: any) =>
        prismaClient.project.update({
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
        projects: true,
      },
    }),
  });
};

export const upsertProfileTestimonials = async (
  req: Request,
  res: Response,
) => {
  const userId = req.user?.id! as string;

  const { newTestimonials, prevTestimonials } = req.body.testimonials.reduce(
    (acc: any, { id, ...rest }: any) => {
      if (!id) {
        acc.newTestimonials.push({ ...rest });
      } else {
        acc.prevTestimonials.push({ id, ...rest });
      }
      return acc;
    },
    { newTestimonials: [], prevTestimonials: [] },
  );

  if (newTestimonials.length > 0) {
    await prismaClient.testimonial.createMany({
      data: newTestimonials.map((testimonial: any) => ({
        ...testimonial,
        profileId: userId,
      })),
    });
  }

  if (prevTestimonials.length > 0) {
    await Promise.all(
      prevTestimonials.map(({ id, ...rest }: any) =>
        prismaClient.testimonial.update({
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
        testimonials: true,
      },
    }),
  });
};
