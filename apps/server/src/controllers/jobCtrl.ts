import { prismaClient } from "@repo/db";
import { CustomResponseError } from "@repo/utils";
import { Request, Response } from "express";

export const createJob = async (req: Request, res: Response) => {
  const userId = req.user?.id! as string;

  res.json({
    job: await prismaClient.job.create({
      data: { ...req.body.job, userId },
      include: {
        skills: {
          select: {
            name: true,
            id: true,
          },
        },
      },
    }),
  });
};

export const updateJob = async (req: Request, res: Response) => {
  const userId = req.user?.id! as string;
  const job = await prismaClient.job.findFirst({
    where: {
      userId,
      id: req.params.jobId,
    },

    select: {
      applications: true,
    },
  });
  console.log(job);
  if (!job)
    throw new CustomResponseError(404, {
      message: "not found",
    });

  if (job.applications.length != 0)
    throw new CustomResponseError(404, {
      message: "it is freezed",
    });

  res.json({
    job: await prismaClient.job.update({
      where: {
        userId,
        id: req.params.jobId,
      },
      data: { ...req.body.job, userId },
    }),
  });
};

export const deleteJob = async (req: Request, res: Response) => {
  // if no one applied till now then job can be deleted, otherwise have to close, by populating close field closing time
  const userId = req.user?.id! as string;
  // throw new CustomResponseError(400, "not found");
  //
  const job = await prismaClient.job.findFirst({
    where: {
      id: req.params.jobId,
      userId,
    },
    select: {
      applications: true,
    },
  });

  if (!job)
    throw new CustomResponseError(404, {
      message: "not found",
    });

  if (job.applications.length)
    throw new CustomResponseError(404, {
      message: "can not delete, u can only close it!",
    });

  await prismaClient.job.delete({
    where: {
      id: req.params.jobId,
    },
  });

  res.json({
    message: "deleted!",
  });
};

export const getJobs = async (req: Request, res: Response) => {
  // it is general contoller for
  // 1. equivalent to /myjobs
  const userId = req.user?.id! as string;
  if (userId) {
    return res.json({
      jobs: await prismaClient.job.findMany({ where: { userId } }),
    });
  }

  // 2. getSigleJobId
  const jobId = req.query.jobId! as string;
  if (jobId) {
    return res.json({
      jobs: await prismaClient.job.findMany({ where: { id: jobId } }),
    });
  }

  return res.json({
    jobs: await prismaClient.job.findMany(),
  });
};

export const closeJob = async (req: Request, res: Response) => {
  const userId = req.user?.id! as string;

  await prismaClient.job.update({
    where: {
      id: req.params.jobId,
      userId,
    },
    data: {
      closedAt: new Date(),
      applications: {
        updateMany: {
          where: {
            jobId: req.params.jobId,
            status: "PENDING",
          },
          data: {
            status: "REJECTED",
          },
        },
      },
    },
  });

  res.json({
    message: "done",
  });
};
