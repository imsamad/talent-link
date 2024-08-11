import { Router } from "express";

import { validateMdlwr } from "../middleware/validateMdlwr";
import { JobSchema, ObjectIDOnParam } from "@repo/utils";
import { authMdlwr } from "../middleware/authMdlwr";
import {
  createJob,
  deleteJob,
  getJobs,
  updateJob,
  closeJob,
} from "../controllers/jobCtrl";

const jobRtr = Router();

jobRtr
  .route("/")
  .post(authMdlwr, validateMdlwr(JobSchema, "body"), createJob)
  .get(getJobs);

jobRtr.route("/myJobs").get(authMdlwr, getJobs);

jobRtr
  .route("/closeJob/:jobId")
  .post(authMdlwr, validateMdlwr(ObjectIDOnParam("jobId"), "params"), closeJob);

jobRtr
  .route("/:jobId")
  .put(
    authMdlwr,
    validateMdlwr(ObjectIDOnParam("jobId"), "params"),
    validateMdlwr(JobSchema, "body"),
    updateJob,
  )
  .delete(
    authMdlwr,
    validateMdlwr(ObjectIDOnParam("jobId"), "params"),
    deleteJob,
  );

export { jobRtr };
