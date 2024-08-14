"use client";

import { ExperienceForm } from "./ExperienceForm";
import { ProjectForm } from "./ProjectForm";
import { ProfileForm } from "./ProfleForm";
import { TestimonialForm } from "./TestimonialForm";
import { Skill } from "@prisma/client";
import { useContext, useState } from "react";
import { fetcher } from "@/lib/fetcher";
import { createContext } from "react";

interface RefetchContextType {
  refetchProfile: () => Promise<void>;
}

const RefetchCtx = createContext<RefetchContextType>({
  refetchProfile: async () => {
    await Promise.resolve();
  },
});

export const ProfileWrapper = ({
  skills,
  profile: profile_,
}: {
  skills: Pick<Skill, "id" | "name">[];
  profile: any;
}) => {
  const [profile, setProfile] = useState(profile_);
  const {
    projects = [],
    experiences = [],
    testimonials = [],
    ...rest
  } = profile;

  const refetchProfile = async () => {
    try {
      const p = await fetcher("/profiles");

      setProfile(p.profile);
    } catch (error) {}
  };

  return (
    <RefetchCtx.Provider value={{ refetchProfile }}>
      <ProfileForm skills={skills} profile={rest} />
      <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
        Projects
      </h3>
      {projects.map((project: any) => (
        <ProjectForm key={project.id} skills={skills} project={project} />
      ))}
      <ProjectForm
        key={projects.length}
        skills={skills}
        project={{ profileId: profile.id }}
      />
      <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
        Experiences
      </h3>
      {experiences.map((experience: any) => (
        <ExperienceForm
          key={experience.id}
          skills={skills}
          experience={experience}
        />
      ))}
      <ExperienceForm
        key={experiences.length}
        skills={skills}
        experience={{ profileId: profile.id }}
      />
      <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
        Testimonials
      </h3>
      {testimonials.map((testimonial: any) => (
        <TestimonialForm
          key={testimonial.id}
          skills={skills}
          testimonial={testimonial}
        />
      ))}
      <TestimonialForm
        key={testimonials.length}
        skills={skills}
        testimonial={{ profileId: profile.id }}
      />
    </RefetchCtx.Provider>
  );
};

export const useRefetchProfile = () => {
  const context = useContext(RefetchCtx);
  if (context === undefined) {
    throw new Error(
      "useRefetchProfile must be used within a RefetchCtx.Provider"
    );
  }
  return context;
};
