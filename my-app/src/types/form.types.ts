import {z} from "zod";

import {
  changePasswordValidationSchema,
  loginValidationSchema,
  registerValidationSchema,
  verifyEmailSchema,
  verifyPhoneSchema,
  welcomeToPremiumValidationSchema,
} from "schemas/common.schemas";

export enum FieldType {
  TEXT = "text",
  EMAIL = "email",
  PHONE = "phone",
  CHECKBOX = "checkbox",
}

export enum RegisterFormField {
  FIRST_NAME = "firstName",
  LAST_NAME = "lastName",
  USERNAME = "username",
  BIRTHDAY = "birthday",
  EMAIL = "email",
  COUNTRY = "country",
  STATE = "countryState",
  PHONE = "phone",
  AGREEMENT = "agreement",
  REFERRAL = "referral",
}

export enum LoginFormField {
  USERNAME = "username",
  PASSWORD = "password",
}

export enum ChangePasswordFormField {
  NEW_PASSWORD = "newPassword",
  REPEAT_PASSWORD = "repeatPassword",
}

export enum WelcomeToPremiumFormField {
  USERNAME = "username",
  AGREEMENT = "agreement",
}

export type RegisterValidationSchema = z.infer<ReturnType<typeof registerValidationSchema>>;

export type LoginValidationSchema = z.infer<ReturnType<typeof loginValidationSchema>>;

export type VerifyPhoneSchema = z.infer<typeof verifyPhoneSchema>;

export type VerifyEmailSchema = z.infer<ReturnType<typeof verifyEmailSchema>>;

export type ChangePasswordValidationSchema = z.infer<ReturnType<typeof changePasswordValidationSchema>>;

export type WelcomeToPremiumValidationSchema = z.infer<ReturnType<typeof welcomeToPremiumValidationSchema>>;
