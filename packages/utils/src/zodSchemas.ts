import {
  ApplicationStatus_Enum,
  EmploymentStatus_Enum,
  Gender_Enum,
  JOINING_STATUS_Enum,
  Prisma,
  WORK_MODE_Enum,
} from "@repo/db";
import { z } from "zod";

// Enum definitions

export const GenderEnum = z.nativeEnum(Gender_Enum);
export const EmploymentStatusEnum = z.nativeEnum(EmploymentStatus_Enum);
export const JoiningStatusEnum = z.nativeEnum(JOINING_STATUS_Enum);
export const WorkModeEnum = z.nativeEnum(WORK_MODE_Enum);
export const ApplicationStatusEnum = z.nativeEnum(ApplicationStatus_Enum);

export const AddressSchema = z.object({
  city: z.string().nullable(),
  state: z.string().nullable(),
  country: z.string().nullable(),
  // pincode: z.string().optional().nullable(),
  // longitude: z.string().optional().nullable(),
  // latitude: z.string().optional().nullable(),
}) satisfies z.Schema<Prisma.AddressCreateInput>;

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
  min: z.coerce.number(),
  max: z.coerce.number(),
});

export const LoginSchema = z.object({
  email: z
    .string({
      required_error: "email is required",
      invalid_type_error: "invalid data type",
    })
    .email(),
  password: z
    .string({
      required_error: "Password is required",
      invalid_type_error: "invalid data type",
    })
    .min(1, { message: "Password is required" }),
});

export const SignUpSchema = LoginSchema.pick({ email: true }).merge(
  z.object({
    password: z
      .string({
        required_error: "email is required",
        invalid_type_error: "invalid data type",
      })
      .min(8, { message: "Password must be at least 8 characters long" })
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        {
          message:
            "Password must include an uppercase letter, a lowercase letter, a digit, and a special character",
        },
      ),
  }),
);

export type TLoginSchema = z.infer<typeof LoginSchema>;
export type TSignupSchema = z.infer<typeof SignUpSchema>;

export const OTPSchema = z.object({
  otp: z.string({
    required_error: "otp is required",
    invalid_type_error: "invalid data type",
  }),
});

export type TOtpSchema = z.infer<typeof OTPSchema>;

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const ObjectIdSchema = z
  .string()
  .refine((value) => objectIdRegex.test(value), {
    message: "Invalid ObjectID format",
  });

export const ProfileSchema = z
  .object({
    intro: z.string().optional().nullable(),
    socialLinks: z.array(z.string().url()).optional(),
    videoResume: z.string().url().optional().nullable(),
    resumeLink: z.string().url().optional().nullable(),
    gender: GenderEnum.optional().nullable(),
    currentCTC: z.coerce.number().optional().nullable(),
    expectedCTC: SalaryBracketSchema.nullable().optional().nullable(),
    address: AddressSchema.optional().nullable(),
    preferredLocation: AddressSchema.optional().nullable(),
    currentEmploymentStatus: EmploymentStatusEnum.optional().nullable(),
    joiningStatus: JoiningStatusEnum.optional().nullable(),
    workMode: WorkModeEnum.optional().nullable(),
    dateOfBirth: z.coerce.date().optional().nullable(),

    skillIds: z.array(ObjectIdSchema).optional(),
  })
  .strict({
    message: "provide only relevent data",
  }) satisfies z.Schema<Prisma.ProfileUncheckedCreateInput>;

export type TProfileSchema = z.infer<typeof ProfileSchema>;

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
      },
    ),
  },
  {
    invalid_type_error: "Provide array of education object",
  },
);

export const ExperienceSchema = z
  .object({
    organisation: OrganisationSchema,
    role: z.string(),
    duration: DateRangeSchema.optional().nullable(),
    description: z.string(),
    skillIds: z.array(z.string().length(24)),
    profileId: ObjectIdSchema,
  })
  .strict() satisfies z.Schema<Prisma.ExperienceUncheckedCreateInput>;

export type TExperienceSchema = z.infer<typeof ExperienceSchema>;

export const ProjectSchema = z
  .object({
    id: z.string().length(24).optional(),
    name: z.string(),
    sourceCodeLink: z.string().url().optional().nullable(),
    liveLink: z.string().url().optional().nullable(),
    otherLinks: z.array(z.string().url()).optional(),
    skillIds: z.array(ObjectIdSchema),
    images: z.array(z.string().url()).optional(),
    videos: z.array(z.string().url()).optional(),
    description: z.string().optional().nullable(),
    duration: DateRangeSchema.optional().nullable(),
    profileId: ObjectIdSchema,
  })
  .strict() satisfies z.Schema<Prisma.ProjectUncheckedCreateInput>;

export type TProjectSchema = z.infer<typeof ProjectSchema>;

export const TestimonialSchema = z
  .object({
    id: ObjectIdSchema.optional(),
    name: z.string(),
    image: z.string().url().optional().nullable(),
    quote: z.string(),
    socialLinks: z.array(z.string().url()).optional(),
    designation: z.string(),
    profileId: ObjectIdSchema,
  })
  .strict() satisfies z.Schema<Prisma.TestimonialUncheckedCreateInput>;

export type TTestimonialSchema = z.infer<typeof TestimonialSchema>;

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
