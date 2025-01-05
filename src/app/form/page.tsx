"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormError } from "@/components/form-error";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { FieldErrors, FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useLocale } from "next-intl";
import { setUserLocale } from "@/i18n/locale";
import type { Locale } from "@/i18n/config";

import {
  resolver,
  FormValues,
  EmployeeTypeEnum,
  useFormStore,
} from "./form.schema";
import {
  RenderAddress,
  RenderCountry,
  RenderDetail,
  RenderPayment,
  RenderSalary,
} from "./form";
import { emptyAddressSchema } from "./internal_page";
import { Alert } from "@/components/ui/alert";

export default function FormPage() {
  const locale = useLocale();
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
      employee_type: EmployeeTypeEnum.PARTTIME,
      cvv: "",
      cardNumber: "",
      country: "",
      daily_rate: NaN,
      daily_rate_half: NaN,
      daily_weekend_rate: NaN,
      daily_weekend_rate_half: NaN,
      hour_rate: NaN,
      hour_rate_half: NaN,
      hour_weekend_rate: NaN,
      hour_weekend_rate_half: NaN,
    },
    resolver,
  });
  const { reset, register, handleSubmit } = methods;
  const prefillData = useCallback(() => {
    return reset(
      (data) => ({
        ...data,
        first_name: "John",
        last_name: "Doe",
        email: "john@email.com",
        country: "Thailand",
        cardNumber: "1234567890123456",
        cvv: "123",
        employee_type: EmployeeTypeEnum.PARTTIME,
        type: "paypal",

        daily_rate: 400,
        daily_rate_half: 200,

        daily_weekend_rate: 450,
        daily_weekend_rate_half: 225,

        hour_rate: 35,
        hour_rate_half: 32,

        hour_weekend_rate: 42,
        hour_weekend_rate_half: 40,

        paypal_email: "paypal@email.com",
        address: [
          {
            province: "13",
            district: "2202",
            subdistrict: "220204",
            zipcode: "22110",
          },
        ],
      }),
      { keepDefaultValues: true }
    );
  }, [reset]);

  useEffect(() => {
    render.current += 1;
  });

  return (
    <FormProvider {...methods}>
      <div className="container mx-auto space-y-3 pb-20">
        <CardTitle className="sticky top-0 bg-white h-12 flex items-center justify-center text-xl ">
          Parent Render Count {render.current}
        </CardTitle>
        <Card>
          <CardHeader className="">
            <div>
              <Alert variant="destructive">
                <p>
                  1 กดปุ่ม submit แล้วเปลี่ยนภาษา : รองรับ error message
                  หลายภาษา
                </p>
                <p>
                  2 กดปุ่ม Prefill Data, กด submit : ข้อมูล result ตาม schema
                  model
                </p>
                <p>
                  3 ข้อมูล list, หากระบุข้อมูลอย่างใดอย่างนึงจะมี
                  validation
                </p>
              </Alert>
              <Label htmlFor="locale">Change Language</Label>
              <Select
                name="locale"
                defaultValue={locale}
                onValueChange={(lang) => {
                  setUserLocale(lang as Locale);
                }}
              >
                <SelectTrigger id="locale">
                  <SelectValue placeholder="change language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="th">Thai</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button type="button" onClick={prefillData}>
                Prefill Data
              </Button>
              <Button
                type="button"
                onClick={() => {
                  methods.reset();
                }}
              >
                Reset to default
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form
              className="w-full space-y-4"
              onSubmit={handleSubmit(
                (data) => {
                  console.log(data);
                  toast.success(
                    <div>
                      <h1>Success</h1>
                      <pre>
                        <pre>
                          {JSON.stringify(
                            {
                              ...data,
                              address: data.address.filter(
                                (e) => !emptyAddressSchema.safeParse(e).success
                              ),
                            },
                            null,
                            4
                          )}
                        </pre>
                      </pre>
                    </div>,
                    {
                      id: JSON.stringify(data),
                    }
                  );
                },
                (error) => {
                  useFormStore.getState().saveError(error);
                  console.log(error);
                  toast.error("Invalid validation");
                }
              )}
            >
              <RenderDetail register={register} />
              <Separator />

              <RenderCountry />
              <Separator />

              <RenderPayment />
              <Separator />

              <RenderAddress />
              <Separator />

              <RenderSalary />
              <Separator />

              <div className="my-2">
                <Button type="submit">Submit</Button>
              </div>
              {/* <RenderValues control={methods.control} /> */}
            </form>
          </CardContent>
        </Card>
      </div>
    </FormProvider>
  );
}
