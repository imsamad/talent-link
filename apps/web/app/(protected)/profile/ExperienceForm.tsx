"use client";
import { ExperienceSchema, TExperienceSchema } from "@repo/utils";
import { useForm } from "react-hook-form";

import { MyInput } from "@/components/MyForm";
import { Button } from "@/components/ui/button";
import { Form, FormLabel } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Skill } from "@repo/db";

import { useToast } from "@/components/ui/use-toast";
import { fetcher } from "@/lib/fetcher";
import { useState } from "react";
import { MultipleSelector } from "./MulltiSelect";
import { useRefetchProfile } from "./ProfileWrapper";

export const ExperienceForm = ({
  skills,
  experience,
}: {
  skills: Pick<Skill, "id" | "name">[];
  experience: Partial<TExperienceSchema>;
}) => {
  const { refetchProfile } = useRefetchProfile();
  const [isLoading, setIsLoading] = useState(false);
  // @ts-ignore
  const { id: _id, ...rest } = experience;

  const [id, setId] = useState(_id);

  // Ensure socialLinks always has at least one entry

  const experienceForm = useForm<TExperienceSchema>({
    resolver: zodResolver(ExperienceSchema),
    defaultValues: {
      skillIds: [],
    },
    // @ts-ignore
    values: rest,
  });

  const { toast } = useToast();
  const handleSubmit = async (experience: TExperienceSchema) => {
    try {
      let url = "/profiles/experiences";
      if (id) url += `/${id}`;

      const method = id ? "put" : "post";
      const data = await fetcher(url, method, experience);
      await refetchProfile();
      toast({
        title: id ? "Experience Updated!" : "Experience Added!",
      });

      if (data.experience.id && data.experience.id) setId(data.experience.id);
      await refetchProfile();
    } catch {
      toast({
        title: "Provide valid data!",
      });
    }
  };
  const deleteExperience = async () => {
    if (!id) return;
    try {
      setIsLoading(true);

      await fetcher(`/profiles/experiences/${id}`, "delete");
      await refetchProfile();
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const disabled = isLoading || experienceForm.formState.isSubmitting;

  return (
    <Form {...experienceForm}>
      <form
        className="w-full max-w-2xl mx-auto px-4 pb-10 shadow-lg rounded-lg"
        onSubmit={experienceForm.handleSubmit(handleSubmit, (d) => {
          console.log("d", d);
        })}
      >
        <MyInput
          control={experienceForm.control}
          name="organisation.name"
          label="Organisation Name"
          placeholder="Google Search Engine"
          type="text"
        />
        <MyInput
          control={experienceForm.control}
          name="organisation.url"
          label="Organisation Link"
          placeholder="https://google.com"
          type="url"
        />
        <MyInput
          control={experienceForm.control}
          name="role"
          label="Role"
          placeholder="Full Stack Developer"
          type="text"
        />
        <MyInput
          control={experienceForm.control}
          name="description"
          label="Description"
          placeholder="Write about your impact"
          type="textarea"
        />
        <FormLabel>Skills</FormLabel>
        <MultipleSelector
          data={skills}
          error={experienceForm.formState.errors.skillIds?.message}
          itemShape={{
            idKey: "id",
            labelKey: "name",
          }}
          selectedItems={experienceForm.getValues().skillIds || []}
          handleSetValue={(selectedId: string) => {
            const selectedItems = experienceForm.getValues().skillIds || [];

            const isSelected = selectedItems.some(
              (id: string) => id === selectedId
            );

            if (isSelected) {
              experienceForm.setValue(
                "skillIds",
                selectedItems.filter((id: string) => id !== selectedId),
                {
                  shouldValidate: true,
                  shouldDirty: true,
                  shouldTouch: true,
                }
              );
            } else {
              const updatedSkillIds = [...selectedItems, selectedId];

              experienceForm.setValue("skillIds", updatedSkillIds, {
                shouldValidate: true,
                shouldDirty: true,
                shouldTouch: true,
              });
            }
          }}
        />
        <Button className="mt-4 mr-4 " type="submit" disabled={disabled}>
          {id ? "Edit" : "Save"}
        </Button>
        {id && (
          <Button
            onClick={deleteExperience}
            className="mt-4 mr-0 "
            variant="destructive"
            disabled={disabled}
          >
            Delete
          </Button>
        )}{" "}
      </form>
    </Form>
  );
};
