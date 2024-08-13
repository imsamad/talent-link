"use client";
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const ProfilePage = () => {
  return (
    <div className="w-full max-w-2xl log mx-auto px-4">
      <Textarea />
      <MyFormField />
    </div>
  );
};

export default ProfilePage;

const MyFormField = ({ control, name, label }: any) => {
  return (
    <FormField
      // control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-64">
          <FormLabel className="text-sm font-semibold text-gray-800">
            {label}
          </FormLabel>
          <FormControl>
            <Input
              {...field}
              className="border-gray-400"
              placeholder="Enter your email here"
            />
          </FormControl>
          <FormMessage className="text-sm" />
        </FormItem>
      )}
    />
  );
};
