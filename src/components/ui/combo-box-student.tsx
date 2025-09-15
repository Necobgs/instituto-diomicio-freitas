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
  { id: 1, name: "Marcos", phone: "(48) 12345-6789", date_of_birth: new Date(1990, 11, 17), cpf: "123" },
  { id: 2, name: "Paulo", phone: "(48) 12345-6789", date_of_birth: new Date(2006, 6, 20), cpf: "456" },
  { id: 3, name: "Maria", phone: "(11) 91234-5678", date_of_birth: new Date(2001, 2, 10), cpf: "789" },
];

interface ComboboxItem {
  value: string;
  label: string;
}

interface StudentComboboxProps {
  value: string | undefined;
  setValue: (value: string | undefined) => void;
  setStudent: (student: iStudent | undefined) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  notFoundMessage?: string;
  width?: string;
}

export function StudentCombobox({
  value,
  setValue,
  setStudent,
  placeholder = "Selecione o aluno...",
  searchPlaceholder = "Procurando alunos...",
  notFoundMessage = "Nenhum aluno encontrado.",
  width = "200px",
}: StudentComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [filteredStudents, setFilteredStudents] = React.useState<iStudent[]>(students);
  const [items, setItems] = React.useState<ComboboxItem[]>(students.map((student) => ({
    value: student.id.toString(),
    label: student.name,
  })));

  // Sincroniza items com filteredStudents
  React.useEffect(() => {
    setItems(
      filteredStudents.map((student) => ({
        value: student.id.toString(),
        label: student.name,
      }))
    );
  }, [filteredStudents]);

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

  const handleSelect = (currentValue: string) => {
    const selectedId = currentValue === value ? "" : currentValue;
  

    const selectedStudent = students.find((s) => s.id.toString() === selectedId);
    setStudent(selectedStudent);
    setValue(selectedStudent?.name);

    setOpen(false);
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
          {value ?? placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn(`w-[${width}] p-0`)}>
        <Command shouldFilter={false}> {/* Desativa a filtragem interna do Command */}
          <CommandInput
            placeholder={searchPlaceholder}
            className="h-9"
            onValueChange={handleSearch}
          />
          <CommandList>
            <CommandEmpty>{notFoundMessage}</CommandEmpty>
            <CommandGroup>
              {items.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.label} // Use label para evitar conflitos com a filtragem
                  onSelect={() => handleSelect(item.value)}
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