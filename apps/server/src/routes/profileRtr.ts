import {
  ExperienceSchema,
  ObjectIDOnParam,
  ProfileSchema,
  ProjectSchema,
  TestimonialSchema,
} from "@repo/utils";
import { Router } from "express";
import {
  upsertProfileMain,
  getProfile,
  createProfileExperience,
  createProfileProject,
  updateProfileExperience,
  updateProfileProject,
  createProfileTestimonial,
  updateProfileTestimonial,
  deleteProfileProject,
  deleteProfileTestimonial,
  deleteProfileExperience,
} from "../controllers/profileCtrl";
import { authMdlwr, parseCookie } from "../middleware/authMdlwr";
import { validateMdlwr } from "../middleware/validateMdlwr";
const profileRtr = Router();

profileRtr
  .route(["/main", "/"])
  .put(authMdlwr, validateMdlwr(ProfileSchema, "body"), upsertProfileMain)
  .post(authMdlwr, validateMdlwr(ProfileSchema, "body"), upsertProfileMain)
  .get(parseCookie, getProfile);

profileRtr.post(
  "/projects",
  authMdlwr,
  validateMdlwr(ProjectSchema, "body"),
  createProfileProject
);

profileRtr
  .route("/projects/:projectId")
  .put(authMdlwr, validateMdlwr(ProjectSchema, "body"), updateProfileProject)
  .delete(
    authMdlwr,
    validateMdlwr(ObjectIDOnParam("projectId"), "params"),
    deleteProfileProject
  );

profileRtr.post(
  "/experiences",
  authMdlwr,
  validateMdlwr(ExperienceSchema, "body"),
  createProfileExperience
);

profileRtr
  .route("/experiences/:experienceId")
  .put(
    authMdlwr,
    validateMdlwr(ExperienceSchema, "body"),
    updateProfileExperience
  )
  .delete(
    authMdlwr,
    validateMdlwr(ObjectIDOnParam("experienceId"), "params"),
    deleteProfileExperience
  );

profileRtr.post(
  "/testimonials",
  authMdlwr,
  validateMdlwr(TestimonialSchema, "body"),
  createProfileTestimonial
);

profileRtr
  .route("/testimonials/:testimonialId")
  .put(
    authMdlwr,
    validateMdlwr(TestimonialSchema, "body"),
    updateProfileTestimonial
  )
  .delete(
    authMdlwr,
    validateMdlwr(ObjectIDOnParam("testimonialId"), "params"),
    deleteProfileTestimonial
  );
export { profileRtr };
