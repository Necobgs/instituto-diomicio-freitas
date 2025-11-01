'use client';

import * as React from "react"

import { cn } from "@/lib/utils"
import { Eye, EyeOff, Info } from "lucide-react"

function Input({ className, type, error, ...props }: React.ComponentProps<"input"> & { error?: string }) {

  const [visiblePassword, setVisiblePassword] = React.useState(false); 

  return (
    <div className="flex flex-col gap-0.5 w-full">
      <div className="flex flex-row gap-2 items-center relative">
        <input
          type={type === "password" ? `${visiblePassword ? "text" : "password"}`: type}
          data-slot="input"
          className={cn(
            `file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
            "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive ${error ? "border-red-600" : ""} ${type === "password" || (type === "date" && props.placeholder) ? "pr-10" : ""}`,
            className
          )}
          {...props}
        />
        {type === "date" && props.placeholder ? <div className="absolute right-2" title={props.placeholder}><Info size={18}/></div> : ""}
        {type === "password" ? <div className="absolute right-2" onClick={() => setVisiblePassword(!visiblePassword)}>{ visiblePassword ? <EyeOff size={20}/> : <Eye size={20}/>}</div> : ""}
      </div>
      {error && <p className="text-destructive text-sm mt-1">{error}</p>}
    </div>
  )
}

export { Input }
