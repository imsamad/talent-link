import { Router } from "express";
import { authMdlwr } from "../middleware/authMdlwr";
import { validateMdlwr } from "../middleware/validateMdlwr";

import {
  applyOnJob,
  inviteForApplication,
  acceptApplicationsFinally,
  approvedApplicationsForInterview,
  getApplications,
} from "../controllers/applicationCtrl";

import { ApplicationSchema, ObjectIDOnParam } from "@repo/utils";

const applicationRtr = Router();

applicationRtr
  .route("/apply/:jobId")
  .post(authMdlwr, validateMdlwr(ApplicationSchema, "body"), applyOnJob);

applicationRtr
  .route("/invite/:jobId/:invitee")
  .post(
    validateMdlwr(ObjectIDOnParam("jobId"), "params"),
    validateMdlwr(ObjectIDOnParam("invitee"), "params"),
    authMdlwr,
    inviteForApplication,
  );

applicationRtr
  .route("/acceptForInteriew/:jobId/:applicationId")
  .post(
    validateMdlwr(ObjectIDOnParam("applicationId"), "params"),
    validateMdlwr(ObjectIDOnParam("jobId"), "params"),
    authMdlwr,
    approvedApplicationsForInterview,
  );

applicationRtr
  .route("/acceptFinally/:jobId/:applicationId")
  .post(
    validateMdlwr(ObjectIDOnParam("applicationId"), "params"),
    validateMdlwr(ObjectIDOnParam("jobId"), "params"),
    authMdlwr,
    acceptApplicationsFinally,
  );

applicationRtr
  .route("/:jobId")
  .get(
    validateMdlwr(ObjectIDOnParam("jobId"), "params"),
    authMdlwr,
    getApplications,
  );

export { applicationRtr };
