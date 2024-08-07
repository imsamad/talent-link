"use client";
import React from "react";
import { useForm, Controller } from "react-hook-form";

type ResumeProfileFormData = {
  intro?: string;
  socialLinks?: string[];
  resumeLinks?: string[];
  gender: "Male" | "Female" | "Other";
  dateOfBirth?: Date;
  currentCTC?: number;
  expectedCTC?: string;
  currentEmploymentStatus: "Employed" | "Unemployed" | "Freelancer";
  currentJobStatus: string;
  joiningStatus: "Immediate" | "Negotiable" | "Later";
  workMode: "Onsite" | "Remote" | "Hybrid";
  address?: string;
  preferredCity: string;
  videoResume?: string;
};

const ResumeProfileForm: React.FC = () => {
  const { control, handleSubmit, register } = useForm<ResumeProfileFormData>();

  const onSubmit = (data: ResumeProfileFormData) => {
    console.log(data);
  };

  return (
    <form
      className="space-y-6 p-6 max-w-3xl mx-auto"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div>
        <label
          htmlFor="intro"
          className="block text-sm font-medium text-gray-700"
        >
          Introduction
        </label>
        <Controller
          name="intro"
          control={control}
          render={({ field }) => (
            <textarea
              id="intro"
              {...field}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          )}
        />
      </div>

      <div>
        <label
          htmlFor="socialLinks"
          className="block text-sm font-medium text-gray-700"
        >
          Social Links
        </label>
        <Controller
          name="socialLinks"
          control={control}
          render={({ field }) => (
            <input
              id="socialLinks"
              {...field}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          )}
        />
      </div>

      <div>
        <label
          htmlFor="resumeLinks"
          className="block text-sm font-medium text-gray-700"
        >
          Resume Links
        </label>
        <Controller
          name="resumeLinks"
          control={control}
          render={({ field }) => (
            <input
              id="resumeLinks"
              {...field}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          )}
        />
      </div>

      <div>
        <span className="block text-sm font-medium text-gray-700">Gender</span>
        <div className="flex gap-4 mt-2">
          {["Male", "Female", "Other"].map((option) => (
            <label key={option} className="flex items-center">
              <input
                type="radio"
                value={option}
                {...register("gender")}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
              />
              <span className="ml-2 text-gray-700">{option}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label
          htmlFor="dateOfBirth"
          className="block text-sm font-medium text-gray-700"
        >
          Date of Birth
        </label>
        <Controller
          name="dateOfBirth"
          control={control}
          render={({ field }) => (
            <input
              type="date"
              id="dateOfBirth"
              {...field}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          )}
        />
      </div>

      <div>
        <label
          htmlFor="currentCTC"
          className="block text-sm font-medium text-gray-700"
        >
          Current CTC
        </label>
        <Controller
          name="currentCTC"
          control={control}
          render={({ field }) => (
            <input
              type="number"
              id="currentCTC"
              {...field}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          )}
        />
      </div>

      <div>
        <label
          htmlFor="expectedCTC"
          className="block text-sm font-medium text-gray-700"
        >
          Expected CTC
        </label>
        <Controller
          name="expectedCTC"
          control={control}
          render={({ field }) => (
            <input
              id="expectedCTC"
              {...field}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          )}
        />
      </div>

      <div>
        <span className="block text-sm font-medium text-gray-700">
          Current Employment Status
        </span>
        <div className="flex gap-4 mt-2">
          {["Employed", "Unemployed", "Freelancer"].map((status) => (
            <label key={status} className="flex items-center">
              <input
                type="radio"
                value={status}
                {...register("currentEmploymentStatus")}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
              />
              <span className="ml-2 text-gray-700">{status}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label
          htmlFor="currentJobStatus"
          className="block text-sm font-medium text-gray-700"
        >
          Current Job Status
        </label>
        <Controller
          name="currentJobStatus"
          control={control}
          render={({ field }) => (
            <input
              id="currentJobStatus"
              {...field}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          )}
        />
      </div>

      <div>
        <span className="block text-sm font-medium text-gray-700">
          Joining Status
        </span>
        <div className="flex gap-4 mt-2">
          {["Immediate", "Negotiable", "Later"].map((status) => (
            <label key={status} className="flex items-center">
              <input
                type="radio"
                value={status}
                {...register("joiningStatus")}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
              />
              <span className="ml-2 text-gray-700">{status}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <span className="block text-sm font-medium text-gray-700">
          Work Mode
        </span>
        <div className="flex gap-4 mt-2">
          {["Onsite", "Remote", "Hybrid"].map((mode) => (
            <label key={mode} className="flex items-center">
              <input
                type="radio"
                value={mode}
                {...register("workMode")}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
              />
              <span className="ml-2 text-gray-700">{mode}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label
          htmlFor="address"
          className="block text-sm font-medium text-gray-700"
        >
          Address
        </label>
        <Controller
          name="address"
          control={control}
          render={({ field }) => (
            <input
              id="address"
              {...field}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          )}
        />
      </div>

      <div>
        <label
          htmlFor="preferredCity"
          className="block text-sm font-medium text-gray-700"
        >
          Preferred City
        </label>
        <Controller
          name="preferredCity"
          control={control}
          render={({ field }) => (
            <input
              id="preferredCity"
              {...field}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          )}
        />
      </div>

      <div>
        <label
          htmlFor="videoResume"
          className="block text-sm font-medium text-gray-700"
        >
          Video Resume
        </label>
        <Controller
          name="videoResume"
          control={control}
          render={({ field }) => (
            <input
              type="url"
              id="videoResume"
              {...field}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          )}
        />
      </div>

      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Submit
      </button>
    </form>
  );
};

export default ResumeProfileForm;
