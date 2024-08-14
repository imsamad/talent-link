"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface MultipleSelectorProps<T> {
  data: T[];
  itemShape: {
    idKey: keyof T;
    labelKey: keyof T;
  };
  handleSetValue: (id: string) => void;
  selectedItems: string[];
  error: string | undefined;
}

export function MultipleSelector<T>({
  data,
  itemShape,
  handleSetValue,
  selectedItems,
  error,
}: MultipleSelectorProps<T>) {
  const [open, setOpen] = React.useState(false);
  //   const [value, setValue] = React.useState<T[]>([]);

  const idKey = itemShape.idKey;
  const labelKey = itemShape.labelKey;

  return (
    <div className="">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[480px] h-full justify-between"
          >
            <div className="flex gap-2 justify-start flex-wrap ">
              {selectedItems.length > 0
                ? selectedItems.map((id) => (
                    <div
                      key={id}
                      className="px-2 py-1 rounded-xl border bg-slate-200 text-xs font-medium"
                    >
                      {(data.find((d) => d[idKey] === id)?.[
                        labelKey
                      ]! as string) ?? "Unknown"}
                    </div>
                  ))
                : "Select framework..."}
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[480px] p-0">
          <Command>
            <CommandInput placeholder="Search framework..." />
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              <CommandList>
                {data.map((item) => (
                  <CommandItem
                    key={item[idKey]! as string}
                    value={item[labelKey]! as string}
                    onSelect={() => handleSetValue(item[idKey]! as string)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedItems.some((id) => item[idKey] === id)
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {item[labelKey]! as string}
                  </CommandItem>
                ))}
              </CommandList>
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      {error && (
        <p className="text-sm font-medium text-red-500 dark:text-red-830">
          {error}
        </p>
      )}
    </div>
  );
}
