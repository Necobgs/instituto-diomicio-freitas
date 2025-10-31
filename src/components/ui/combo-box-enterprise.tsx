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
import { initEnterprises, selectEnterprises } from "@/store/features/enterpriseSlice";
import { useAppDispatch } from "@/store/hooks";
import { useSelector } from "react-redux";

interface EnterpriseComboboxProps {
  enterprise: iEnterprise | undefined;
  setEnterprise: (enterprise: iEnterprise | undefined) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  notFoundMessage?: string;
  width?: string;
  error?: string;
}

export function EnterpriseCombobox({
  enterprise,
  setEnterprise,
  placeholder = "Selecione a empresa...",
  searchPlaceholder = "Procurando empresas...",
  notFoundMessage = "Nenhuma empresa encontrada.",
  width = "200px",
  error = "",
}: EnterpriseComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const enterprises = useSelector(selectEnterprises);
  const dispatch = useAppDispatch();

  const handleSearch = (search: string) => {
    dispatch(initEnterprises({ page:1, limit:200, name: search, enabled:'true' }))
  };

  const handleSelect = (currentId: number) => {
    const selectedId = currentId == enterprise?.id ? "" : currentId;

    const selectedEnterprise = enterprises.find((enterprise) => enterprise.id == selectedId);
    setEnterprise(selectedEnterprise);
    setOpen(false);
    dispatch(initEnterprises({ page:1, limit:200, enabled:'true' }));
  };

  React.useEffect(() => {
      dispatch(initEnterprises({ page:1, limit:200, enabled:'true' }));
  }, [dispatch]);

  return (
    <div className="flex flex-col gap-0.5">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn("justify-between", `w-[${width}]`,!enterprise ? `text-black/50` : ``, error ? "border-red-600" : "")}
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
                {enterprises.map((e) => (
                  <CommandItem
                    key={e.id}
                    value={e.name} // Use label para evitar conflitos com a filtragem
                    onSelect={() => handleSelect(e.id)}
                  >
                    {e.name}
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        enterprise?.id == e.id ? "opacity-100" : "opacity-0"
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