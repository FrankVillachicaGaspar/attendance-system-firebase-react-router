import type { FirebaseEmployee } from "@/common/types/firebase/FirebaseEmployee.type";
import { useForm } from "react-hook-form";
import {
  employeeFormSchema,
  type EmployeeFormType,
} from "../schema/employee-form.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { FirebaseJobPosition } from "@/common/types/firebase/FirebaseJobPosition";
import type { FirebaseDepartment } from "@/common/types/firebase/FirebaseDepartment.type";
import type { FirebaseRole } from "@/common/types/firebase/FirebaseRole.type";
import { DialogDescription } from "@radix-ui/react-dialog";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { parseISO } from "date-fns";
import _ from "lodash";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (employee: EmployeeFormType) => void;
  employee?: FirebaseEmployee;
  title: string;
  isSubmiting: boolean;
  jobPositions: FirebaseJobPosition[];
  departments: FirebaseDepartment[];
  roles: FirebaseRole[];
}
export default function EmployeeDialog({
  open,
  onOpenChange,
  onSave,
  employee,
  title,
  isSubmiting,
  jobPositions,
  departments,
  roles,
}: Props) {
  const initialValues = {
    department: employee?.department.uid ?? "",
    role: employee?.role.uid ?? "",
    job_position: employee?.job_position.uid ?? "",
    names: employee?.names ?? "",
    lastname: employee?.lastname ?? "",
    dni: employee?.dni ?? "",
    salary: employee?.salary ?? 0,
    phone_code: employee?.phone_code ?? "+51",
    phone_number: employee?.phone_number ?? "",
    birth_date: employee?.birth_date ?? "",
    hiring_date: employee?.hiring_date ?? "",
    email: employee?.email ?? "",
    is_active: employee?.is_active ?? true,
  };

  const form = useForm<EmployeeFormType>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: initialValues,
  });

  const onSubmit = (values: EmployeeFormType) => {
    onSave(values);
  };

  const [namesModified, setNamesModified] = useState(false);
  const [lastnameModified, setLastnameModified] = useState(false);

  useEffect(() => {
    form.reset(initialValues);
    setNamesModified(false);
    setLastnameModified(false);
  }, [employee]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <DialogDescription />
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 🔹 Datos personales */}
              <FormField
                control={form.control}
                name="names"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombres</FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="off"
                        placeholder="Nombres"
                        value={
                          !namesModified
                            ? field.value
                                .split(" ")
                                .map((name) => _.capitalize(name))
                                .join(" ")
                            : field.value
                        }
                        onChange={(e) => {
                          field.onChange(e.target.value);
                          setNamesModified(true);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Apellidos</FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="off"
                        placeholder="Apellidos"
                        value={
                          !lastnameModified
                            ? field.value
                                .split(" ")
                                .map((lastname) => _.capitalize(lastname))
                                .join(" ")
                            : field.value
                        }
                        onChange={(e) => {
                          field.onChange(e.target.value);
                          setLastnameModified(true);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dni"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>DNI</FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="off"
                        placeholder="DNI"
                        maxLength={8}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="birth_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de nacimiento</FormLabel>
                    <FormControl>
                      <DateTimePicker
                        displayFormat="dd-MM-yyyy"
                        date={field.value ? parseISO(field.value) : undefined}
                        setDate={(value) =>
                          field.onChange(value?.toISOString())
                        }
                        lessThanToday
                        hideTime
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-2">
                <FormField
                  control={form.control}
                  name="phone_code"
                  render={({ field }) => (
                    <FormItem className="w-1/3">
                      <FormLabel>Código</FormLabel>
                      <FormControl>
                        <Input
                          autoComplete="off"
                          placeholder="+51"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone_number"
                  render={({ field }) => (
                    <FormItem className="w-2/3">
                      <FormLabel>Número de teléfono</FormLabel>
                      <FormControl>
                        <Input
                          autoComplete="off"
                          placeholder="Número de teléfono"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo electrónico</FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="off"
                        type="text"
                        {...field}
                        placeholder="jhon.doe@example.com"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 🔸 Información laboral */}
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Departamento</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-full justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? departments.find(
                                  (department) => department.uid === field.value
                                )?.name
                              : "Seleccionar departamento"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="Buscar departamento..." />
                          <CommandList>
                            <CommandEmpty>
                              No se encontraron departamentos.
                            </CommandEmpty>
                            <CommandGroup>
                              <ScrollArea className="h-48">
                                {departments.map((department) => (
                                  <CommandItem
                                    value={department.name}
                                    key={department.uid}
                                    onSelect={() => {
                                      form.setValue(
                                        "department",
                                        department.uid,
                                        {
                                          shouldValidate: true,
                                        }
                                      );
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        department.uid === field.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    {department.name}
                                  </CommandItem>
                                ))}
                              </ScrollArea>
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="job_position"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Puesto de trabajo</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-full justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? jobPositions.find(
                                  (position) => position.uid === field.value
                                )?.name
                              : "Seleccionar puesto"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="Buscar puesto..." />
                          <CommandList>
                            <CommandEmpty>
                              No se encontraron puestos.
                            </CommandEmpty>
                            <CommandGroup>
                              <ScrollArea className="h-48">
                                {jobPositions.map((position) => (
                                  <CommandItem
                                    value={position.name}
                                    key={position.uid}
                                    onSelect={() => {
                                      form.setValue(
                                        "job_position",
                                        position.uid,
                                        {
                                          shouldValidate: true,
                                        }
                                      );
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        position.uid === field.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    {position.name}
                                  </CommandItem>
                                ))}
                              </ScrollArea>
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rol</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Seleccionar rol" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role.uid} value={role.uid}>
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="salary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Salario</FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="off"
                        type="number"
                        placeholder="Salario"
                        {...field}
                        onChange={(e) =>
                          field.onChange(Number.parseFloat(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hiring_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de contratación</FormLabel>
                    <FormControl>
                      <DateTimePicker
                        displayFormat="dd-MM-yyyy"
                        date={field.value ? parseISO(field.value) : undefined}
                        setDate={(value) =>
                          field.onChange(value?.toISOString())
                        }
                        hideTime
                        lessThanToday
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 🟢 Estado */}
              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado del empleado</FormLabel>
                    <Select
                      onValueChange={(value) =>
                        field.onChange(value === "true")
                      }
                      defaultValue={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Seleccionar estado" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="true">Activo</SelectItem>
                        <SelectItem value="false">Inactivo</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmiting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmiting}>
                {isSubmiting ? "Guardando..." : "Guardar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
