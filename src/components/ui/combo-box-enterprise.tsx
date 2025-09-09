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
import { iEnterprise } from "@/types/enterprise";


const enterprises = [
        {
            id: 1,
            name:'Empresa 1',
            phone: "(48) 12345-6789",
            cnpj: '123',
        },
        {
            id: 2,
            name:'Empresa 2',
            phone: "(48) 12345-6789",
            cnpj: '123'
        },
    ];

interface ComboboxItem {
  value: string;
  label: string;
}

interface EnterpriseComboboxProps {
  value: string | undefined;
  setValue: (value: string | undefined) => void;
  setEnterprise: (enterprise: iEnterprise | undefined) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  notFoundMessage?: string;
  width?: string;
}

export function EnterpriseCombobox({
  value,
  setValue,
  setEnterprise,
  placeholder = "Selecione o aluno...",
  searchPlaceholder = "Procurando alunos...",
  notFoundMessage = "Nenhum aluno encontrado.",
  width = "200px",
}: EnterpriseComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [filteredEnterprises, setFilteredEnterprises] = React.useState<iEnterprise[]>(enterprises);
  const [items, setItems] = React.useState<ComboboxItem[]>(enterprises.map((enterprise) => ({
    value: enterprise.id.toString(),
    label: enterprise.name,
  })));

  // Sincroniza items com filteredEnterprises
  React.useEffect(() => {
    setItems(
      filteredEnterprises.map((enterprise) => ({
        value: enterprise.id.toString(),
        label: enterprise.name,
      }))
    );
  }, [filteredEnterprises]);

  const handleSearch = (search: string) => {
    if (!search) {
      setFilteredEnterprises(enterprises);
      return;
    }
    const filtered = enterprises.filter((enterprise) =>
      enterprise.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredEnterprises(filtered);
  };

  const handleSelect = (currentValue: string) => {
    const selectedId = currentValue === value ? "" : currentValue;
    setValue(selectedId);

    const selectedEnterprise = enterprises.find((s) => s.id.toString() === selectedId);
    setEnterprise(selectedEnterprise);

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