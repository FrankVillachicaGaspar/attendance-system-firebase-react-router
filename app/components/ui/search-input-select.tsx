import * as React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
  CommandGroup,
} from "@/components/ui/command";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FormControl } from "@/components/ui/form";
import { cn } from "@/lib/utils";

interface SelectOption {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  options: SelectOption[]; // List of options, each with a `value` and `label`
  value?: string; // Controlled value
  defaultValue?: string; // Initial value for uncontrolled components
  onChange?: (value: string) => void; // Function to handle value change
  placeholder?: string; // Optional placeholder for button
  label?: string; // Optional label to display above the select
}

export function SearchableSelect({
  options,
  value,
  defaultValue,
  onChange,
  placeholder = "Seleccionar...",
  label,
}: SearchableSelectProps) {
  const [open, setOpen] = React.useState(false);
  // Use controlled value if provided, otherwise use defaultValue
  const [selectedValue, setSelectedValue] = React.useState<string>(
    defaultValue || ""
  );

  const handleSelect = (newValue: string) => {
    if (onChange) {
      onChange(newValue); // Call onChange if it's provided (for controlled usage)
    } else {
      setSelectedValue(newValue); // Otherwise update the local state (for uncontrolled usage)
    }
    setOpen(false);
  };

  const finalValue = value ?? selectedValue; // Use controlled or uncontrolled value depending on the props

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={cn(
            "w-full justify-between",
            !finalValue && "text-muted-foreground"
          )}
        >
          {finalValue
            ? options.find((option) => option.value === finalValue)?.label
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder={`Buscar ${label || "opción"}...`} />
          <CommandList>
            <CommandEmpty>No se encontraron opciones.</CommandEmpty>
            <CommandGroup>
              <ScrollArea className="h-48">
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.label}
                    onSelect={() => handleSelect(option.value)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        option.value === finalValue
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </ScrollArea>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
