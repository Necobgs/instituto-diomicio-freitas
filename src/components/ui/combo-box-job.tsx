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
import { iJobForm } from "@/types/job";
import { useSelector } from "react-redux";
import { initJobs, selectJobs } from "@/store/features/jobSlice";
import { useAppDispatch } from "@/store/hooks";

interface JobComboboxProps {
  job: iJobForm | undefined;
  setJob: (job: iJobForm | undefined) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  notFoundMessage?: string;
  width?: string;
  error?: string;
}

export function JobCombobox({
  job,
  setJob,
  placeholder = "Selecione o cargo...",
  searchPlaceholder = "Nome do cargo...",
  notFoundMessage = "Nenhum cargo encontrado.",
  width = "200px",
  error = "",
}: JobComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const jobs = useSelector(selectJobs);
  const dispatch = useAppDispatch();

  const handleSearch = (search: string) => {
    dispatch(initJobs({ page:1, limit:200, name:search, enabled:'true' }));
  };

  const handleSelect = (currentValue: number) => {
    const selectedId = currentValue === job?.id ? "" : currentValue;
  
    const selectedJob = jobs.find((job) => job?.id?.toString() == selectedId);
    setJob(selectedJob);
    setOpen(false);
    dispatch(initJobs({ page:1, limit:200, enabled:'true' }));
  };

  React.useEffect(() => {
      dispatch(initJobs({ page:1, limit:200, enabled:'true' }));
  }, [dispatch]);

  return (
    <div className="flex flex-col gap-0.5">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn("justify-between", `w-[${width}]`,!job ? `text-black/50` : ``, error ? "border-red-600" : "")}
          >
            {job?.name ?? placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className={cn(`w-[${width}] p-0`)}>
          <Command shouldFilter={false}>
            <CommandInput
              placeholder={searchPlaceholder}
              className="h-9"
              onValueChange={handleSearch}
            />
            <CommandList>
              <CommandEmpty>{notFoundMessage}</CommandEmpty>
              <CommandGroup>
                {jobs.map((s) => (
                  <CommandItem
                    key={s.id}
                    value={s.name} // Use label para evitar conflitos com a filtragem
                    onSelect={() => handleSelect(s?.id ? s.id : 0)}
                  >
                    {s.name}
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        job?.id == s.id ? "opacity-100" : "opacity-0"
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