"use client";
import { TestimonialSchema, TTestimonialSchema } from "@repo/utils";
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

export const TestimonialForm = ({
  skills,
  testimonial,
}: {
  skills: Pick<Skill, "id" | "name">[];
  testimonial: Partial<TTestimonialSchema>;
}) => {
  const { refetchProfile } = useRefetchProfile();

  const { id: _id, ...rest } = testimonial;

  const [id, setId] = useState(_id);

  // Ensure socialLinks always has at least one entry

  const testimonialForm = useForm<TTestimonialSchema>({
    resolver: zodResolver(TestimonialSchema),
    defaultValues: {
      socialLinks: [],
    },
    // @ts-ignore
    values: rest,
  });

  const { toast } = useToast();
  const handleSubmit = async (profile: TTestimonialSchema) => {
    try {
      let url = "/profiles/testimonials";
      if (id) url += `/${id}`;

      const method = id ? "put" : "post";
      const data = await fetcher(url, method, profile);

      toast({
        title: id ? "Testimonial Updated!" : "Testimonial Added!",
      });

      if (data.testimonial.id && data.testimonial.id)
        setId(data.testimonial.id);
      await refetchProfile();
    } catch {
      toast({
        title: "Provide valid data!",
      });
    }
  };
  const [isLoading, setIsLoading] = useState(false);

  const deleteTestimonial = async () => {
    if (!id) return;
    try {
      setIsLoading(true);

      await fetcher(`/profiles/testimonials/${id}`, "delete");
      await refetchProfile();
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const disabled = isLoading || testimonialForm.formState.isSubmitting;

  // const { refetchProfile } = useRefetchProfile();
  // console.log("refetchProfile: ", refetchProfile);
  return (
    <Form {...testimonialForm}>
      {/* <Button
        onClick={async () => {
          await refetchProfile();
        }}
      >
        refer
      </Button> */}
      <form
        className="w-full max-w-2xl mx-auto px-4 pb-10 shadow-lg rounded-lg"
        onSubmit={testimonialForm.handleSubmit(handleSubmit)}
      >
        <MyInput
          control={testimonialForm.control}
          name="name"
          label="Name"
          placeholder="John Doe"
          type="text"
        />
        <MyInput
          control={testimonialForm.control}
          name="quote"
          label="Quote"
          placeholder="Google Search Engine - Blah Blah!"
          type="textarea"
        />
        <MyInput
          control={testimonialForm.control}
          name="designation"
          label="Designation"
          placeholder="Sr. Product Manager"
          type="text"
        />{" "}
        <Button className="mt-4 mr-4 " type="submit" disabled={disabled}>
          {id ? "Edit" : "Save"}
        </Button>
        {id && (
          <Button
            onClick={deleteTestimonial}
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
