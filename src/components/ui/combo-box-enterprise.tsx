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


const enterprises: iEnterprise[] = [
        {
            id: 1,
            name:'Empresa 1',
            phone: "(48) 12345-6789",
            cnpj: '123', 
            created_at: new Date(), 
            updated_at: new Date(),
        },
        {
            id: 2,
            name:'Empresa 2',
            phone: "(48) 12345-6789",
            cnpj: '123', 
            created_at: new Date(), 
            updated_at: new Date(),
        },
    ];

interface ComboboxItem {
  value: string;
  label: string;
}

interface EnterpriseComboboxProps {
  enterprise: iEnterprise | undefined;
  setEnterprise: (enterprise: iEnterprise | undefined) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  notFoundMessage?: string;
  width?: string;
}

export function EnterpriseCombobox({
  enterprise,
  setEnterprise,
  placeholder = "Selecione o aluno...",
  searchPlaceholder = "Procurando alunos...",
  notFoundMessage = "Nenhum aluno encontrado.",
  width = "200px",
}: EnterpriseComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [filteredEnterprises, setFilteredEnterprises] = React.useState<iEnterprise[]>(enterprises);



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

  const handleSelect = (currentId: number) => {
    const selectedId = currentId == enterprise?.id ? "" : currentId;

    const selectedEnterprise = enterprises.find((enterprise) => enterprise.id == selectedId);
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
          className={cn("justify-between", `w-[${width}]`,!enterprise ? `text-black/50` : ``)}
        >
          {enterprise?.name ?? placeholder}
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
              {filteredEnterprises.map((filteredEnterprise) => (
                <CommandItem
                  key={filteredEnterprise.id}
                  value={filteredEnterprise.name} // Use label para evitar conflitos com a filtragem
                  onSelect={() => handleSelect(filteredEnterprise.id)}
                >
                  {filteredEnterprise.name}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      enterprise?.id == filteredEnterprise.id ? "opacity-100" : "opacity-0"
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