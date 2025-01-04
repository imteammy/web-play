export type Locale = (typeof locales)[number];
export type LocalePrefix = "as-needed" | "always" | "never";

export const locales = ["en", "th"] as const;
export const defaultLocale: Locale = "en";
