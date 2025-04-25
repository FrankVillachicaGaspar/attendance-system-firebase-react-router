import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import {
  AttendanceFormTypeSchema,
  type AttendanceFormType,
} from "../schema/attendance.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import type { FirebaseAttendance } from "@/common/types/firebase/FirebaseAttendance";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { Textarea } from "@/components/ui/textarea";
import type { FirebaseObservationType } from "@/common/types/firebase/FirebaseObservationType";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFetcher } from "react-router";
import type { Route } from ".react-router/types/app/routes/admin/sections/+types/attendance";
import executeToastList from "@/common/utils/execute-toast-list.util";
import { AttendanceIntent } from "../enums/attendance-intents.enum";
import { es } from "date-fns/locale";
import { parse } from "date-fns";
import PulseLoader from "react-spinners/PulseLoader";
import { RefreshCcw } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  attendance?: FirebaseAttendance;
  observationTypes: FirebaseObservationType[];
}

export default function AttendanceDialog({
  open,
  onOpenChange,
  attendance,
  observationTypes,
}: Props) {
  const fetcher = useFetcher();
  const fetcherData = fetcher.data as Route.ComponentProps["actionData"];

  const initialData: AttendanceFormType = {
    first_check_in_time: attendance?.first_check_in_time ?? null,
    first_check_out_time: attendance?.first_check_out_time ?? null,
    second_check_in_time: attendance?.second_check_in_time ?? null,
    second_check_out_time: attendance?.second_check_out_time ?? null,
    observation_type: attendance?.observation_type?.uid ?? "",
    observation: attendance?.observation ?? null,
  };
  const form = useForm<AttendanceFormType>({
    resolver: zodResolver(AttendanceFormTypeSchema),
    defaultValues: initialData,
  });

  const onSubmit = async (data: AttendanceFormType) => {
    await fetcher.submit(
      {
        intent: AttendanceIntent.UPDATE_ATTENDANCE,
        uid: attendance?.uid ?? "",
        first_check_in_time: data.first_check_in_time ?? "",
        first_check_out_time: data.first_check_out_time ?? "",
        second_check_in_time: data.second_check_in_time ?? "",
        second_check_out_time: data.second_check_out_time ?? "",
        observation_type: data.observation_type ?? "",
        observation: data.observation ?? "",
      },
      { method: "post" }
    );
    onOpenChange(false);
  };

  const handleGetDateFromSearchParams = () => {
    const searchParams = new URLSearchParams(location.search);
    const date = searchParams.get("date");
    if (date) {
      return parse(date, "yyyy-MM-dd", new Date());
    }
    return undefined;
  };

  useEffect(() => {
    form.reset(initialData);
  }, [attendance]);

  useEffect(() => {
    if (fetcherData) {
      executeToastList(fetcherData.toastList);
    }
  }, [fetcherData]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-2xl">
        <DialogTitle>Asistencia</DialogTitle>
        <DialogDescription>
          Complete the form to register attendance data.
        </DialogDescription>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 md:space-y-6"
          >
            {/* First Check-In Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="grid grid-cols-[1fr_auto] items-end gap-1 w-full">
                <div>
                  <FormField
                    name="first_check_in_time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="first_check_in_time">
                          Primera entrada
                        </FormLabel>
                        <FormControl>
                          <DateTimePicker
                            displayFormat="dd 'de' MMMM 'del' yyyy 'a las' HH:mm"
                            locale={es}
                            placeholder="Seleccione la fecha y hora"
                            date={
                              handleGetDateFromSearchParams()
                                ? handleGetDateFromSearchParams()
                                : field.value
                                ? new Date(field.value)
                                : undefined
                            }
                            setDate={(e: Date | undefined) =>
                              field.onChange(e?.toISOString() ?? "")
                            }
                            hideDate
                            lessThanToday
                            className="text-start"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button
                  type="button"
                  onClick={() => {
                    form.setValue("first_check_in_time", null);
                  }}
                  variant="outline"
                  size="icon"
                >
                  <RefreshCcw />
                </Button>
              </div>

              {/* First Check-Out Time */}
              <div className="grid grid-cols-[1fr_auto] items-end gap-1 w-full">
                <div>
                  <FormField
                    name="first_check_out_time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="first_check_out_time">
                          Primera salida
                        </FormLabel>
                        <FormControl>
                          <DateTimePicker
                            displayFormat="dd 'de' MMMM 'del' yyyy 'a las' HH:mm"
                            locale={es}
                            placeholder="Seleccione la fecha y hora"
                            date={field.value ? new Date(field.value) : undefined}
                            setDate={(e: Date | undefined) =>
                              field.onChange(e?.toISOString() ?? "")
                            }
                            hideDate
                            lessThanToday
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button
                  type="button"
                  onClick={() => {
                    form.setValue("first_check_out_time", null);
                  }}
                  variant="outline"
                  size="icon"
                >
                  <RefreshCcw />
                </Button>
              </div>

              {/* Second Check-In Time */}
              <div className="grid grid-cols-[1fr_auto] items-end gap-1 w-full">
                <div>
                  <FormField
                    name="second_check_in_time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="second_check_in_time">
                          Segunda entrada
                        </FormLabel>
                        <FormControl>
                          <DateTimePicker
                            locale={es}
                            displayFormat="dd 'de' MMMM 'del' yyyy 'a las' HH:mm"
                            placeholder="Seleccione la fecha y hora"
                            date={field.value ? new Date(field.value) : undefined}
                            setDate={(e: Date | undefined) =>
                              field.onChange(e?.toISOString() ?? "")
                            }
                            hideDate
                            lessThanToday
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button
                  type="button"
                  onClick={() => {
                    form.setValue("second_check_in_time", null);
                  }}
                  variant="outline"
                  size="icon"
                >
                  <RefreshCcw />
                </Button>
              </div>

              {/* Second Check-Out Time */}
              <div className="grid grid-cols-[1fr_auto] items-end gap-1 w-full">
                <div>
                  <FormField
                    name="second_check_out_time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="second_check_out_time">
                          Segunda salida
                        </FormLabel>
                        <FormControl>
                          <DateTimePicker
                            displayFormat="dd 'de' MMMM 'del' yyyy 'a las' HH:mm"
                            locale={es}
                            placeholder="Seleccione la fecha y hora"
                            date={field.value ? new Date(field.value) : undefined}
                            setDate={(e: Date | undefined) =>
                              field.onChange(e?.toISOString() ?? "")
                            }
                            hideDate
                            lessThanToday
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button
                  type="button"
                  onClick={() => {
                    form.setValue("second_check_out_time", null);
                  }}
                  variant="outline"
                  size="icon"
                >
                  <RefreshCcw />
                </Button>
              </div>

              {/* Observation Type */}
              <FormField
                name="observation_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="observation_type">
                      Tipo de observación
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => {
                          if (value === "null") {
                            form.setValue("observation", "");
                            field.onChange("");
                          } else {
                            field.onChange(value);
                          }
                        }}
                        defaultValue={field.value === "" ? "null" : field.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Seleccione un tipo de observación" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="null">Sin observación</SelectItem>
                          {observationTypes.map((type) => (
                            <SelectItem key={type.uid} value={type.uid}>
                              {type.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="md:col-span-2">
                {/* Observation */}
                <FormField
                  name="observation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="observation">Observación</FormLabel>
                      <FormControl>
                        <Textarea
                          className="w-full"
                          id="observation"
                          placeholder="Ingrese la observación"
                          value={field.value || ""}
                          onChange={field.onChange}
                          disabled={form.watch("observation_type") === ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={fetcher.state !== "idle"}>
                {fetcher.state !== "idle" ? (
                  <PulseLoader size={10} color="#fff" />
                ) : (
                  "Guardar"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
