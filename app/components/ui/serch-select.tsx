import * as React from "react";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "./scroll-area";

export type SearchSelectOption = {
  value: string;
  label: string;
  icon?: string;
  disabled?: boolean;
};

interface SearchSelectProps {
  options: SearchSelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  allowCustomValues?: boolean;
  className?: string;
  maxHeight?: number;
  renderOption?: (option: SearchSelectOption) => React.ReactNode;
}

export function SearchSelect({
  options,
  value,
  onChange,
  placeholder = "Seleccionar...",
  emptyMessage = "No se encontraron resultados",
  disabled = false,
  allowCustomValues = true,
  className,
  maxHeight = 300,
  renderOption,
}: SearchSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const [scrollHeight, setScrollHeight] = React.useState(0);
  const itemHeight = 40;
  const maxVisibleItems = 10;

  // Encontrar la opción seleccionada
  const selectedOption = React.useMemo(() => {
    return options.find((option) => option.value === value);
  }, [options, value]);

  // Filtrar opciones basadas en el valor de entrada
  const filteredOptions = React.useMemo(() => {
    if (!inputValue) return options;

    return options.filter((option) =>
      option.label.toLowerCase().includes(inputValue.toLowerCase())
    );
  }, [options, inputValue]);

  // Verificar si el valor de entrada coincide exactamente con alguna opción existente
  const exactMatch = React.useMemo(() => {
    return options.some(
      (option) => option.label.toLowerCase() === inputValue.toLowerCase()
    );
  }, [options, inputValue]);

  // Manejar la selección de una opción
  const handleSelect = React.useCallback(
    (currentValue: string) => {
      onChange(currentValue);
      setOpen(false);
    },
    [onChange]
  );

  // Manejar la creación de un valor personalizado
  const handleCreateCustomValue = React.useCallback(() => {
    if (!inputValue.trim()) return;

    onChange(inputValue.trim());
    setOpen(false);
    setInputValue("");
  }, [inputValue, onChange]);

  // Renderizar una opción
  const renderOptionItem = React.useCallback(
    (option: SearchSelectOption) => {
      if (renderOption) {
        return renderOption(option);
      }

      return (
        <>
          {option.icon && (
            <div className="mr-2 h-5 w-5 relative">
              <img
                src={option.icon || "/placeholder.svg"}
                alt={option.label}
                className="object-contain"
              />
            </div>
          )}
          <span>{option.label}</span>
        </>
      );
    },
    [renderOption]
  );

  React.useEffect(() => {
    const calculatedHeight =
      Math.min(filteredOptions.length, maxVisibleItems) * itemHeight;
    setScrollHeight(calculatedHeight);
  }, [filteredOptions]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
          disabled={disabled}
        >
          <div className="flex items-center gap-2 truncate">
            {selectedOption ? (
              <>
                {selectedOption.icon && (
                  <div className="h-5 w-5 relative">
                    <img
                      src={selectedOption.icon || "/placeholder.svg"}
                      alt={selectedOption.label}
                      className="object-contain"
                    />
                  </div>
                )}
                <span className="truncate">{selectedOption.label}</span>
              </>
            ) : (
              // Si no hay selección, mostramos el valor personalizado si existe
              <span className="text-muted-foreground">
                {value && !selectedOption ? value : placeholder}
              </span>
            )}
          </div>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-full min-w-[var(--radix-popover-trigger-width)]">
        <Command>
          <CommandInput
            placeholder="Buscar..."
            value={inputValue}
            onValueChange={setInputValue}
          />
          <CommandList className={`max-h-[${maxHeight}px] overflow-auto`}>
            <CommandEmpty>
              {emptyMessage}
              {allowCustomValues && inputValue && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 w-full"
                  onClick={handleCreateCustomValue}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar "{inputValue}"
                </Button>
              )}
            </CommandEmpty>
            <ScrollArea
              className="max-h-56"
              style={{ height: `${scrollHeight}px` }}
            >
              <ScrollBar orientation="vertical" />
              <CommandGroup className="overflow-hidden">
                {filteredOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={() => handleSelect(option.value)}
                    disabled={option.disabled}
                  >
                    <div className="flex items-center">
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === option.value ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {renderOptionItem(option)}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </ScrollArea>
            {allowCustomValues && inputValue && !exactMatch && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={handleCreateCustomValue}
                    className="justify-center text-center"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Agregar "{inputValue}"
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
