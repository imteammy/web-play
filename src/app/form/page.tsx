"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import React, { useEffect, useRef } from "react";
import {
  Controller,
  FormProvider,
  useForm,
  useFormContext,
  useWatch,
} from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormError } from "@/components/form-error";
import { useContrys } from "@/hooks/use-contrys";
import { DataTable } from "@/components/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { districts, provinces } from "@/hooks/data";
import { sub_districts } from "@/hooks/sub_districts";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const paymentSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("credit"),
    cardNumber: z.string().min(16).max(16),
    cvv: z.string().min(3).max(3),
  }),
  z.object({
    type: z.literal("paypal"),
    paypal_email: z.string().email(),
  }),
]);

const addressSchema = z.object({
  province: z.string().nonempty().min(1),
  district: z.string().nonempty().min(1),
  subdistrict: z.string().nonempty().min(1),
  zipcode: z.string().nonempty().min(5).max(5),
});
type AddressData = z.infer<typeof addressSchema>;
type AddressDataEmpty = z.infer<typeof emptyAddressSchema>;

const emptyAddressSchema = z.object({
  province: z.literal(""),
  district: z.literal(""),
  subdistrict: z.literal(""),
  zipcode: z.literal(""),
});

const schema = z
  .object({
    first_name: z
      .string({
        message: "invalid_string.email",
        invalid_type_error: "invalid_type.email",
      })
      .nonempty(),
    last_name: z.string().trim().nonempty(),
    email: z.string().trim().email(),
    country: z.string().trim().nonempty(),
    address: addressSchema.or(emptyAddressSchema).array(),
  })
  .and(paymentSchema);

const resolver = zodResolver(schema);

type FormValues = z.infer<typeof schema>;

function RenderCountry() {
  const { data: contries } = useContrys();
  const methods = useFormContext<FormValues>();
  return (
    <div className="w-full">
      <Label htmlFor="country">Country</Label>
      <select
        className="h-9 rounded-md p-2 border w-full"
        id="country"
        {...methods.register("country")}
      >
        <option value="">ระบุประเทศ</option>
        {contries?.map((country, index) => (
          <option key={`${country.name}${index}`} value={country.name}>
            {country.name}
          </option>
        ))}
      </select>
      <FormError name="country" />
    </div>
  );
}

function RenderPayment() {
  const methods = useFormContext<FormValues>();
  const type = useWatch({
    control: methods.control,
    name: "type",
    defaultValue: methods.getValues("type"),
  });
  return (
    <>
      <div>
        <Label htmlFor="type">Payment Type</Label>
        <select
          className="h-9 rounded-md p-2 border w-full"
          {...methods.register("type")}
        >
          <option value="credit">Credit</option>
          <option value="paypal">Paypal</option>
        </select>
      </div>
      {type === "credit" && (
        <>
          <div className="w-full">
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input
              id="cardNumber"
              {...methods.register("cardNumber")}
              placeholder="Card Number"
            />
            <FormError name="cardNumber" />
          </div>
          <div className="w-full">
            <Label htmlFor="cvv">CVV</Label>
            <Input id="cvv" {...methods.register("cvv")} placeholder="CVV" />
            <FormError name="cvv" />
          </div>
        </>
      )}
      {type === "paypal" && (
        <>
          <div className="w-full">
            <Label htmlFor="paypal_email">Paypal Email</Label>
            <Input
              id="paypal_email"
              {...methods.register("paypal_email")}
              placeholder="Paypal Email"
            />
            <FormError name="paypal_email" />
          </div>
        </>
      )}
    </>
  );
}

export default function FormPage() {
  const render = useRef(0);
  const methods = useForm<FormValues>({
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      type: "credit",
      address: [
        {
          province: "",
          district: "",
          subdistrict: "",
          zipcode: "",
        },
      ],
    },
    resolver,
    shouldUseNativeValidation: true,
  });

  useEffect(() => {
    render.current += 1;
  });

  return (
    <FormProvider {...methods}>
      <h1>Parent Render Count {render.current}</h1>
      <form
        className="w-full space-y-4"
        onSubmit={methods.handleSubmit(
          (data) => {
            console.log(data);
            toast.success("Success");
          },
          (error) => {
            console.log(error);
            toast.error("Invalid validation");
          }
        )}
      >
        <div className="flex gap-2 w-full">
          <div className="w-full">
            <Label htmlFor="first_name">First name</Label>
            <Input
              id="first_name"
              {...methods.register("first_name")}
              placeholder="First name"
            />
            <FormError name="first_name" />
          </div>
          <div className="w-full">
            <Label htmlFor="last_name">Last name</Label>
            <Input
              id="last_name"
              {...methods.register("last_name")}
              placeholder="Last name"
            />
            <FormError name="last_name" />
          </div>
        </div>
        <div className="w-full">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            {...methods.register("email")}
            placeholder="Email"
          />
          <FormError name="email" />
        </div>
        <RenderCountry />
        <RenderPayment />

        <div className="space-y-3">
          <h1>ข้อมูล</h1>
          <Button
            type="button"
            onClick={() => {
              methods.setValue("address", [
                ...methods.getValues("address"),
                {
                  province: "",
                  district: "",
                  subdistrict: "",
                  zipcode: "",
                },
              ]);
            }}
          >
            เพิ่มข้อมูล
          </Button>
          <Controller
            name="address"
            control={methods.control}
            render={({ field }) => {
              return <DataTable columns={columns} data={field.value} />;
            }}
          />
        </div>
        <div className="my-2">
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </FormProvider>
  );
}

const columns: ColumnDef<AddressData | AddressDataEmpty, any>[] = [
  {
    accessorKey: "province",
    header: "Province",
    cell: function Render({ row, getValue }) {
      const methods = useFormContext<FormValues>();
      const name = `address.${row.index}.province` as const;
      const state = methods.getFieldState(name, methods.formState);
      return (
        <div className="w-full">
          <select
            className={cn("h-9 rounded-md p-2 border w-full", {
              "border-red-500": state?.invalid,
            })}
            id={name}
            {...methods.register(name, {
              onChange(event: React.ChangeEvent<HTMLSelectElement>) {
                methods.setValue(`address.${row.index}.district`, "");
                methods.setValue(`address.${row.index}.subdistrict`, "");
                methods.setValue(`address.${row.index}.zipcode`, "");
                if (event.target.value === "") {
                  methods.clearErrors(`address.${row.index}`);
                }
              },
            })}
          >
            <option value="">ระบุประเทศ</option>
            {provinces?.map((province, index) => (
              <option key={`${province.name_th}${index}`} value={province.id}>
                {province.name_th}
              </option>
            ))}
          </select>
        </div>
      );
    },
  },
  {
    accessorKey: "district",
    header: "District",
    cell: function Render({ row, getValue }) {
      const methods = useFormContext<FormValues>();
      const province = useWatch({
        control: methods.control,
        name: `address.${row.index}.province`,
      });
      const name = `address.${row.index}.district` as const;
      const state = methods.getFieldState(name, methods.formState);

      return (
        <div className="w-full">
          <select
            className={cn("h-9 rounded-md p-2 border w-full", {
              "border-red-500": state?.invalid,
            })}
            id={name}
            {...methods.register(name, {
              onChange(event) {
                methods.setValue(`address.${row.index}.subdistrict`, "");
                methods.setValue(`address.${row.index}.zipcode`, "");
              },
            })}
          >
            <option value="">ระบุ</option>
            {districts?.map((district, index) => {
              if (district.province_id.toString() !== province?.toString()) {
                return null;
              }
              return (
                <option key={`${district.name_th}${index}`} value={district.id}>
                  {district.name_th}
                </option>
              );
            })}
          </select>
        </div>
      );
    },
  },
  {
    accessorKey: "subdistrict",
    header: "Subdistrict",
    cell: function Render({ row, getValue }) {
      const methods = useFormContext<FormValues>();
      const name = `address.${row.index}.subdistrict` as const;
      const district = useWatch({
        control: methods.control,
        name: `address.${row.index}.district`,
      });
      const state = methods.getFieldState(name, methods.formState);

      return (
        <div className="w-full">
          <select
            className={cn("h-9 rounded-md p-2 border w-full", {
              "border-red-500": state?.invalid,
            })}
            id={name}
            {...methods.register(name, {
              onChange(event: React.ChangeEvent<HTMLSelectElement>) {
                const zipCode =
                  event.target.selectedOptions?.[0]?.dataset?.zipcode;
                methods.setValue(
                  `address.${row.index}.zipcode`,
                  zipCode ?? "",
                  {
                    shouldValidate: true,
                  }
                );
              },
            })}
          >
            <option value="">ระบุ</option>
            {sub_districts?.map((sub_district, index) => {
              if (sub_district.amphure_id.toString() !== district?.toString()) {
                return null;
              }
              return (
                <option
                  data-zipcode={sub_district.zip_code}
                  key={`${sub_district.name_th}${index}`}
                  value={sub_district.id}
                >
                  {sub_district.name_th}
                </option>
              );
            })}
          </select>
        </div>
      );
    },
  },
  {
    accessorKey: "zipcode",
    header: "Zipcode",
    cell: function Render({ row, getValue }) {
      const methods = useFormContext<FormValues>();
      const name = `address.${row.index}.zipcode` as const;
      const state = methods.getFieldState(name, methods.formState);

      return (
        <div className="w-full">
          <Input
            disabled
            id={name}
            className={cn(state.invalid && "border-red-500")}
            {...methods.register(name)}
          />
        </div>
      );
    },
  },
];
