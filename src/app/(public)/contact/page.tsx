"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { InputControl } from "@/components/ui_control/input";
import { TextAreaControl } from "@/components/ui_control/text-area";

const formSchema = z.object({
  name: z.string().trim().min(2).max(255),
  email: z.string().trim().email(),
  subject: z.string().trim().min(5).max(255),
  message: z.string().trim().min(1).max(255),
});

export default function ContactPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Handle form submission logic here
    console.log(values);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-center">
        <h1 className="text-3xl font-bold mb-6">Contact Me</h1>
      </div>
      <div className="flex justify-center">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 max-w-md w-full"
          >
            <InputControl
              name="name"
              control={form.control}
              label="Name"
              placeholder="Your name"
              minLength={2}
              maxLength={255}
            />
            <InputControl
              name="email"
              control={form.control}
              label="Email"
              type="email"
              placeholder="Your email"
              description="We'll never share your email with anyone else."
              maxLength={255}
            />
            <InputControl
              name="subject"
              control={form.control}
              label="Subject"
              placeholder="Message subject"
              maxLength={255}
            />
            <TextAreaControl
              name="message"
              control={form.control}
              label="Message"
              className="min-h-[100px]"
              placeholder="Your message"
              minLength={1}
              maxLength={255}
            />

            <Button type="submit">Send Message</Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
