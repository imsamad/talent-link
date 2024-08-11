import { Router } from "express";
import {
  getProfile,
  upsertProfileMain,
  upsertProfileEducations,
  upsertProfileExperiences,
  upsertProfileProjects,
  upsertProfileTestimonials,
} from "../controllers/profileCtrl";
import { validateMdlwr } from "../middleware/validateMdlwr";
import {
  EducationSchema,
  ExperienceSchema,
  ProfileSchema,
  ProjectSchema,
  TestimonialSchema,
} from "@repo/utils";
import { authMdlwr, parseCookie } from "../middleware/authMdlwr";
const profileRtr = Router();

profileRtr
  .route(["/main", "/"])
  .put(authMdlwr, validateMdlwr(ProfileSchema, "body"), upsertProfileMain)
  .post(authMdlwr, validateMdlwr(ProfileSchema, "body"), upsertProfileMain)
  .get(parseCookie, getProfile);

profileRtr.post(
  "/educations",
  authMdlwr,
  validateMdlwr(EducationSchema, "body"),
  upsertProfileEducations,
);

profileRtr.post(
  "/experiences",
  authMdlwr,
  validateMdlwr(ExperienceSchema, "body"),
  upsertProfileExperiences,
);

profileRtr.post(
  "/projects",
  authMdlwr,
  validateMdlwr(ProjectSchema, "body"),
  upsertProfileProjects,
);

profileRtr.post(
  "/testimonials",
  authMdlwr,
  validateMdlwr(TestimonialSchema, "body"),
  upsertProfileTestimonials,
);

export { profileRtr };
