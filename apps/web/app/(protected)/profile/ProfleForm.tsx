"use client";
import { DatePicker, MyInput, MyRadioGroup } from "@/components/MyForm";
import { Button } from "@/components/ui/button";
import { Form, FormLabel } from "@/components/ui/form";
import { generateEnumLabelList } from "@/lib/generateEnumLabelList";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  EmploymentStatus_Enum,
  Gender_Enum,
  JOINING_STATUS_Enum,
  Skill,
  WORK_MODE_Enum,
} from "@repo/db";
import { ProfileSchema, TProfileSchema } from "@repo/utils";
import { useForm } from "react-hook-form";

import { useToast } from "@/components/ui/use-toast";
import { fetcher } from "@/lib/fetcher";
import { MultipleSelector } from "./MulltiSelect";

export const ProfileForm = ({
  skills,
  profile,
}: {
  skills: Pick<Skill, "id" | "name">[];
  profile: Partial<TProfileSchema>;
}) => {
  // @ts-ignore
  const { id: _id, ...rest } = profile;

  const profileForm = useForm<TProfileSchema>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      skillIds: [],
      address: {
        city: "",
        state: "",
        country: "",
      },
      socialLinks: rest.socialLinks, // Use rest.socialLinks here
      preferredLocation: {
        city: "",
        state: "",
        country: "",
      },
    },
    values: rest,
  });

  const { toast } = useToast();
  const handleSubmit = async (profile: TProfileSchema) => {
    try {
      await fetcher("/profiles/main", "post", profile);
      toast({
        title: "Profile Updated!",
      });
    } catch {
      toast({
        title: "Provide valid data!",
      });
    }
  };

  return (
    <Form {...profileForm}>
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
        Prepare your profile
      </h3>
      <form
        className="w-full max-w-2xl mx-auto px-4 pb-10"
        onSubmit={profileForm.handleSubmit(handleSubmit)}
      >
        <MyInput
          control={profileForm.control}
          name="intro"
          label="Introduction"
          placeholder="Hi! My self is John Doe!"
          type="textarea"
        />
        <div className="flex gap-6 justify-between items-center mt-4">
          <FormLabel>Date Of Birth</FormLabel>
          <DatePicker
            date={profileForm.getValues().dateOfBirth ?? new Date()}
            setDate={(date) => {
              profileForm.setValue("dateOfBirth", date);
            }}
          />
        </div>
        <FormLabel>Skills</FormLabel>
        <MultipleSelector
          error={profileForm.formState.errors.skillIds?.message}
          data={skills}
          itemShape={{
            idKey: "id",
            labelKey: "name",
          }}
          selectedItems={profileForm.getValues().skillIds || []}
          handleSetValue={(selectedId: string) => {
            const selectedItems = profileForm.getValues().skillIds || [];

            const isSelected = selectedItems.some(
              (id: string) => id === selectedId,
            );

            if (isSelected) {
              profileForm.setValue(
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

              profileForm.setValue("skillIds", updatedSkillIds, {
                shouldValidate: true,
                shouldDirty: true,
                shouldTouch: true,
              });
            }
          }}
        />
        <div className="mt-2">
          <MyInput
            control={profileForm.control}
            name="resumeLink"
            label="Resume Link"
            placeholder="https://gogle.drive.com/resume.pdf"
            type="link"
          />
        </div>
        <div className="mt-2">
          <MyInput
            control={profileForm.control}
            name="videoResume"
            label="Video Resume"
            placeholder="https://youtube.com/watch?id=73e3dbu732"
            type="link"
          />
        </div>
        <div className="mt-2">
          <MyInput
            control={profileForm.control}
            name="currentCTC"
            label="Current CTC (USD)"
            placeholder="100,000"
            type="number"
          />
        </div>
        <p className="mt-4">Expected CTC</p>
        <div className="flex gap-4 justify-between mt-2">
          <MyInput
            control={profileForm.control}
            name="expectedCTC.min"
            label="Min"
            placeholder="100,000"
            type="number"
          />
          <MyInput
            control={profileForm.control}
            name="expectedCTC.max"
            label="Max"
            placeholder="100,000"
            type="number"
          />
        </div>
        <p className="mt-4"> Address</p>
        <div className="flex gap-4">
          <MyInput
            control={profileForm.control}
            name="address.city"
            placeholder="City"
            type="text"
          />
          <MyInput
            control={profileForm.control}
            name="address.state"
            placeholder="State"
            type="text"
          />
          <MyInput
            control={profileForm.control}
            name="address.country"
            placeholder="Country"
            type="text"
          />
        </div>
        <p className="mt-4">Preferred Location</p>
        <div className="flex gap-4">
          <MyInput
            control={profileForm.control}
            name="preferredLocation.city"
            placeholder="City"
            type="text"
          />
          <MyInput
            control={profileForm.control}
            name="preferredLocation.state"
            placeholder="State"
            type="text"
          />
          <MyInput
            control={profileForm.control}
            name="preferredLocation.country"
            placeholder="Country"
            type="text"
          />
        </div>
        <MyRadioGroup
          control={profileForm.control}
          name="gender"
          data={generateEnumLabelList(Gender_Enum)}
          label="Select Gender"
          type="select"
          checkedValue={profileForm.getValues().gender!}
        />
        <MyRadioGroup
          control={profileForm.control}
          name="currentEmploymentStatus"
          data={generateEnumLabelList(EmploymentStatus_Enum)}
          label="Current Employment Status"
          type="select"
          checkedValue={profileForm.getValues().currentEmploymentStatus!}
        />
        <MyRadioGroup
          control={profileForm.control}
          name="joiningStatus"
          data={generateEnumLabelList(JOINING_STATUS_Enum)}
          label="Joining Status"
          type="select"
          checkedValue={profileForm.getValues().joiningStatus!}
        />
        <MyRadioGroup
          control={profileForm.control}
          name="workMode"
          data={generateEnumLabelList(WORK_MODE_Enum)}
          label="Work Mode"
          type="select"
          checkedValue={profileForm.getValues().workMode!}
        />
        <Button
          className="mt-4 mr-0 "
          type="submit"
          disabled={profileForm.formState.isSubmitting}
        >
          Submit
        </Button>
      </form>
    </Form>
  );
};
