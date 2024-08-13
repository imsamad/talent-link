"use client";

import { Control, FieldValues, Path } from "react-hook-form";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { HTMLInputTypeAttribute } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { SelectSingleEventHandler } from "react-day-picker";

import { Textarea } from "@/components/ui/textarea";

type TMyInput<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  descriptor?: string;
  type: HTMLInputTypeAttribute;
};

export const MyInput = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder = "",
  descriptor,
  type,
}: TMyInput<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }: any) => (
        <FormItem className="w-full">
          {label ? <FormLabel>{label}</FormLabel> : null}
          <FormControl>
            {type == "textarea" ? (
              <Textarea
                placeholder={placeholder}
                {...field}
                value={field.value ?? ""}
              />
            ) : (
              <Input type={type} placeholder={placeholder} {...field} />
            )}
          </FormControl>

          {descriptor ? <FormDescription>{descriptor}</FormDescription> : null}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

type TMyRadio<T extends FieldValues> = TMyInput<T> & {
  data: { id: string; label: string }[];
  type?: "select";
  checkedValue: string;
};

export const MyRadioGroup = <T extends FieldValues>({
  control,
  name,
  data,
  label,
  checkedValue,
}: TMyRadio<T>) => {
  console.log("data: ", data);
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }: any) => (
        <FormItem className="space-y-3 mt-4">
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="flex gap-x-6 flex-wrap	"
            >
              {data.map((d) => (
                <FormItem
                  key={d.id}
                  className="flex items-center space-x-3 space-y-0"
                >
                  <FormControl>
                    <RadioGroupItem
                      value={d.id}
                      checked={d.id == checkedValue}
                    />
                  </FormControl>
                  <FormLabel className="font-normal">{d.label}</FormLabel>
                </FormItem>
              ))}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export const DatePicker = ({
  date,
  setDate,
}: {
  date: Date;
  setDate: SelectSingleEventHandler;
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !date && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};
