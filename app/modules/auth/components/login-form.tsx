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
    <div className={cn("flex flex-col gap-6")}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Bienvenido!</CardTitle>
          <CardDescription>
            Inicia sesión con tu correo y contraseño
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid gap-6">
                <div className="grid gap-6">
                  <div className="grid gap-2">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <div className="grid gap-2">
                          <FormLabel htmlFor="email">Correo</FormLabel>
                          <Input
                            autoComplete="off"
                            id="email"
                            type="email"
                            placeholder="m@example.com"
                            {...field}
                          />
                          <FormMessage />
                        </div>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <div className="grid gap-2">
                          <FormLabel htmlFor="password">Contraseña</FormLabel>
                          <Input id="password" type="password" {...field} />
                          <FormMessage />
                        </div>
                      )}
                    />
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={form.formState.isSubmitting}
                    >
                      {form.formState.isSubmitting ? (
                        <DotsLoader />
                      ) : (
                        "Iniciar sesión"
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
