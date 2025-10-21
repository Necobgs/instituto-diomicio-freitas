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

// Define the shape of each item in the list
interface ComboboxItem {
  value: string;
  label: string;
}

// Define the props for the Combobox component
interface ComboboxProps {
  items: ComboboxItem[]; // List of items to display
  value: string; // Selected value
  setValue: (value: string) => void; // Function to update selected value
  placeholder?: string; // Optional placeholder for the button
  searchPlaceholder?: string; // Optional placeholder for the search input
  notFoundMessage?: string; // Optional message for no results
  width?: string; // Optional width for the button and popover
}

export function Combobox({
  items,
  value,
  setValue,
  placeholder = "Select item...",
  searchPlaceholder = "Search items...",
  notFoundMessage = "No item found.",
  width = "200px",
}: ComboboxProps) {

  const [open, setOpen] = React.useState(false);
  const [filteredItems, setFilteredItems] = React.useState(items);
  
  const handleSearch = (search: string) => {
    setFilteredItems(() => {
      let newItems: ComboboxItem[] = items;

      if (search) {
        newItems = items.filter((vobj) =>
          vobj.label.toLowerCase().includes(search.toLowerCase())
        );
      }

      console.log(newItems)

      return newItems;
    });
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("justify-between", `w-[${width}]`)}
        >
          {value
            ? items.find((item) => item.value === value)?.label
            : placeholder}
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
              {filteredItems.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.label}
                  onSelect={(currentValue) => {
                    setValue(item.value); // Toggle selection
                    setOpen(false); // Close popover on select
                  }}
                >
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
  );
}