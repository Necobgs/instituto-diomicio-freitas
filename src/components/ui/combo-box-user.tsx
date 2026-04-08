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
import { iUserForm } from "@/types/user";
import { useSelector } from "react-redux";
import { initUsers, selectUsers } from "@/store/features/userSlice";
import { useAppDispatch } from "@/store/hooks";

interface UserComboboxProps {
  user: iUserForm | undefined;
  setUser: (user: iUserForm | undefined) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  notFoundMessage?: string;
  width?: string;
  error?: string;
}

export function UserCombobox({
  user,
  setUser,
  placeholder = "Selecione o usuário...",
  searchPlaceholder = "Nome do usuário...",
  notFoundMessage = "Nenhum usuário encontrado.",
  width = "200px",
  error = "",
}: UserComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const users = useSelector(selectUsers);
  const dispatch = useAppDispatch();

  const handleSearch = (search: string) => {
    dispatch(initUsers({ page:1, limit:200, username:search, enabled:'true' }));
  };

  const handleSelect = (currentValue: number) => {
    const selectedId = currentValue === user?.id ? "" : currentValue;
  
    const selectedUser = users.find((user) => user.id.toString() == selectedId);
    setUser(selectedUser);
    setOpen(false);
    dispatch(initUsers({ page:1, limit:200, enabled:'true' }));
  };

  React.useEffect(() => {
      dispatch(initUsers({ page:1, limit:200, enabled:'true' }));
  }, [dispatch]);

  return (
    <div className="flex flex-col gap-0.5">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn("justify-between", `w-[${width}]`,!user ? `text-black/50` : ``, error ? "border-red-600" : "")}
          >
            {user?.username ?? placeholder}
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
                {users.map((s) => (
                  <CommandItem
                    key={s.id}
                    value={s.username} // Use label para evitar conflitos com a filtragem
                    onSelect={() => handleSelect(s?.id ? s.id : 0)}
                  >
                    {s.username}
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        user?.id == s.id ? "opacity-100" : "opacity-0"
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