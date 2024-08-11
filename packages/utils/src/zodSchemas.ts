import {
  ApplicationStatus_Enum,
  EmploymentStatus_Enum,
  Gender_Enum,
  JOINING_STATUS_Enum,
  WORK_MODE_Enum,
} from "@prisma/client";
import { z } from "zod";

// Enum definitions
export const GenderEnum = z.nativeEnum(Gender_Enum);
export const EmploymentStatusEnum = z.nativeEnum(EmploymentStatus_Enum);
export const JoiningStatusEnum = z.nativeEnum(JOINING_STATUS_Enum);
export const WorkModeEnum = z.nativeEnum(WORK_MODE_Enum);
export const ApplicationStatusEnum = z.nativeEnum(ApplicationStatus_Enum);

export const AddressSchema = z.object({
  city: z.string().optional(),
  state: z.string(),
  country: z.string(),
  pincode: z.string().optional(),
  longitude: z.string().optional(),
  latitude: z.string().optional(),
});

export const DateRangeSchema = z.object({
  start: z.coerce.date(),
  end: z.coerce.date().optional(),
});

export const InstituteSchema = z.object({
  name: z.string(),
  url: z.string().optional(),
});

export const OrganisationSchema = z.object({
  name: z.string(),
  url: z.string().optional(),
});

export const ExperienceRequirementSchema = z.object({
  min: z.number(),
  max: z.number(),
});

export const SalaryBracketSchema = z.object({
  min: z.number(),
  max: z.number(),
});

export const LoginSchema = z.object({
  email: z
    .string({
      required_error: "email is required",
      invalid_type_error: "invalid data type",
    })
    .email(),
  password: z.string({
    required_error: "email is required",
    invalid_type_error: "invalid data type",
  }),
});

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const ObjectIdSchema = z
  .string()
  .refine((value) => objectIdRegex.test(value), {
    message: "Invalid ObjectID format",
  });

export const ProfileSchema = z
  .object({
    intro: z.string().optional(),
    socialLinks: z.array(z.string().url()).optional(),
    videoResume: z.string().url().optional(),
    resumeLinks: z.array(z.string().url()).optional(),
    gender: GenderEnum.optional(),
    dateOfBirth: z.coerce.date().optional(),
    currentCTC: z.number().optional(),
    expectedCTC: SalaryBracketSchema.nullable().optional(),
    currentEmploymentStatus: EmploymentStatusEnum.optional(),
    joiningStatus: JoiningStatusEnum.optional(),
    workMode: WorkModeEnum.optional(),
    address: AddressSchema.optional(),
    preferredCity: z.string().optional(),
    skillIds: z.array(ObjectIdSchema).optional(),
  })
  .strict({
    message: "provide only relevent data",
  });

export const EducationSchema = z.object(
  {
    educations: z.array(
      z
        .object({
          id: ObjectIdSchema.optional(),
          institute: InstituteSchema,
          duration: DateRangeSchema,
          course: z.string(),
          backLogPending: z.boolean().default(false),
          cgpa: z.string().optional(),
          percentage: z.string().optional(),
        })
        .refine((data) => (data.cgpa && data.percentage ? false : true), {
          message: "Only one of cgpa or percentage should be filled",
        }),
      {
        invalid_type_error: "Provide array of education object",
      }
    ),
  },
  {
    invalid_type_error: "Provide array of education object",
  }
);

export const ExperienceSchema = z.object(
  {
    experiences: z.array(
      z
        .object({
          id: z.string().length(24).optional(),
          organisation: OrganisationSchema,
          role: z.string(),
          duration: DateRangeSchema,
          description: z.string().optional(),
          skillIds: z.array(z.string().length(24)),
        })
        .strict(),
      {
        invalid_type_error: "Provide array of experience object",
      }
    ),
  },
  {
    invalid_type_error: "Provide array of experience object",
  }
);

export const ProjectSchema = z.object(
  {
    projects: z.array(
      z
        .object({
          id: z.string().length(24).optional(),
          name: z.string(),
          sourceCodeLink: z.string().url().optional(),
          liveLink: z.string().url().optional(),
          otherLinks: z.array(z.string().url()).optional(),
          skillIds: z.array(ObjectIdSchema),
          images: z.array(z.string().url()).optional(),
          videos: z.array(z.string().url()).optional(),
          description: z.string().optional(),
          duration: DateRangeSchema.optional(),
        })
        .strict(),
      {
        invalid_type_error: "Provide array of projects object",
      }
    ),
  },
  {
    invalid_type_error: "Provide array of projects object",
  }
);

export const TestimonialSchema = z.object(
  {
    testimonials: z.array(
      z
        .object({
          id: ObjectIdSchema.optional(),
          name: z.string(),
          image: z.string().url().optional(),
          quote: z.string(),
          socialLinks: z.array(z.string().url()).optional(),
          designation: z.string(),
        })
        .strict(),
      {
        invalid_type_error: "Provide array of projects object",
      }
    ),
  },
  {
    invalid_type_error: "Provide array of testimonials object",
  }
);

const TExperienceRequirementSchema = z.object({
  min: z.number().int(),
  max: z.number().int(),
});

const TSalaryBracketSchema = z.object({
  min: z.number().int(),
  max: z.number().int(),
});

export const JobSchema = z.object({
  job: z
    .object({
      designation: z.string().optional(),
      mode: WorkModeEnum.optional(),
      address: AddressSchema.optional(),
      experienceRequired: TExperienceRequirementSchema.optional(),
      fresherApplicable: z.boolean().optional(),
      salary: TSalaryBracketSchema.optional(),
      salaryNegotialble: z.boolean().default(false),
      description: z.string().optional(),
      skillIds: z.array(ObjectIdSchema).optional(), // Assuming skill IDs are strings
      noOfVacancies: z.number().int().default(1),
    })
    .strict(),
});

export const UpdateJobSchema = z.object({
  job: JobSchema.shape.job.partial(),
});

export const DeleteJobSchema = z.object({
  jobIds: z.array(ObjectIdSchema),
});

export const ObjectIDOnParam = (paramName: string) => {
  return z.object({
    [paramName]: ObjectIdSchema,
  });
};

export const ApplicationSchema = z.object({
  application: z.object({
    resumeLink: z.string().optional(),
    message: z.string(),
  }),
});

export const AcceptApplicationForInteriewSchema = z.object({
  applicationIds: z.array(ObjectIdSchema),
});
