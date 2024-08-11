import { prismaClient } from "@repo/db";
import { Request, Response } from "express";

import { CustomResponseError } from "@repo/utils";

export const applyOnJob = async (req: Request, res: Response) => {
  const userId = req.user?.id! as string;

  // check to prevemt the self-application
  const job = await prismaClient.job.findFirst({
    where: {
      id: req.params.jobId,
      userId: {
        not: userId,
      },

      closedAt: null,
    },
  });

  if (!job)
    throw new CustomResponseError(404, {
      message: "job not found",
    });

  res.json({
    application: await prismaClient.application.create({
      data: {
        ...(req.body.application ?? {}),
        status: "PENDING",
        jobId: job.id,
        profileId: userId,
      },
    }),
  });
};

export const inviteForApplication = async (req: Request, res: Response) => {
  const userId = req.user?.id! as string;
  const invitee = req.params.invitee;
  const jobId = req.params.jobId;

  // prevent self hanky-panky
  if (userId == invitee)
    throw new CustomResponseError(404, {
      message: "not allowed",
    });

  if (
    !(await prismaClient.job.findFirst({
      where: {
        id: jobId,
        userId,
      },
    }))
  )
    throw new CustomResponseError(404, {
      message: "job not found",
    });

  // TODO: check to validate whether invitee exist or not
  await prismaClient.invitation.upsert({
    where: { id: invitee },
    update: {
      jobIds: {
        push: jobId,
      },
    },
    create: { id: userId, jobIds: [jobId] },
  });

  // TODO: notify the user

  res.json({
    message: "invited!",
  });
};

export const getApplications = async (req: Request, res: Response) => {
  res.json({
    applications: await prismaClient.application.findMany({
      where: { jobId: req.params.jobId },
    }),
  });
};

export const approvedApplicationsForInterview = async (
  req: Request,
  res: Response,
) => {
  const userId = req.user?.id! as string;
  const jobId = req.params.jobId;
  const applicationId = req.params.applicationId;

  // find whether job exist or not and then update application status
  await prismaClient.job.update({
    where: {
      id: jobId,
      userId,
    },
    data: {
      applications: {
        update: {
          where: {
            id: applicationId,
          },
          data: {
            status: "ACCEPTED_FOR_INTERVIEW",
          },
        },
      },
    },
  });

  res.json({
    message: "approved for interviews",
  });
};

export const acceptApplicationsFinally = async (
  req: Request,
  res: Response,
) => {
  const userId = req.user?.id! as string;
  const jobId = req.params.jobId;
  const applicationId = req.params.applicationId;
  // find whether job exist or not and then update application status

  await prismaClient.job.update({
    where: {
      id: jobId,
      userId,
    },
    data: {
      applications: {
        update: {
          where: {
            id: applicationId,
          },
          data: {
            status: "HIRED",
          },
        },
      },
    },
  });

  res.json({
    message: "approved finally",
  });
};
