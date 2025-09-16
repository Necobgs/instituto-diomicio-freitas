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

// 🔹 Dados mocados (temporários)
const students: iStudent[] = [
  { id: 1, name: "Marcos", phone: "(48) 12345-6789", date_of_birth: new Date(1990, 11, 17), cpf: "123", created_at: new Date(), updated_at: new Date(), },
  { id: 2, name: "Paulo", phone: "(48) 12345-6789", date_of_birth: new Date(2006, 6, 20), cpf: "456", created_at: new Date(), updated_at: new Date(), },
  { id: 3, name: "Maria", phone: "(11) 91234-5678", date_of_birth: new Date(2001, 2, 10), cpf: "789", created_at: new Date(), updated_at: new Date(), },
];

interface ComboboxItem {
  value: string;
  label: string;
}

interface StudentComboboxProps {
  student: iStudent | undefined;
  setStudent: (student: iStudent | undefined) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  notFoundMessage?: string;
  width?: string;
}

export function StudentCombobox({
  student,
  setStudent,
  placeholder = "Selecione o aluno...",
  searchPlaceholder = "Nome do aluno...",
  notFoundMessage = "Nenhum aluno encontrado.",
  width = "200px",
}: StudentComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [filteredStudents, setFilteredStudents] = React.useState<iStudent[]>(students);

  const handleSearch = (search: string) => {
    if (!search) {
      setFilteredStudents(students);
      return;
    }
    const filtered = students.filter((student) =>
      student.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredStudents(filtered);
  };

  const handleSelect = (currentValue: number) => {
    const selectedId = currentValue === student?.id ? "" : currentValue;
  
    const selectedStudent = students.find((student) => student.id.toString() == selectedId);
    setStudent(selectedStudent);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("justify-between", `w-[${width}]`,!student ? `text-black/50` : ``)}
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
              {filteredStudents.map((filteredStudent) => (
                <CommandItem
                  key={filteredStudent.id}
                  value={filteredStudent.name} // Use label para evitar conflitos com a filtragem
                  onSelect={() => handleSelect(filteredStudent.id)}
                >
                  {filteredStudent.name}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      student?.id == filteredStudent.id ? "opacity-100" : "opacity-0"
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