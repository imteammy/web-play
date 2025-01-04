"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import React, { useEffect, useRef } from "react";
import {
  Controller,
  FormProvider,
  useFieldArray,
  UseFieldArrayReturn,
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
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePathname } from "next/navigation";
import { setUserLocale } from "@/i18n/locale";
import type { Locale } from "@/i18n/config";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

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

export const emptyAddressSchema = z.object({
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
      <select className="" id="country" {...methods.register("country")}>
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
        <select className="" {...methods.register("type")}>
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

function RenderAddress() {
  const methods = useFormContext<FormValues>();
  const arr = useFieldArray({
    control: methods.control,
    name: "address",
  });
  const { register } = methods;
  return (
    <div className="space-y-3">
      <h1>ข้อมูล</h1>
      <Button
        type="button"
        onClick={() => {
          arr.append({
            province: "",
            district: "",
            subdistrict: "",
            zipcode: "",
          });
        }}
      >
        เพิ่มข้อมูล
      </Button>
      {arr.fields.map(function Reneder(field, index) {
        return <RenderInnerAddress key={field.id} {...arr} index={index} />;
      })}
    </div>
  );
}

interface RenderInnerAddressProps
  extends UseFieldArrayReturn<FormValues, "address", "id"> {
  index: number;
}

function RenderInnerAddress({
  remove,
  index,
  update,
  replace,
}: RenderInnerAddressProps) {
  const { getFieldState, formState, control, setValue, register, clearErrors } =
    useFormContext<FormValues>();

  const state = {
    province: getFieldState(`address.${index}.province`, formState),
    district: getFieldState(`address.${index}.district`, formState),
    subdistrict: getFieldState(`address.${index}.subdistrict`, formState),
    zipcode: getFieldState(`address.${index}.zipcode`, formState),
  };
  const values = useWatch({ control, name: `address.${index}` });
  return (
    <div className="flex gap-4">
      <div className="w-full">
        <select
          className={cn("", {
            "border-red-500": state.province?.invalid,
          })}
          id={`address.${index}.province`}
          {...register(`address.${index}.province`, {
            onChange(event: React.ChangeEvent<HTMLSelectElement>) {
              setValue(`address.${index}.district`, "");
              setValue(`address.${index}.subdistrict`, "");
              setValue(`address.${index}.zipcode`, "");
              if (event.target.value === "") {
                clearErrors(`address.${index}`);
              }
            },
          })}
        >
          <option value="">ระบุ</option>
          {provinces?.map((province, index) => (
            <option key={`${province.name_th}${index}`} value={province.id}>
              {province.name_th}
            </option>
          ))}
        </select>
      </div>
      <div className="w-full">
        <select
          className={cn("", {
            "border-red-500": state.district?.invalid,
          })}
          id={`address.${index}.district`}
          {...register(`address.${index}.district`, {
            onChange(event) {
              setValue(`address.${index}.subdistrict`, "");
              setValue(`address.${index}.zipcode`, "");
            },
          })}
        >
          <option value="">ระบุ</option>
          {districts?.map((district, index) => {
            if (
              district.province_id.toString() !== values.province?.toString()
            ) {
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
      <div className="w-full">
        <select
          className={cn("", {
            "border-red-500": state.subdistrict?.invalid,
          })}
          id={`address.${index}.subdistrict`}
          {...register(`address.${index}.subdistrict`, {
            onChange(event: React.ChangeEvent<HTMLSelectElement>) {
              const zipCode =
                event.target.selectedOptions?.[0]?.dataset?.zipcode;
              setValue(`address.${index}.zipcode`, zipCode ?? "", {
                shouldValidate: true,
              });
            },
          })}
        >
          <option value="">ระบุ</option>
          {sub_districts?.map((sub_district, index) => {
            if (
              sub_district.amphure_id.toString() !== values.district?.toString()
            ) {
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
      <div className="w-full">
        <Input
          disabled
          id={`address.${index}.zipcode`}
          className={cn(state.zipcode.invalid && "border-red-500")}
          {...register(`address.${index}.zipcode`)}
          placeholder="Zipcode"
        />
      </div>
      <div className="w-full">
        {index === 0 ?
          <Button
            type="button"
            onClick={() => {
              replace([
                {
                  province: "",
                  district: "",
                  subdistrict: "",
                  zipcode: "",
                },
              ]);
            }}
          >
            Reset
          </Button>
        : <Button
            type="button"
            onClick={() => {
              remove(index);
            }}
          >
            ลบข้อมูล
          </Button>
        }
      </div>
    </div>
  );
}

function RenderValues({ control }: { control?: any }) {
  const values = useWatch({ control });
  return <pre>{JSON.stringify(values, null, 2)}</pre>;
}