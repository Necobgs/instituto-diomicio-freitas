import React from "react";
import { IMaskInput } from "react-imask";

type MaskedInputProps = {
  mask: string | any[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  unmask?: boolean;
  required?: boolean;
  error?: string;
};

export default function MaskedInput({
  mask,
  value,
  onChange,
  placeholder,
  unmask = true,
  error,
}: MaskedInputProps) {
    return (
        <div className="flex flex-col gap-0.5">
            <IMaskInput
                mask={mask as any}
                unmask={unmask}
                value={!value ? "" : value}
                onAccept={(val: string) => onChange?.(val)}
                placeholder={placeholder}
                className={`file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive ${error ? "border-red-600" : ""}`}
            />
            {error && <p className="text-destructive text-sm mt-1">{error}</p>}
        </div>
    );
}
