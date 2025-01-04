import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

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
  province: z.string().nonempty().min(1),
  district: z.string().nonempty().min(1),
  subdistrict: z.string().nonempty().min(1),
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
    first_name: z.string().trim().nonempty(),
    last_name: z.string().trim().nonempty(),
    email: z.string().trim().email(),
    country: z.string().trim().nonempty(),
    address: addressSchema.or(emptyAddressSchema).array(),
  })
  .and(paymentSchema)
  .and(saralySchema);

export type FormValues = z.infer<typeof schema>;
export const resolver = zodResolver(schema);
