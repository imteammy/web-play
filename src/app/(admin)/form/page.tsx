"use client";
import React, {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
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

import {
  Controller,
  FieldErrors,
  FormProvider,
  useForm,
  useWatch,
  Mode,
} from "react-hook-form";
import { toast } from "sonner";
import { useLocale, useTranslations } from "next-intl";
import { setUserLocale } from "@/i18n/locale";
import type { Locale } from "@/i18n/config";

import {
  resolver,
  FormValues,
  EmployeeTypeEnum,
  useFormStore,
  emptyAddressSchema,
} from "./form.schema";
import {
  RenderAddress,
  RenderCountry,
  RenderDetail,
  RenderPayment,
  RenderSalary,
} from "./form";
import { Alert } from "@/components/ui/alert";

export default function FormPage() {
  const locale = useLocale();
  const reRender = useReducer(() => ({}), {})[1];
  const render = useRef(0);
  const tl = useTranslations("form.label");
  const [mode, setMode] = useState<Mode | (string & {})>("onTouched");
  const [reValidateMode, setReValidateMode] = useState<
    Exclude<Mode, "onTouched" | "all"> | (string & {})
  >("onBlur");
  const methods = useForm<FormValues>({
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      type: "credit",
      backup_email: "",
      enable_watch: false,
      username: "",
      password: "",
      password_confirm: "",
      same_email: false,
      show_password: true,
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
      daily_rate: undefined,
      daily_rate_half: undefined,
      daily_weekend_rate: undefined,
      daily_weekend_rate_half: undefined,
      hour_rate: undefined,
      hour_rate_half: undefined,
      hour_weekend_rate: undefined,
      hour_weekend_rate_half: undefined,
    },
    resolver,
    mode: mode as Mode,
    reValidateMode: reValidateMode as "onBlur" | "onChange" | "onSubmit",
  });

  const { getValues, control, reset, register, handleSubmit, watch } = methods;
  const prefillData = useCallback(() => {
    return reset(
      (data) => ({
        ...data,
        first_name: "John",
        last_name: "Doe",

        username: "user_test",
        password: "1234567890",
        password_confirm: "1234567890",

        email: "john@email.com",
        backup_email: "john@email.com",
        same_email: true,
        enable_watch: false,
        show_password: true,
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

  useWatch({ control, disabled: !watch("enable_watch", false) });

  return (
    <FormProvider {...methods}>
      <div className="container mx-auto space-y-3 pb-20">
        <CardTitle className="sticky top-0 bg-white h-12 flex items-center justify-center text-xl ">
          Parent Render Count {render.current}
        </CardTitle>
        <Card>
          <CardHeader className="space-y-4">
            <div className="space-y-4">
              <Alert variant="success" className="leading-5 text-lg">
                <p>
                  1 กดปุ่ม submit แล้วเปลี่ยนภาษา : รองรับ error message
                  หลายภาษา
                </p>
                <p>
                  2 กดปุ่ม Prefill Data, กด submit : ข้อมูล result ตาม schema
                  model
                </p>
                <p>
                  3 ข้อมูล list, หากระบุข้อมูลอย่างใดอย่างนึงจะมี validation
                </p>
                <p>
                  4 Enable watch(), เปิดใช้งานแล้วลองกรอกข้อมูลแล้วดูที่ Parent
                  Render Count เปรียบเทียบกับขณะไม่เปิดใช้งาน
                </p>
                <p>
                  5 Mode, การ validation ข้อมูลที่กรอก ex: onChange - ทำการ
                  validation ทันที
                </p>
                <p>
                  5 Re validateMode, ทำการ re validation ข้อมูล ที่มี error
                  ในโหมดต่างๆ :ex onBlur ทำการ re validation input ที่มี error
                  message ทันทีที่ blur event
                </p>
              </Alert>
              <div>
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
              <div>
                <Label htmlFor={"mode"}>Mode (สำหรับทำการ validation)</Label>
                <Select
                  name={"mode"}
                  onValueChange={setMode}
                  defaultValue={mode}
                >
                  <SelectTrigger id={"mode"}>
                    <SelectValue placeholder="Mode" />
                  </SelectTrigger>
                  <SelectContent>
                    {["onBlur", "onChange", "onSubmit", "onTouched", "all"].map(
                      (value) => (
                        <SelectItem key={value} value={value}>
                          {value}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="reValidateMode">
                  Re ValidateMode (สำหรับทำการ re validation input ที่มี error )
                </Label>
                <Select
                  name="reValidateMode"
                  onValueChange={setReValidateMode}
                  defaultValue={reValidateMode}
                >
                  <SelectTrigger id="reValidateMode">
                    <SelectValue placeholder="Mode" />
                  </SelectTrigger>
                  <SelectContent>
                    {["onBlur", "onSubmit", "onTouched"].map((value) => (
                      <SelectItem key={value} value={value}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
              <Button
                type="button"
                onClick={() => {
                  render.current = 0;
                  reRender();
                }}
              >
                Reset Render Count
              </Button>
            </div>
            <div className="flex gap-4 items-center">
              <Input
                type="checkbox"
                className="w-fit"
                id="show_password"
                {...register("show_password")}
              />
              <Label htmlFor="show_password">Show Password</Label>
            </div>
            <div className="flex gap-4 items-center">
              <Input
                type="checkbox"
                className="w-fit"
                id="enable_watch"
                {...register("enable_watch", { value: false })}
              />
              <Label htmlFor="enable_watch">Enable watch()</Label>
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
                              address: data.address.map((e) =>
                                emptyAddressSchema.safeParse(e).success ?
                                  null
                                : e
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
              <RenderDetail />
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
                <Button type="submit">{tl("submit")}</Button>
              </div>
              {/* <RenderValues control={methods.control} /> */}
            </form>
          </CardContent>
        </Card>
      </div>
    </FormProvider>
  );
}
