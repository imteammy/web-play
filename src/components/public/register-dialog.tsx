"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { InputControl } from "../ui_control/input";
import { toast } from "sonner";

const formSchema = z
  .object({
    name: z.string().trim().min(2).max(255),
    email: z.string().trim().email(),
    password: z.string().trim().min(8).max(255),
    password_confirm: z.string().trim().min(8).max(255),
  })
  .refine((v) => v.password === v.password_confirm, {
    path: ["password_confirm"],
    message: "customValidation.confirmPassword_match",
  });

export function RegisterDialog() {
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      password_confirm: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Handle registration logic here
    console.log(values);
    setOpen(false);
    toast.success("Register Success");
    form.reset();
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(op) => {
        setOpen(op);
        form.reset();
      }}
    >
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" type="button" className="w-full">
          Register
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Register</DialogTitle>
          <DialogDescription>
            Create a new account to access our services.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <InputControl
              control={form.control}
              name="name"
              placeholder="Enter your name"
              label="Name"
            />
            <InputControl
              control={form.control}
              name="email"
              placeholder="Enter your email"
              label="Email"
              description="We'll never share your email."
            />
            <InputControl
              control={form.control}
              type="password"
              name="password"
              label="Password"
              placeholder="Create a password"
            />
            <InputControl
              control={form.control}
              type="password"
              name="password_confirm"
              label="Password Confirm"
              placeholder="Create a password confirm"
            />

            <DialogFooter>
              <Button type="submit">Register</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
