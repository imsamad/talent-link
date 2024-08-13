import {
  Gender_Enum,
  EmploymentStatus_Enum,
  JOINING_STATUS_Enum,
  WORK_MODE_Enum,
  ApplicationStatus_Enum,
} from "@repo/db";

const labels: Record<string, string> = {
  [Gender_Enum.MALE]: "Male",
  [Gender_Enum.FEMALE]: "Female",

  [EmploymentStatus_Enum.ACTIVELY_LOOKING]: "Actively Looking",
  [EmploymentStatus_Enum.EMPLOYED]: "Employed",

  [JOINING_STATUS_Enum.IMMEDIATE]: "Immediate",
  [JOINING_STATUS_Enum.WITHIN_2_WEEKS]: "Within 2 Weeks",
  [JOINING_STATUS_Enum.FROM_2_TO_4_WEEKS]: "From 2 to 4 Weeks",
  [JOINING_STATUS_Enum.FROM_4_TO_8_WEEKS]: "From 4 to 8 Weeks",
  [JOINING_STATUS_Enum.MORE_THAN_8_WEEKS]: "More Than 8 Weeks",

  [ApplicationStatus_Enum.PENDING]: "Pending",
  [ApplicationStatus_Enum.ACCEPTED_FOR_INTERVIEW]: "Accepted for Interview",
  [ApplicationStatus_Enum.HIRED]: "Hired",
  [ApplicationStatus_Enum.REJECTED]: "Rejected",

  [WORK_MODE_Enum.WFH]: "Work From Home",
  [WORK_MODE_Enum.REMOTE]: "Remote",
  [WORK_MODE_Enum.HYBRID]: "Hybrid",
};

// Function to extract and map values to human-readable labels
export const generateEnumLabelList = <T>(
  enumObj: T,
): { id: string; label: string }[] =>
  // @ts-ignore
  Object.values(enumObj).map((v: string) => ({
    id: v,
    label: labels[v] || v,
  }));
