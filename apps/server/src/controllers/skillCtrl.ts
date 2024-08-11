import { prismaClient } from "@repo/db";
import { Request, Response } from "express";

export const getSkills = async (req: Request, res: Response) => {
  res.json({
    skills: (await prismaClient.skill.findMany()).map(({ id, name }) => ({
      id,
      name,
    })),
  });
};
