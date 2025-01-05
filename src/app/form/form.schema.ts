import { zodResolver } from "@hookform/resolvers/zod";
import { FieldErrors } from "react-hook-form";
import { z } from "zod";
import { createWithEqualityFn as create } from "zustand/traditional";
import { persist } from "zustand/middleware";
export enum EmployeeTypeEnum {
  FULLTIME = "FULLTIME",
  PARTTIME = "PARTTIME",
  DAILY = "DAILY",
}

//
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
  province: z.string().nonempty().min(1).max(255),
  district: z.string().nonempty().min(1).max(255),
  subdistrict: z.string().nonempty().min(1).max(255),
  zipcode: z.string().nonempty().min(5).max(5),
});
type AddressData = z.infer<typeof addressSchema>;
type AddressDataEmpty = z.infer<typeof emptyAddressSchema>;

const saralySchema = z.discriminatedUnion("employee_type", [
  z.object({
    employee_type: z.literal(EmployeeTypeEnum.DAILY),
    amount: z.number().int(),
  }),
  z.object({
    employee_type: z.literal(EmployeeTypeEnum.FULLTIME),
    probation: z.number().int(),
    pass_probation: z.number().int(),
  }),
  z.object({
    employee_type: z.literal(EmployeeTypeEnum.PARTTIME),
    daily_rate: z.number().int().gte(0).max(Number.MAX_SAFE_INTEGER),
    daily_rate_half: z.number().int().gte(0).max(Number.MAX_SAFE_INTEGER),
    daily_weekend_rate: z.number().int().gte(0).max(Number.MAX_SAFE_INTEGER),
    daily_weekend_rate_half: z
      .number()
      .int()
      .gte(0)
      .max(Number.MAX_SAFE_INTEGER),

    hour_rate: z.number().int().gte(0).max(Number.MAX_SAFE_INTEGER),
    hour_rate_half: z.number().int().gte(0).max(Number.MAX_SAFE_INTEGER),
    hour_weekend_rate: z.number().int().gte(0).max(Number.MAX_SAFE_INTEGER),
    hour_weekend_rate_half: z
      .number()
      .int()
      .gte(0)
      .max(Number.MAX_SAFE_INTEGER),
  }),
]);

const emptyAddressSchema = z.object({
  province: z.literal(""),
  district: z.literal(""),
  subdistrict: z.literal(""),
  zipcode: z.literal(""),
});

const schema = z
  .object({
    first_name: z.string().trim().nonempty().max(255),
    last_name: z.string().trim().nonempty().max(255),
    username: z.string().trim().min(6).max(255),
    password: z.string().trim().min(6).max(255),
    password_confirm: z.string().trim().min(6).max(255),
    email: z.string().trim().email().min(1),
    backup_email: z.string().trim().email().min(1),
    same_email: z.boolean(),
    country: z.string().trim().nonempty().max(255),
    address: addressSchema.or(emptyAddressSchema).array().max(50),
  })
  .refine((v) => v.password === v.password_confirm, {
    message: "customValidation.confirmPassword_match",
    path: ["password_confirm"],
  })
  .refine(
    (v) => {
      if (v.same_email) {
        return v.email === v.backup_email;
      }
      return true;
    },
    {
      message: "customValidation.email_not_match",
      path: ["backup_email"],
    }
  )
  .and(paymentSchema)
  .and(saralySchema);

type InterRefFormValue = {
  show_password: boolean;
  enable_watch: boolean;
};

export type FormValues = z.infer<typeof schema> & InterRefFormValue;
export const resolver = zodResolver(schema);

type FormStoreState = {
  error: FieldErrors<FormValues>;
  saveError: (err: FieldErrors<FormValues>) => void;
};

export const useFormStore = create<FormStoreState>()(
  persist(
    (set, get) => ({
      error: {},
      saveError(err) {
        const errstring = JSON.stringify(
          { ...err },
          (k, v) => {
            if (v instanceof HTMLElement) return;
            if (v instanceof BigInt) return v.toString();
            return v;
          },
          4
        );
        set({
          error: JSON.parse(errstring),
        });
      },
    }),
    {
      name: "form",
      version: 1,
    }
  )
);
