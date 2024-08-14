"use client";
import { ProjectSchema, TProjectSchema } from "@repo/utils";
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

export const ProjectForm = ({
  skills,
  project,
}: {
  skills: Pick<Skill, "id" | "name">[];
  project: Partial<TProjectSchema>;
}) => {
  const { refetchProfile } = useRefetchProfile();
  const { id: _id, ...rest } = project;

  const [id, setId] = useState(_id);

  const projectForm = useForm<TProjectSchema>({
    resolver: zodResolver(ProjectSchema),
    defaultValues: {
      skillIds: [],
      images: [],
      videos: [],
    },
    // @ts-ignore
    values: rest,
  });

  const { toast } = useToast();
  const handleSubmit = async (profile: TProjectSchema) => {
    try {
      let url = "/profiles/projects";
      if (id) url += `/${id}`;

      const method = id ? "put" : "post";
      const data = await fetcher(url, method, profile);

      toast({
        title: id ? "Project Updated!" : "Project Added!",
      });
      await refetchProfile();
      if (data.project.id && data.project.id) setId(data.project.id);
    } catch {
      toast({
        title: "Provide valid data!",
      });
    }
  };

  const [isLoading, setIsLoading] = useState(false);

  const deleteProject = async () => {
    if (!id) return;
    try {
      setIsLoading(true);

      await fetcher(`/profiles/projects/${id}`, "delete");
      await refetchProfile();
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const disabled = isLoading || projectForm.formState.isSubmitting;

  return (
    <Form {...projectForm}>
      <form
        className="w-full max-w-2xl mx-auto px-4 pb-10 shadow-lg rounded-lg"
        onSubmit={projectForm.handleSubmit(handleSubmit, (e) => {
          console.log("e:", e);
        })}
      >
        <MyInput
          control={projectForm.control}
          name="name"
          label="Title"
          placeholder="Google Search Engine"
          type="text"
        />
        <MyInput
          control={projectForm.control}
          name="description"
          label="Description"
          placeholder="Google Search Engine - Blah Blah!"
          type="textarea"
        />
        <MyInput
          control={projectForm.control}
          name="sourceCodeLink"
          label="Source Code Link"
          placeholder="https://github.com/code100x/job-board/"
          type="url"
        />{" "}
        <MyInput
          control={projectForm.control}
          name="liveLink"
          label="Source Code Link"
          placeholder="https://github.com/code100x/job-board/"
          type="url"
        />
        <FormLabel>Skills</FormLabel>
        <MultipleSelector
          error={projectForm.formState.errors.skillIds?.message}
          data={skills}
          itemShape={{
            idKey: "id",
            labelKey: "name",
          }}
          selectedItems={projectForm.getValues().skillIds || []}
          handleSetValue={(selectedId: string) => {
            const selectedItems = projectForm.getValues().skillIds || [];

            const isSelected = selectedItems.some(
              (id: string) => id === selectedId,
            );

            if (isSelected) {
              projectForm.setValue(
                "skillIds",
                selectedItems.filter((id: string) => id !== selectedId),
                {
                  shouldValidate: true,
                  shouldDirty: true,
                  shouldTouch: true,
                },
              );
            } else {
              const updatedSkillIds = [...selectedItems, selectedId];

              projectForm.setValue("skillIds", updatedSkillIds, {
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
            onClick={deleteProject}
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
