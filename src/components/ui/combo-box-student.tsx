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
import { iStudent } from "@/types/student";
import { useSelector } from "react-redux";
import { initStudents, selectStudents } from "@/store/features/studentSlice";
import { useAppDispatch } from "@/store/hooks";

interface StudentComboboxProps {
  student: iStudent | undefined;
  setStudent: (student: iStudent | undefined) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  notFoundMessage?: string;
  width?: string;
  error?: string;
}

export function StudentCombobox({
  student,
  setStudent,
  placeholder = "Selecione o estudante...",
  searchPlaceholder = "Nome do estudante...",
  notFoundMessage = "Nenhum estudante encontrado.",
  width = "200px",
  error = "",
}: StudentComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const students = useSelector(selectStudents);
  const dispatch = useAppDispatch();

  const handleSearch = (search: string) => {
    dispatch(initStudents({ page:1, limit:200, name:search, enabled:'true' }));
  };

  const handleSelect = (currentValue: number) => {
    const selectedId = currentValue === student?.id ? "" : currentValue;
  
    const selectedStudent = students.find((student) => student.id.toString() == selectedId);
    setStudent(selectedStudent);
    setOpen(false);
    dispatch(initStudents({ page:1, limit:200, enabled:'true' }));
  };

  React.useEffect(() => {
      dispatch(initStudents({ page:1, limit:200, enabled:'true' }));
  }, [dispatch]);

  return (
    <div className="flex flex-col gap-0.5">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn("justify-between", `w-[${width}]`,!student ? `text-black/50` : ``, error ? "border-red-600" : "")}
          >
            {student?.name ?? placeholder}
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
                {students.map((s) => (
                  <CommandItem
                    key={s.id}
                    value={s.name} // Use label para evitar conflitos com a filtragem
                    onSelect={() => handleSelect(s.id)}
                  >
                    {s.name}
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        student?.id == s.id ? "opacity-100" : "opacity-0"
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