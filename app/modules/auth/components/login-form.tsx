import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { LoginFormValues } from "../schemas/login.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../schemas/login.schema";
import { useSubmit } from "react-router";
import { Form, FormField, FormLabel, FormMessage } from "@/components/ui/form";
import DotsLoader from "@/common/components/loaders/dots-loader";
import { CircleAlertIcon } from "lucide-react";
import SyncLoader from "react-spinners/SyncLoader";

export function LoginForm() {
  const submit = useSubmit();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginFormValues) {
    await submit(values, { method: "POST" });
  }

  return (
    <div className={cn("flex flex-col gap-6 min-w-md")}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="text-white">
          <div className="grid gap-6">
            <div className="grid gap-6">
              <div className="grid gap-7">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <div className="grid gap-2">
                      <FormLabel
                        className="text-lg !text-white"
                        htmlFor="email"
                      >
                        Correo
                      </FormLabel>
                      <Input
                        className="placeholder:text-white/70 focus:!ring-0 rounded-sm focus:!border-white"
                        autoComplete="off"
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        {...field}
                      />
                      {form.formState.errors.email && (
                        <div className="bg-white/90 py-1 px-2 flex gap-2 items-center rounded-md">
                          <CircleAlertIcon className="size-4 text-red-500" />
                          <FormMessage />
                        </div>
                      )}
                    </div>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <div className="grid gap-2">
                      <FormLabel
                        className="text-lg !text-white"
                        htmlFor="password"
                      >
                        Contraseña
                      </FormLabel>
                      <Input
                        className="placeholder:text-white/70 focus:!ring-0 rounded-sm focus:!border-white"
                        id="password"
                        type="password"
                        placeholder="••••••••••••••••"
                        {...field}
                      />
                      {form.formState.errors.password && (
                        <div className="bg-white/90 py-1 px-2 flex gap-2 items-center rounded-md">
                          <CircleAlertIcon className="size-4 text-red-500" />
                          <FormMessage />
                        </div>
                      )}
                    </div>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full bg-white hover:bg-white/90 text-black py-5 font-bold text-md rounded-sm mt-4"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? (
                    <SyncLoader color="#000" size={10} />
                  ) : (
                    "Iniciar sesión"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
