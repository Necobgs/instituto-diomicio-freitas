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

const options = [
    {
        value:"1",
        label: "Sim"
    },
    {
        value:"2",
        label: "Não"
    },
    {
        value:"3",
        label: "Maioria das vezes"
    },
    {
        value:"4",
        label: "Raras vezes"
    },
]

// Define the shape of each item in the list
interface ComboboxItem {
  value: string;
  label: string;
}

// Define the props for the Combobox component
interface ComboboxProps {
  id_item: number;
  value: string | undefined; // Selected value
  setValue: (id_item: number, value: string) => void; // Function to update selected value
  placeholder?: string; // Optional placeholder for the button
  searchPlaceholder?: string; // Optional placeholder for the search input
  notFoundMessage?: string; // Optional message for no results
  width?: string; // Optional width for the button and popover
  error?: string; // Optional error message
}

export function QuestionCombobox({
  id_item,
  value,
  setValue,
  placeholder = "Secione a opção...",
  searchPlaceholder = "Buscar opção...",
  notFoundMessage = "Opção não encontrada.",
  width = "200px",
  error = "",
}: ComboboxProps) {

  const [open, setOpen] = React.useState(false);
  const [items, setItems] = React.useState(options);

  const handleSearch = (search: string) => {
    setItems(() => {
      let newItems: ComboboxItem[] = options;

      if (search) {
        newItems = options.filter((vobj) =>
          vobj.label.toLowerCase().includes(search.toLowerCase())
        );
      }

      return newItems;
    });
  };

  const handleSelect = (currentValue: string) => {
    setValue(id_item,currentValue);
    setOpen(false)
  };

  return (
    <div className="flex flex-col gap-0.5">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn("justify-between", `w-[${width}]`, error ? "border-red-600" : "")}
          >
            {value  
              ? items.find((item) => item.value === value)?.label
              : placeholder
            }
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className={cn(`w-[${width}] p-0`)}>
          <Command>
            <CommandInput
              placeholder={searchPlaceholder}
              className="h-9"
              onValueChange={handleSearch} // Call search handler on input change
            />
            <CommandList>
              <CommandEmpty>{notFoundMessage}</CommandEmpty>
              <CommandGroup>
                {items.map((item) => (
                  <CommandItem
                    key={item.value}
                    value={item.label}
                    onSelect={() => handleSelect(item.value)}>
                    {item.label}
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        value === item.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {error && <p className="text-destructive text-sm mt-1">{error}</p>}
    </div>
  );
}