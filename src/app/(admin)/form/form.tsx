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
import { InputControl } from "@/components/ui_control/input";
import { SelectControl } from "@/components/ui_control/select";
import { useLocale, useTranslations } from "next-intl";
import type { Locale } from "@/i18n/config";
export function RenderValues({ control }: { control?: any }) {
  const values = useWatch({ control });
  return <pre>{JSON.stringify(values, null, 2)}</pre>;
}
export function RenderCountry() {
  const { data: contries } = useContrys();
  const { control } = useFormContext<FormValues>();
  return (
    <SelectControl
      name="country"
      label="Country"
      control={control}
      options={[
        { label: "ระบุประเทศ", value: "" },
        ...(contries ?? []).map((e) => ({ label: e.name, value: e.enName })),
      ]}
    />
  );
}

export function RenderPayment() {
  const tl = useTranslations("form.label");
  const methods = useFormContext<FormValues>();
  const { control } = methods;
  const type = useWatch({
    control: methods.control,
    name: "type",
    defaultValue: methods.getValues("type"),
  });
  return (
    <>
      <SelectControl
        name="type"
        label={tl("payment_type")}
        control={control}
        options={[
          {
            label: "Credit",
            value: "credit",
          },
          {
            label: "Paypal",
            value: "paypal",
          },
        ]}
      />
      {type === "credit" && (
        <>
          <InputControl
            control={control}
            name="cardNumber"
            label="Card Number"
          />
          <InputControl control={control} name="cvv" label="CVV" />
        </>
      )}
      {type === "paypal" && (
        <>
          <InputControl
            control={control}
            name="paypal_email"
            label="Paypal Email"
          />
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
  replace,
}: RenderInnerAddressProps) {
  const tl = useTranslations("form.label");
  const locale = useLocale() as Locale;
  const {
    getFieldState,
    formState,
    control,
    getValues,
    setValue,
    register,
    clearErrors,
  } = useFormContext<FormValues>();

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
              const v = getValues(`address.${index}`);
              setValue(`address.${index}`, {
                province: v.province,
                district: "",
                subdistrict: "",
                zipcode: "",
              });
              if (event.target.value === "") {
                clearErrors(`address.${index}`);
              }
            },
          })}
        >
          <option value="">{tl("province")}</option>
          {provinces?.map((province, index) => (
            <option key={`${province.name_th}${index}`} value={province.id}>
              {locale === "en" ? province.name_en : province.name_th}
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
            onChange() {
              const v = getValues(`address.${index}`);

              setValue(`address.${index}`, {
                ...v,
                subdistrict: "",
                zipcode: "",
              });
            },
          })}
        >
          <option value="">{tl("district")}</option>
          {districts?.map((district, index) => {
            if (
              district.province_id.toString() !== values.province?.toString()
            ) {
              return null;
            }
            return (
              <option key={`${district.name_th}${index}`} value={district.id}>
                {locale === "en" ? district.name_en : district.name_th}
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
          <option value="">{tl("subdistrict")}</option>
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
                {locale === "en" ? sub_district.name_en : sub_district.name_th}
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
          placeholder={tl("zipcode")}
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
            {tl("reset")}
          </Button>
        : <Button
            type="button"
            onClick={() => {
              remove(index);
            }}
          >
            {tl("remove")}
          </Button>
        }
      </div>
    </div>
  );
}

export function RenderSalary() {
  const { control, setValue, formState, getFieldState } =
    useFormContext<FormValues>();
  const employee_type = useWatch({ control, name: "employee_type" });

  return (
    <>
      <Controller
        control={control}
        name="employee_type"
        render={({ field, fieldState }) => (
          <div>
            <Label htmlFor={field.name}>Employee Type</Label>
            <Select
              name={field.name}
              value={field.value}
              onValueChange={field.onChange}
              onOpenChange={field.onBlur}
              disabled={field.disabled}
            >
              <SelectTrigger
                id={field.name}
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
        <InputControl
          type="number"
          control={control}
          name="amount"
          label="Amount"
        />
      )}
      {employee_type === EmployeeTypeEnum.FULLTIME && (
        <>
          <InputControl
            type="number"
            control={control}
            name="probation"
            label="Probation"
          />
          <InputControl
            type="number"
            control={control}
            name="pass_probation"
            label="Pass probation"
          />
        </>
      )}
      {employee_type === EmployeeTypeEnum.PARTTIME && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <InputControl
            type="number"
            control={control}
            name="daily_rate"
            label="รายวัน"
            placeholder="รายวัน"
            rules={{
              onChange(event) {
                const daily_rate_half_state = getFieldState(
                  "daily_rate_half",
                  formState
                );

                setValue(
                  `daily_rate_half`,
                  Math.trunc(event.target.value / 2),
                  {
                    shouldValidate: daily_rate_half_state.invalid,
                  }
                );
              },
            }}
          />
          <InputControl
            type="number"
            control={control}
            name="daily_rate_half"
            label="รายวัน (ครึ่งวัน)"
            placeholder="รายวัน (ครึ่งวัน)"
          />

          {/*  */}

          <InputControl
            label="รายวันเสาร์อาทิตย์"
            type="number"
            name="daily_weekend_rate"
            rules={{
              onChange(event) {
                setValue(
                  `daily_weekend_rate_half`,
                  Math.trunc(event.target.value / 2),
                  {
                    shouldValidate: getFieldState(
                      "daily_weekend_rate_half",
                      formState
                    ).invalid,
                  }
                );
              },
            }}
            placeholder="รายวันเสาร์อาทิตย์"
          />
          <InputControl
            type="number"
            control={control}
            name="daily_weekend_rate_half"
            label="รายวันเสาร์อาทิตย์ (ครึ่งวัน)"
            placeholder="รายวันเสาร์อาทิตย์ (ครึ่งวัน)"
          />

          {/*  */}

          <InputControl
            type="number"
            control={control}
            rules={{
              onChange(event) {
                setValue(
                  `hour_rate_half`,
                  Math.max(Math.trunc(event.target.value - 2), 0),
                  {
                    shouldValidate: getFieldState("hour_rate_half", formState)
                      .invalid,
                  }
                );
              },
            }}
            name="hour_rate"
            label="รายวัน (ครึ่งวัน)"
            placeholder="รายชั่วโมง (ครึ่งวัน)"
          />
          <InputControl
            type="number"
            control={control}
            name="hour_rate_half"
            label="รายวัน (ครึ่งวัน)"
            placeholder="รายชั่วโมง (ครึ่งวัน)"
          />

          {/*  */}

          <InputControl
            type="number"
            control={control}
            name="hour_weekend_rate"
            label="รายชั่วโมงเสาร์อาทิตย์"
            placeholder="รายชั่วโมงเสาร์อาทิตย์"
            rules={{
              onChange(event) {
                setValue(
                  `hour_weekend_rate_half`,
                  Math.max(Math.trunc(event.target.value - 2), 0),
                  {
                    shouldValidate: getFieldState(
                      "hour_weekend_rate_half",
                      formState
                    ).invalid,
                  }
                );
              },
            }}
          />
          <InputControl
            type="number"
            control={control}
            name="hour_weekend_rate_half"
            label="รายชั่วโมงเสาร์อาทิตย์ (ครึ่งวัน)"
            placeholder="รายชั่วโมงเสาร์อาทิตย์ (ครึ่งวัน)"
          />
        </div>
      )}
    </>
  );
}

export function RenderDetail() {
  const tl = useTranslations("form.label");
  const {
    control,
    register,
    setValue,
    getValues,
    formState,
    trigger,
    getFieldState,
  } = useFormContext<FormValues>();

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
        <InputControl
          control={control}
          name="first_name"
          label={tl("firstname")}
        />
        <InputControl name="last_name" label={tl("lastname")} />
      </div>
      <InputControl name="username" label={tl("username")} />

      <div className="flex gap-2 w-full">
        <InputControl
          name="password"
          label={tl("password")}
          type={show_password ? "text" : "password"}
          rules={{
            onChange(event) {
              const values = getValues();
              if (values.password_confirm === event.target.value) {
                trigger("password_confirm");
              }
            },
          }}
        />
        <InputControl
          type={show_password ? "text" : "password"}
          name="password_confirm"
          label={tl("password_confirm")}
        />
      </div>

      <InputControl
        type="email"
        name="email"
        label={tl("email")}
        rules={{
          onChange(event) {
            handleBackupEmailFill(event.target.value);
          },
          onBlur(event) {
            handleBackupEmailFill(event.target.value);
          },
        }}
      />

      <div className="w-full flex gap-4 items-center">
        <Input
          type="checkbox"
          className="w-fit size-4"
          id="same_email"
          {...register("same_email", {
            onChange() {
              handleBackupEmailFill(getValues("email"));
            },
          })}
        />
        <Label htmlFor="same_email">Use same Email</Label>
      </div>
      <InputControl
        disabled={same_email}
        type="email"
        name="backup_email"
        label="Backup Email"
      />
    </>
  );
}
