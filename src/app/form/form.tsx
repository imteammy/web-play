"use client";
import React, { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormError } from "@/components/form-error";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

import {
  Controller,
  useFieldArray,
  UseFieldArrayReturn,
  useFormContext,
  UseFormRegister,
  useWatch,
} from "react-hook-form";
import { useContrys } from "@/hooks/use-contrys";
import { districts, provinces } from "@/hooks/data";
import { sub_districts } from "@/hooks/sub_districts";

import { FormValues, EmployeeTypeEnum } from "./form.schema";
import { WatchRender } from "@/components/design/watch-render";
export function RenderValues({ control }: { control?: any }) {
  const values = useWatch({ control });
  return <pre>{JSON.stringify(values, null, 2)}</pre>;
}
export function RenderCountry() {
  const { data: contries } = useContrys();
  const methods = useFormContext<FormValues>();
  return (
    <div className="w-full">
      <Label htmlFor="country">Country</Label>
      <select autoComplete="none" id="country" {...methods.register("country")}>
        <option value="">ระบุประเทศ</option>
        {contries?.map((country, index) => (
          <option key={`${country.name}${index}`} value={country.enName}>
            {country.name}
          </option>
        ))}
      </select>
      <FormError name="country" />
    </div>
  );
}

export function RenderPayment() {
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
        <select id="type" className="" {...methods.register("type")}>
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

export function RenderAddress() {
  const methods = useFormContext<FormValues>();
  const arr = useFieldArray({
    control: methods.control,
    name: "address",
  });
  return (
    <div className="space-y-3 relative overflow-auto">
      <h1>ข้อมูล</h1>
      <Button
        type="button"
        onClick={() => {
          arr.append(
            {
              province: "",
              district: "",
              subdistrict: "",
              zipcode: "",
            },
            {
              shouldFocus: arr.fields.length < 10,
            }
          );
        }}
      >
        เพิ่มข้อมูล
      </Button>
      <>
        {arr.fields.map((field, index) => {
          return <RenderInnerAddress key={field.id} {...arr} index={index} />;
        })}
      </>
    </div>
  );
}

interface RenderInnerAddressProps
  extends UseFieldArrayReturn<FormValues, "address", "id"> {
  index: number;
}

export function RenderInnerAddress({
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
    <div className="flex flex-col md:flex-row gap-4 overflow-auto">
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
          className={cn("min-w-20", state.zipcode.invalid && "border-red-500")}
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
            รีเซ็ต
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

export function RenderSalary() {
  const { control, register, setValue, formState, getFieldState } =
    useFormContext<FormValues>();
  const employee_type = useWatch({ control, name: "employee_type" });

  return (
    <>
      <Controller
        control={control}
        name="employee_type"
        render={({ field, fieldState }) => (
          <div>
            <Label htmlFor="employee_type">Employee Type</Label>
            <Select
              name="employee_type"
              value={field.value}
              onValueChange={field.onChange}
              onOpenChange={field.onBlur}
              disabled={field.disabled}
            >
              <SelectTrigger
                id="employee_type"
                className={cn(fieldState.invalid && "border-red-500")}
                ref={field.ref}
              >
                <SelectValue placeholder />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={EmployeeTypeEnum.DAILY}>Daily</SelectItem>
                <SelectItem value={EmployeeTypeEnum.PARTTIME}>
                  Parttime
                </SelectItem>
                <SelectItem value={EmployeeTypeEnum.FULLTIME}>
                  Fulltime
                </SelectItem>
              </SelectContent>
            </Select>
            <FormError name="employee_type" />
          </div>
        )}
      />
      {employee_type === EmployeeTypeEnum.DAILY && (
        <>
          <div>
            <Label htmlFor="amount">Amount</Label>
            <Input
              type="number"
              id="amount"
              {...register("amount", { valueAsNumber: true })}
              placeholder="amount"
            />
            <FormError name="amount" />
          </div>
        </>
      )}
      {employee_type === EmployeeTypeEnum.FULLTIME && (
        <>
          <div>
            <Label htmlFor="probation">Probation</Label>
            <Input
              type="number"
              id="probation"
              {...register("probation", { valueAsNumber: true })}
              placeholder="probation"
            />
            <FormError name="probation" />
          </div>
          <div>
            <Label htmlFor="pass_probation">Pass probation</Label>
            <Input
              type="number"
              id="pass_probation"
              {...register("pass_probation", { valueAsNumber: true })}
              placeholder="pass_probation"
            />
            <FormError name="pass_probation" />
          </div>
        </>
      )}
      {employee_type === EmployeeTypeEnum.PARTTIME && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="daily_rate">รายวัน</Label>
            <Input
              type="number"
              id="daily_rate"
              {...register("daily_rate", {
                valueAsNumber: true,
                onChange(event: React.ChangeEvent<HTMLInputElement>) {
                  setValue(
                    `daily_rate_half`,
                    Math.trunc(event.target.valueAsNumber / 2),
                    {
                      shouldValidate: getFieldState(
                        "daily_rate_half",
                        formState
                      ).invalid,
                    }
                  );
                },
              })}
              placeholder="daily_rate"
            />
            <FormError name="daily_rate" />
          </div>
          <div>
            <Label htmlFor="daily_rate_half">รายวัน (ครึ่งวัน)</Label>
            <Input
              type="number"
              id="daily_rate_half"
              {...register("daily_rate_half", {
                valueAsNumber: true,
              })}
              placeholder="daily_rate_half"
            />
            <FormError name="daily_rate_half" />
          </div>

          {/*  */}

          <div>
            <Label htmlFor="daily_weekend_rate">รายวันเสาร์อาทิตย์</Label>
            <Input
              type="number"
              id="daily_weekend_rate"
              {...register("daily_weekend_rate", {
                valueAsNumber: true,
                onChange(event: React.ChangeEvent<HTMLInputElement>) {
                  setValue(
                    `daily_weekend_rate_half`,
                    Math.trunc(event.target.valueAsNumber / 2),
                    {
                      shouldValidate: getFieldState(
                        "daily_weekend_rate_half",
                        formState
                      ).invalid,
                    }
                  );
                },
              })}
              placeholder="daily_weekend_rate"
            />
            <FormError name="daily_weekend_rate" />
          </div>
          <div>
            <Label htmlFor="daily_weekend_rate_half">
              รายวันเสาร์อาทิตย์ (ครึ่งวัน)
            </Label>
            <Input
              type="number"
              id="daily_weekend_rate_half"
              {...register("daily_weekend_rate_half", { valueAsNumber: true })}
              placeholder="daily_weekend_rate_half"
            />
            <FormError name="daily_weekend_rate_half" />
          </div>

          {/*  */}

          <div>
            <Label htmlFor="hour_rate">รายชั่วโมง</Label>
            <Input
              type="number"
              id="hour_rate"
              {...register("hour_rate", {
                valueAsNumber: true,
                onChange(event: React.ChangeEvent<HTMLInputElement>) {
                  setValue(
                    `hour_rate_half`,
                    Math.max(Math.trunc(event.target.valueAsNumber - 2), 0),
                    {
                      shouldValidate: getFieldState("hour_rate_half", formState)
                        .invalid,
                    }
                  );
                },
              })}
              placeholder="hour_rate"
            />
            <FormError name="hour_rate" />
          </div>
          <div>
            <Label htmlFor="hour_rate_half">รายชั่วโมง (ครึ่งวัน)</Label>
            <Input
              type="number"
              id="hour_rate_half"
              {...register("hour_rate_half", { valueAsNumber: true })}
              placeholder="hour_rate_half"
            />
            <FormError name="hour_rate_half" />
          </div>

          {/*  */}

          <div>
            <Label htmlFor="hour_weekend_rate">รายชั่วโมงเสาร์อาทิตย์</Label>
            <Input
              type="number"
              id="hour_weekend_rate"
              {...register("hour_weekend_rate", {
                valueAsNumber: true,
                onChange(event: React.ChangeEvent<HTMLInputElement>) {
                  setValue(
                    `hour_weekend_rate_half`,
                    Math.max(Math.trunc(event.target.valueAsNumber - 2), 0),
                    {
                      shouldValidate: getFieldState(
                        "hour_weekend_rate_half",
                        formState
                      ).invalid,
                    }
                  );
                },
              })}
              placeholder="hour_weekend_rate"
            />
            <FormError name="hour_weekend_rate" />
          </div>
          <div>
            <Label htmlFor="hour_weekend_rate_half">
              รายชั่วโมงเสาร์อาทิตย์ (ครึ่งวัน)
            </Label>
            <Input
              type="number"
              id="hour_weekend_rate_half"
              {...register("hour_weekend_rate_half", {
                valueAsNumber: true,
              })}
              placeholder="hour_weekend_rate_half"
            />
            <FormError name="hour_weekend_rate_half" />
          </div>
        </div>
      )}
    </>
  );
}

export function RenderDetail() {
  const {
    control,
    register,
    setValue,
    getValues,
    formState,
    trigger,
    watch,
    getFieldState,
  } = useFormContext<FormValues>();

  const state = useCallback(
    () => ({
      password: getFieldState("password", formState),
      password_confirm: getFieldState("password_confirm", formState),
    }),
    [formState]
  );

  const handleBackupEmailFill = (value: string) => {
    if (!getValues("same_email")) {
      return;
    }

    setValue("backup_email", value, {
      shouldDirty: false,
      shouldTouch: false,
      shouldValidate: getFieldState("backup_email", formState).invalid,
    });
  };

  const [show_password, same_email] = useWatch({
    control,
    defaultValue: getValues(),
    name: ["show_password", "same_email"],
  });
  return (
    <>
      <div className="flex gap-2 w-full">
        <div className="w-full">
          <Label htmlFor="first_name">First name</Label>
          <Input
            id="first_name"
            {...register("first_name")}
            placeholder="First name"
          />
          <FormError name="first_name" />
        </div>
        <div className="w-full">
          <Label htmlFor="last_name">Last name</Label>
          <Input
            id="last_name"
            {...register("last_name")}
            placeholder="Last name"
          />
          <FormError name="last_name" />
        </div>
      </div>
      <div className="w-full">
        <Label htmlFor="username">Username</Label>
        <Input id="username" {...register("username")} placeholder="Username" />
        <FormError name="username" />
      </div>
      <div className="flex gap-2 w-full">
        <div className="w-full">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type={show_password ? "text" : "password"}
            {...register("password", {
              onChange(event) {
                const s = state();
                if (!s.password.invalid && s.password_confirm.invalid) {
                  trigger("password_confirm");
                }
              },
            })}
            placeholder="password"
          />
          <FormError name="password" />
        </div>
        <div className="w-full">
          <Label htmlFor="password_confirm">Password confirm</Label>
          <Input
            type={show_password ? "text" : "password"}
            id="password_confirm"
            {...register("password_confirm")}
            placeholder="password confirm"
          />
          <FormError name="password_confirm" />
        </div>
      </div>
      <div className="w-full">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          {...register("email", {
            onChange(event) {
              handleBackupEmailFill(event.target.value);
            },
            onBlur(event) {
              handleBackupEmailFill(event.target.value);
            },
          })}
          placeholder="Email"
        />
        <FormError name="email" />
      </div>

      <div className="w-full flex gap-4 items-center">
        <Input
          type="checkbox"
          className="w-fit size-4"
          id="same_email"
          {...register("same_email", {
            onChange(event) {
              handleBackupEmailFill(getValues("email"));
            },
          })}
        />
        <Label htmlFor="same_email">Use same Email</Label>
      </div>

      <div className="w-full">
        <Label htmlFor="backup_email">Backup backup_email</Label>
        <Input
          disabled={same_email}
          id="backup_email"
          {...register("backup_email")}
          placeholder="Backup email"
        />
        <FormError name="backup_email" />
      </div>
    </>
  );
}
